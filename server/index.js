import http from 'node:http'
import { createHmac, randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const port = Number(process.env.PAYMENT_API_PORT || 8787)
const isProduction = process.env.PAYMENT_ENV === 'production'
const environment = isProduction ? 'production' : 'sandbox'
const mtnBaseUrl = isProduction
  ? 'https://proxy.momoapi.mtn.com'
  : 'https://sandbox.momodeveloper.mtn.com'
const airtelBaseUrl = isProduction
  ? 'https://openapi.airtel.africa'
  : 'https://openapiuat.airtel.africa'
const transactions = new Map()
const cryptoTradingMode = process.env.BINANCE_TRADING_MODE === 'live' ? 'live' : 'testnet'
const binanceBaseUrl = process.env.BINANCE_BASE_URL || (cryptoTradingMode === 'live' ? 'https://api.binance.com' : 'https://testnet.binance.vision')
const allowedCryptoSymbols = new Set(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'])
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.APP_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Secret',
}

const json = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders })
  response.end(JSON.stringify(body))
}

const readBody = async (request) => {
  let body = ''
  for await (const chunk of request) body += chunk
  return body ? JSON.parse(body) : {}
}

const required = (values) => values.every((value) => typeof value === 'string' && value.trim())

const binanceRequest = async (path, { method = 'GET', params = {}, signed = false } = {}) => {
  const query = new URLSearchParams(params)
  if (signed) {
    if (!required([process.env.BINANCE_API_KEY, process.env.BINANCE_API_SECRET])) {
      throw new Error('Binance API credentials are not configured')
    }
    query.set('timestamp', String(Date.now()))
    query.set('recvWindow', '5000')
    const signature = createHmac('sha256', process.env.BINANCE_API_SECRET).update(query.toString()).digest('hex')
    query.set('signature', signature)
  }

  const response = await fetch(`${binanceBaseUrl}${path}?${query.toString()}`, {
    method,
    headers: process.env.BINANCE_API_KEY ? { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY } : undefined,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.msg || `Binance request failed with ${response.status}`)
  return data
}

const cryptoTicker = async (symbol) => {
  if (!allowedCryptoSymbols.has(symbol)) throw new Error('Unsupported crypto symbol')
  const [ticker, candles] = await Promise.all([
    binanceRequest('/api/v3/ticker/24hr', { params: { symbol } }),
    binanceRequest('/api/v3/klines', { params: { symbol, interval: '1h', limit: '12' } }),
  ])
  return {
    symbol,
    price: Number(ticker.lastPrice),
    change: `${Number(ticker.priceChangePercent) >= 0 ? '+' : ''}${Number(ticker.priceChangePercent).toFixed(2)}%`,
    positive: Number(ticker.priceChangePercent) >= 0,
    volume: `$${(Number(ticker.quoteVolume) / 1000000).toFixed(1)}M`,
    candles: candles.map((candle) => ({ open: Number(candle[1]), high: Number(candle[2]), low: Number(candle[3]), close: Number(candle[4]) })),
  }
}

const createMtnToken = async () => {
  if (!required([process.env.MTN_SUBSCRIPTION_KEY, process.env.MTN_API_USER, process.env.MTN_API_KEY])) {
    throw new Error('MTN credentials are not configured')
  }

  const authorization = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64')
  const response = await fetch(`${mtnBaseUrl}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
    },
  })

  if (!response.ok) throw new Error(`MTN token request failed with ${response.status}`)
  const data = await response.json()
  return data.access_token
}

const collectWithMtn = async ({ amount, currency, phone, reference, callbackUrl }) => {
  const token = await createMtnToken()
  const response = await fetch(`${mtnBaseUrl}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Reference-Id': reference,
      'X-Target-Environment': environment,
      'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: String(amount),
      currency,
      externalId: reference,
      payer: { partyIdType: 'MSISDN', partyId: phone },
      payerMessage: 'Jaguar Markets payment confirmation',
      payeeNote: 'Jaguar Markets investment funding',
      callbackUrl,
    }),
  })

  if (response.status !== 202) throw new Error(`MTN collection request failed with ${response.status}`)
  return { providerReference: reference, status: 'pending_customer_confirmation' }
}

const getMtnStatus = async (reference) => {
  const token = await createMtnToken()
  const response = await fetch(`${mtnBaseUrl}/collection/v1_0/requesttopay/${reference}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Target-Environment': environment,
      'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
    },
  })

  if (!response.ok) throw new Error(`MTN status request failed with ${response.status}`)
  const data = await response.json()
  return data.status || 'PENDING'
}

const createAirtelToken = async () => {
  if (!required([process.env.AIRTEL_CLIENT_ID, process.env.AIRTEL_CLIENT_SECRET])) {
    throw new Error('Airtel credentials are not configured')
  }

  const credentials = Buffer.from(`${process.env.AIRTEL_CLIENT_ID}:${process.env.AIRTEL_CLIENT_SECRET}`).toString('base64')
  const response = await fetch(`${airtelBaseUrl}/auth/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) throw new Error(`Airtel token request failed with ${response.status}`)
  const data = await response.json()
  return data.access_token
}

const collectWithAirtel = async ({ amount, currency, phone, reference }) => {
  const token = await createAirtelToken()
  const response = await fetch(`${airtelBaseUrl}/merchant/v1/payments/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
      'X-Country': 'UG',
      'X-Currency': currency,
    },
    body: JSON.stringify({
      reference,
      subscriber: { country: 'UG', currency, msisdn: phone },
      transaction: {
        amount: Number(amount),
        country: 'UG',
        currency,
        id: reference,
      },
    }),
  })

  const data = await response.json()
  if (!response.ok || data.status?.success === false) {
    throw new Error(`Airtel collection request failed with ${response.status}`)
  }
  return { providerReference: reference, status: 'pending_customer_confirmation' }
}

const getAirtelStatus = async (reference) => {
  const token = await createAirtelToken()
  const response = await fetch(`${airtelBaseUrl}/standard/v1/payments/${reference}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      'X-Country': 'UG',
      'X-Currency': 'UGX',
    },
  })

  if (!response.ok) throw new Error(`Airtel status request failed with ${response.status}`)
  const data = await response.json()
  return data.data?.transaction?.status || data.status?.message || 'PENDING'
}

const normalizeStatus = (status) => {
  const normalized = String(status).toUpperCase()
  if (['SUCCESSFUL', 'SUCCESS', 'COMPLETED', 'TS'].includes(normalized)) return 'completed'
  if (['FAILED', 'FAILURE', 'REJECTED', 'TF'].includes(normalized)) return 'failed'
  return 'pending_customer_confirmation'
}

const verifyWebhook = (request) => {
  const configuredSecret = process.env.PAYMENT_WEBHOOK_SECRET
  return Boolean(configuredSecret && request.headers['x-webhook-secret'] === configuredSecret)
}

const persistTransaction = async (transaction) => {
  if (!supabase) return
  const { error } = await supabase.from('payment_transactions').upsert({
    provider: transaction.provider,
    provider_reference: transaction.reference,
    amount: transaction.amount,
    currency: transaction.currency,
    phone_last4: transaction.phoneLast4,
    status: transaction.status,
    provider_status: transaction.providerStatus || null,
    updated_at: transaction.updatedAt || new Date().toISOString(),
  }, { onConflict: 'provider_reference' })
  if (error) throw new Error(`Supabase transaction persistence failed: ${error.message}`)
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders)
    response.end()
    return
  }

  if (request.method === 'GET' && request.url === '/api/payments/health') {
    return json(response, 200, { environment, providers: ['mtn', 'airtel'] })
  }

  if (request.method === 'GET' && request.url.startsWith('/api/crypto/markets')) {
    try {
      const requestUrl = new URL(request.url, `http://${request.headers.host}`)
      const symbols = (requestUrl.searchParams.get('symbols') || 'BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT').split(',')
      const markets = await Promise.all(symbols.map((symbol) => cryptoTicker(symbol)))
      return json(response, 200, { provider: `binance-spot-${cryptoTradingMode}`, markets })
    } catch (error) {
      return json(response, 502, { error: error.message })
    }
  }

  if (request.method === 'GET' && request.url === '/api/crypto/account') {
    try {
      const account = await binanceRequest('/api/v3/account', { signed: true })
      return json(response, 200, {
        provider: `binance-spot-${cryptoTradingMode}`,
        balances: account.balances.filter((balance) => Number(balance.free) || Number(balance.locked)),
      })
    } catch (error) {
      return json(response, 502, { error: error.message })
    }
  }

  if (request.method === 'POST' && request.url === '/api/crypto/orders') {
    try {
      const body = await readBody(request)
      const symbol = String(body.symbol || '').toUpperCase()
      const side = String(body.side || '').toUpperCase()
      const quantity = Number(body.quantity)
      if (!allowedCryptoSymbols.has(symbol) || !['BUY', 'SELL'].includes(side) || !quantity || quantity <= 0) {
        return json(response, 400, { error: 'Supported symbol, BUY/SELL side, and positive quantity are required' })
      }

      if (cryptoTradingMode === 'live' && binanceBaseUrl !== 'https://api.binance.com') {
        return json(response, 503, { error: 'Live mode requires BINANCE_BASE_URL=https://api.binance.com' })
      }

      const order = await binanceRequest('/api/v3/order', {
        method: 'POST',
        signed: true,
        params: { symbol, side, type: 'MARKET', quantity: quantity.toFixed(6), newOrderRespType: 'FULL' },
      })
      return json(response, 201, { provider: `binance-spot-${cryptoTradingMode}`, order })
    } catch (error) {
      return json(response, 502, { error: error.message })
    }
  }

  if (request.method === 'POST' && request.url === '/api/payments/collect') {
    try {
      const body = await readBody(request)
      const { provider, amount, currency = 'UGX', phone } = body
      if (!['mtn', 'airtel'].includes(provider) || !amount || !required([phone])) {
        return json(response, 400, { error: 'provider, amount, and phone are required' })
      }

      const reference = randomUUID()
      const result = provider === 'mtn'
        ? await collectWithMtn({ amount, currency, phone, reference, callbackUrl: process.env.PAYMENT_WEBHOOK_URL })
        : await collectWithAirtel({ amount, currency, phone, reference })

      transactions.set(reference, {
        reference,
        provider,
        amount: Number(amount),
        currency,
        phoneLast4: phone.slice(-4),
        status: result.status,
        createdAt: new Date().toISOString(),
      })
      await persistTransaction(transactions.get(reference))

      return json(response, 202, { provider, environment, ...result })
    } catch (error) {
      return json(response, 502, { error: error.message })
    }
  }

  if (request.method === 'GET' && request.url.startsWith('/api/payments/status/')) {
    const reference = request.url.split('/').pop()
    const transaction = transactions.get(reference)
    if (!transaction) return json(response, 404, { error: 'Payment reference not found' })
    if (['completed', 'failed'].includes(transaction.status)) return json(response, 200, transaction)

    try {
      const providerStatus = transaction.provider === 'mtn'
        ? await getMtnStatus(reference)
        : await getAirtelStatus(reference)
      transaction.status = normalizeStatus(providerStatus)
      transaction.providerStatus = providerStatus
      transactions.set(reference, transaction)
      await persistTransaction(transaction)
      return json(response, 200, transaction)
    } catch (error) {
      return json(response, 502, { error: error.message, reference })
    }
  }

  if (request.method === 'POST' && request.url.startsWith('/api/payments/webhooks/')) {
    if (!verifyWebhook(request)) return json(response, 401, { error: 'Invalid webhook signature' })

    try {
      const provider = request.url.split('/').pop()
      const body = await readBody(request)
      const reference = body.reference || body.externalId || body.transaction?.id
      const transaction = transactions.get(reference)
      if (!transaction || transaction.provider !== provider) {
        return json(response, 404, { error: 'Payment reference not found' })
      }

      transaction.providerStatus = body.status || body.transaction?.status || body.data?.transaction?.status
      transaction.status = normalizeStatus(transaction.providerStatus)
      transaction.updatedAt = new Date().toISOString()
      transactions.set(reference, transaction)
      await persistTransaction(transaction)
      return json(response, 200, { received: true, reference, status: transaction.status })
    } catch (error) {
      return json(response, 400, { error: error.message })
    }
  }

  if (request.method === 'POST' && request.url === '/api/payments/withdrawals') {
    try {
      const body = await readBody(request)
      const { customerId, paymentMethodId, amount, currency = 'UGX' } = body
      if (!required([customerId, paymentMethodId]) || !Number(amount) || Number(amount) <= 0) {
        return json(response, 400, { error: 'customerId, paymentMethodId, and a positive amount are required' })
      }
      if (!supabase) {
        return json(response, 202, { status: 'pending_review', message: 'Withdrawal queued in sandbox mode.' })
      }

      const { data, error } = await supabase.from('withdrawal_requests').insert({
        customer_id: customerId,
        payment_method_id: paymentMethodId,
        amount: Number(amount),
        currency,
      }).select('id, status, created_at').single()
      if (error) throw new Error(`Supabase withdrawal persistence failed: ${error.message}`)
      return json(response, 202, data)
    } catch (error) {
      return json(response, 400, { error: error.message })
    }
  }

  return json(response, 404, { error: 'Not found' })
})

server.listen(port, () => {
  console.log(`Payment API listening on http://localhost:${port} (${environment})`)
})
