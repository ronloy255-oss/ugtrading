import { useEffect, useState } from 'react'
import './App.css'

const stats = [
  { label: 'Portfolio balance', value: '$148.4K', change: '+8.42%' },
  { label: 'Today P&L', value: '$6,240', change: '+2.18%' },
  { label: 'Win rate', value: '68.5%', change: '+4.6%' },
]

const initialPositions = [
  { symbol: 'NVDA', shares: '42.00', price: '$122.84', pnl: '+$1,834', positive: true },
  { symbol: 'AAPL', shares: '78.00', price: '$214.63', pnl: '+$980', positive: true },
  { symbol: 'ETH', shares: '8.60', price: '$3,482', pnl: '-$220', positive: false },
]

const watchlist = [
  { name: 'BTC/USD', price: '$64,280', trend: '+3.8%', positive: true },
  { name: 'ETH/USD', price: '$3,482', trend: '+2.1%', positive: true },
  { name: 'SOL/USD', price: '$152.40', trend: '-1.2%', positive: false },
  { name: 'NASDAQ', price: '19,482', trend: '+1.6%', positive: true },
]

const marketRows = [
  { symbol: 'AAPL', last: 214.63, change: '+1.74%', positive: true, volume: '12.4M' },
  { symbol: 'MSFT', last: 437.18, change: '+0.92%', positive: true, volume: '8.6M' },
  { symbol: 'NVDA', last: 122.84, change: '+2.36%', positive: true, volume: '22.1M' },
  { symbol: 'TSLA', last: 184.21, change: '-0.58%', positive: false, volume: '15.3M' },
]

const cryptoMarkets = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 64280.42, change: '+3.84%', positive: true, volume: '$2.8B', spark: [42, 48, 45, 58, 54, 68, 63, 76, 72, 88, 82, 96] },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 3482.16, change: '+2.16%', positive: true, volume: '$1.4B', spark: [38, 52, 48, 44, 57, 62, 58, 72, 70, 78, 84, 90] },
  { symbol: 'SOL/USDT', name: 'Solana', price: 152.4, change: '-1.24%', positive: false, volume: '$684M', spark: [82, 74, 78, 68, 72, 59, 64, 52, 56, 44, 48, 38] },
  { symbol: 'BNB/USDT', name: 'BNB', price: 586.77, change: '+0.92%', positive: true, volume: '$392M', spark: [46, 51, 48, 58, 56, 62, 60, 67, 64, 71, 68, 76] },
]

const cryptoCandles = [
  { open: 38, close: 52, high: 60, low: 31 },
  { open: 52, close: 47, high: 58, low: 40 },
  { open: 47, close: 59, high: 66, low: 43 },
  { open: 59, close: 55, high: 64, low: 49 },
  { open: 55, close: 68, high: 74, low: 51 },
  { open: 68, close: 63, high: 76, low: 58 },
  { open: 63, close: 77, high: 83, low: 60 },
  { open: 77, close: 72, high: 81, low: 68 },
  { open: 72, close: 86, high: 92, low: 69 },
  { open: 86, close: 82, high: 95, low: 78 },
  { open: 82, close: 94, high: 99, low: 79 },
  { open: 94, close: 90, high: 98, low: 86 },
]

const faqItems = [
  { question: 'How do I open a customer account?', answer: 'Choose Open account, complete your contact and funding details, then submit the form. Each customer receives a unique account number and private portal context.' },
  { question: 'Which payment methods are supported?', answer: 'The platform supports MTN Mobile Money, Airtel Money, M-Pesa, bank accounts, Visa, and Mastercard details. Mobile-money transactions require customer confirmation on the phone.' },
  { question: 'Are crypto prices live?', answer: 'The crypto workspace uses Binance Spot market data through the server API. It defaults to Binance Testnet until live credentials and live-trading configuration are intentionally enabled.' },
  { question: 'Can I buy and sell crypto?', answer: 'Yes. Select a crypto pair, choose Buy or Sell, enter the quantity, and submit the order. Testnet orders use test funds; live orders require an approved exchange account and server-side credentials.' },
  { question: 'How are customer payment details protected?', answer: 'Payment-provider secrets stay on the server and are never sent to the browser. Production use also requires authentication, KYC/AML controls, secure storage, webhook verification, and reconciliation.' },
  { question: 'How can I contact Jaguar Markets?', answer: 'Use the Contact us page or email ronloy255@gmail.com. Include your account number and a short description so the support team can respond efficiently.' },
]

const initialTrades = [
  { symbol: 'NVDA', side: 'Buy', quantity: 18, total: 2211.12, time: '09:42 AM' },
  { symbol: 'AAPL', side: 'Sell', quantity: 12, total: 2575.56, time: '08:18 AM' },
  { symbol: 'MSFT', side: 'Buy', quantity: 8, total: 3497.44, time: 'Yesterday' },
]

const initialWalletTransactions = [
  { label: 'Wallet debit', amount: -250.00, method: 'Mobile Money', time: 'Today • 09:42 AM' },
  { label: 'Airtel credit', amount: 250.00, method: 'Airtel Money', time: 'Today • 09:42 AM' },
  { label: 'Bank top-up', amount: 1200.00, method: 'Bank Account', time: 'Yesterday • 03:18 PM' },
]

const initialTransferHistory = [
  { id: 'TRX-10421', type: 'Deposit', method: 'Airtel Money', amount: 2500, status: 'Completed', time: 'Today • 09:42 AM' },
  { id: 'TRX-10409', type: 'Trade settlement', method: 'Bank transfer', amount: -4200, status: 'Queued', time: 'Yesterday • 04:18 PM' },
  { id: 'TRX-10385', type: 'Withdrawal', method: 'Card', amount: -1200, status: 'Processed', time: 'Yesterday • 08:11 AM' },
]

const settlementTimeline = [
  { label: 'Airtel settlement', status: 'Completed', amount: '$2,100.00', time: '09:42 AM', detail: 'Wallet to Airtel cleared' },
  { label: 'Card settlement', status: 'Queued', amount: '$1,240.00', time: '10:18 AM', detail: 'Card funding pending approval' },
  { label: 'Bank release', status: 'Processing', amount: '$6,800.00', time: '11:04 AM', detail: 'Bank account settlement in review' },
]

const riskExposure = [
  { label: 'Gross exposure', value: '$83.4K', change: '+4.6%' },
  { label: 'Sector risk', value: 'Moderate', change: '-1.2%' },
  { label: 'Liquidity buffer', value: '$31.2K', change: '+8.1%' },
]

const initialApprovalQueue = [
  { customer: 'Noah Patel', account: 'Margin', action: 'KYC review', risk: 'Elevated', amount: '$34,800', status: 'Pending', score: 82 },
  { customer: 'Lina Nakitto', account: 'Standard', action: 'Funding review', risk: 'Low', amount: '$12,600', status: 'Pending', score: 41 },
  { customer: 'Rafi Mugisha', account: 'Standard', action: 'Card verification', risk: 'Moderate', amount: '$8,900', status: 'Awaiting docs', score: 58 },
]

const auditLog = [
  { actor: 'Ops team', action: 'KYC approval completed', status: 'Success', time: 'Today • 09:12 AM' },
  { actor: 'Settlement engine', action: 'Airtel settlement released', status: 'Completed', time: 'Today • 09:42 AM' },
  { actor: 'Risk monitor', action: 'Exposure threshold reviewed', status: 'Monitoring', time: 'Today • 10:06 AM' },
]

const initialCustomers = [
  {
    customerId: 'CUS-AVA-001',
    name: 'Ava Lee',
    email: 'ava.lee@example.com',
    accountNumber: 'JM-1001842',
    account: 'Standard',
    balance: '$12,500',
    status: 'Approved',
    paymentMethod: 'Mobile Money',
    walletBalance: 12500,
    mobileMoneyNumber: '+256700123456',
    mpesaNumber: '+254700123456',
    bankName: 'Stanbic Bank',
    bankAccountNumber: '0011223344',
    cardBrand: 'Visa',
    cardNumber: '4242 4242 4242 4242',
    cardHolder: 'Ava Lee',
    kycStatus: 'Verified',
    riskLevel: 'Moderate',
    lastFunding: 'Today',
  },
  {
    customerId: 'CUS-NOA-002',
    name: 'Noah Patel',
    email: 'noah.patel@example.com',
    accountNumber: 'JM-1001843',
    account: 'Margin',
    balance: '$34,800',
    status: 'Pending',
    paymentMethod: 'Bank Account',
    walletBalance: 34800,
    mobileMoneyNumber: '+256709888777',
    mpesaNumber: '+254712345678',
    bankName: 'KCB Bank',
    bankAccountNumber: '4400999912',
    cardBrand: 'Mastercard',
    cardNumber: '',
    cardHolder: 'Noah Patel',
    kycStatus: 'Pending review',
    riskLevel: 'Elevated',
    lastFunding: 'Yesterday',
  },
]

const settlementAccounts = {
  mtn: '+256787455792',
  airtel: '+256709991502',
}
const settlementNumber = settlementAccounts.airtel

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const insights = [
  'Momentum remains strong in semiconductors after the last earnings cycle.',
  'Volatility is cooling; consider widening exposure in large-cap tech.',
  'Risk appetite is improving across crypto and index futures markets.',
]

const workflowStages = [
  { label: 'KYC review', detail: 'Identity, sanctions and risk checks are complete.' },
  { label: 'Wallet funding', detail: 'Settlement source is verified and cash is available.' },
  { label: 'Risk approval', detail: 'Ops team has cleared the trading exposure limit.' },
  { label: 'Trade execution', detail: 'Order is routed to settlement and audit review.' },
]

const customerDashboardCards = (customer) => [
  { label: 'Account value', value: formatCurrency((customer.walletBalance || 0) + 76000), change: '+8.2%' },
  { label: 'Available cash', value: formatCurrency(customer.walletBalance || 0), change: '+2.4%' },
  { label: 'Monthly return', value: '+$4,280', change: '+6.7%' },
  { label: 'Risk profile', value: customer.riskLevel || 'Moderate', change: 'Within limit' },
]

const getPaymentMethods = (customer) => customer.paymentMethods || [
  ...(customer.mobileMoneyNumber ? [{ type: 'Mobile Money', detail: customer.mobileMoneyNumber }] : []),
  ...(customer.mpesaNumber ? [{ type: 'M-Pesa', detail: customer.mpesaNumber }] : []),
  ...(customer.bankAccountNumber ? [{ type: 'Bank Account', detail: `${customer.bankName || 'Bank'} • ${customer.bankAccountNumber}` }] : []),
  ...(customer.cardNumber ? [{ type: customer.cardBrand || 'Card', detail: `•••• ${customer.cardNumber.slice(-4)}` }] : []),
]

const getAvatarInitials = (name) => name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

const getAvatarColor = (name) => {
  const colors = ['violet', 'cyan', 'amber', 'rose', 'emerald']
  const score = name.split('').reduce((total, character) => total + character.charCodeAt(0), 0)
  return colors[score % colors.length]
}

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC/USDT')
  const [cryptoSide, setCryptoSide] = useState('Buy')
  const [cryptoQuantity, setCryptoQuantity] = useState('0.025')
  const [cryptoTimeframe, setCryptoTimeframe] = useState('1D')
  const [cryptoOrders, setCryptoOrders] = useState([
    { symbol: 'ETH/USDT', side: 'Buy', quantity: '0.40', total: '$1,392.86', status: 'Filled', time: '10:18 AM' },
    { symbol: 'BTC/USDT', side: 'Buy', quantity: '0.015', total: '$964.21', status: 'Filled', time: 'Yesterday' },
  ])
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [shareCopied, setShareCopied] = useState(false)
  const [liveCryptoMarkets, setLiveCryptoMarkets] = useState(cryptoMarkets)
  const [side, setSide] = useState('Buy')
  const [quantity, setQuantity] = useState(25)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Mobile Money')
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomers[0].name)
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [cardFunding, setCardFunding] = useState(false)
  const [trades, setTrades] = useState(initialTrades)
  const [walletTransactions, setWalletTransactions] = useState(initialWalletTransactions)
  const [positions, setPositions] = useState(initialPositions)
  const [customers, setCustomers] = useState(initialCustomers)
  const [transferHistory] = useState(initialTransferHistory)
  const [approvalQueue, setApprovalQueue] = useState(initialApprovalQueue)
  const [approvalFilter, setApprovalFilter] = useState('All')
  const [selectedApprovals, setSelectedApprovals] = useState([])
  const [status, setStatus] = useState('Ready to place a trade')
  const [showModal, setShowModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('operator')
  const [customerSubView, setCustomerSubView] = useState('overview')
  const [currentFlowStep, setCurrentFlowStep] = useState(1)
  const [loginForm, setLoginForm] = useState({ email: 'demo@ugtrading.com', password: 'demo123' })
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    accountType: 'Standard',
    initialDeposit: '5000',
    paymentMethod: 'Mobile Money',
    mobileMoneyNumber: '',
    mpesaNumber: '',
    bankName: '',
    bankAccountNumber: '',
    cardBrand: 'Visa',
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  })
  const [paymentForm, setPaymentForm] = useState({
    type: 'Mobile Money',
    mobileMoneyNumber: '',
    mpesaNumber: '',
    bankName: '',
    bankAccountNumber: '',
    cardBrand: 'Visa',
    cardNumber: '',
    cardHolder: '',
  })

  const selected = marketRows.find((row) => row.symbol === selectedSymbol) ?? marketRows[0]
  const activeCustomer = customers.find((customer) => customer.name === selectedCustomer) ?? customers[0]
  const total = Number((selected.last * quantity).toFixed(2))
  const readableCash = formatCurrency(activeCustomer.walletBalance)
  const customerRiskLabel = `${activeCustomer.kycStatus || 'Verified'} • ${activeCustomer.riskLevel || 'Moderate'} risk`
  const workflowProgress = ((currentFlowStep + 1) / workflowStages.length) * 100
  const currentWorkflowStage = workflowStages[Math.min(currentFlowStep, workflowStages.length - 1)]
  const selectedCryptoMarket = liveCryptoMarkets.find((market) => market.symbol === selectedCrypto) ?? liveCryptoMarkets[0]
  const cryptoNotional = Number((selectedCryptoMarket.price * Number(cryptoQuantity || 0)).toFixed(2))
  const selectedCryptoCandles = selectedCryptoMarket.candles || cryptoCandles.map((candle) => ({ open: candle.open, high: candle.high, low: candle.low, close: candle.close }))
  const candleValues = selectedCryptoCandles.flatMap((candle) => [candle.high, candle.low])
  const candleMin = Math.min(...candleValues)
  const candleRange = Math.max(...candleValues) - candleMin || 1
  const candleLayout = selectedCryptoCandles.map((candle) => ({
    open: ((candle.open - candleMin) / candleRange) * 76 + 12,
    high: ((candle.high - candleMin) / candleRange) * 76 + 12,
    low: ((candle.low - candleMin) / candleRange) * 76 + 12,
    close: ((candle.close - candleMin) / candleRange) * 76 + 12,
  }))

  useEffect(() => {
    if (currentView !== 'crypto') return
    const apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8787'
    fetch(`${apiUrl}/api/crypto/markets?symbols=BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT`)
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Live crypto feed unavailable')
        setLiveCryptoMarkets((current) => current.map((market) => {
          const liveMarket = data.markets.find((item) => item.symbol === market.symbol.replace('/', ''))
          return liveMarket ? { ...market, ...liveMarket, symbol: market.symbol } : market
        }))
        setStatus(`Live ${data.provider} crypto prices connected.`)
      })
      .catch((error) => setStatus(`Live crypto feed unavailable: ${error.message}`))
  }, [currentView])
  const btcEmailHref = `mailto:ronloy255@gmail.com?subject=${encodeURIComponent('BTC purchase request')}&body=${encodeURIComponent(`Hello,\n\nI would like to buy BTC through Jaguar Markets.\nQuantity: ${Number(cryptoQuantity || 0).toFixed(6)} BTC\nEstimated value: ${formatCurrency(cryptoNotional)}\n\nPlease confirm the next steps.`)}`

  const openConfirmation = () => {
    setShowModal(true)
  }

  const handleAccountInput = (event) => {
    const { name, value } = event.target
    setAccountForm((current) => ({ ...current, [name]: value }))
  }

  const handleLoginInput = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const handleContactInput = (event) => {
    const { name, value } = event.target
    setContactForm((current) => ({ ...current, [name]: value }))
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()
    const { name, email, subject, message } = contactForm
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('Please complete your name, email, and message before contacting us.')
      return
    }

    const emailSubject = encodeURIComponent(subject.trim() || 'Jaguar Markets enquiry')
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.assign(`mailto:ronloy255@gmail.com?subject=${emailSubject}&body=${emailBody}`)
  }

  const getShareUrl = () => window.location.href

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Jaguar Markets',
      text: 'Explore Jaguar Markets trading tools and crypto markets.',
      url: getShareUrl(),
    }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(getShareUrl())
    setShareCopied(true)
    window.setTimeout(() => setShareCopied(false), 1800)
  }

  const shareText = encodeURIComponent('Explore Jaguar Markets trading tools and crypto markets.')

  const handlePaymentInput = (event) => {
    const { name, value } = event.target
    setPaymentForm((current) => ({ ...current, [name]: value }))
  }

  const handlePaymentMethodAdd = () => {
    const { type } = paymentForm
    const detail = type === 'Mobile Money'
      ? paymentForm.mobileMoneyNumber.trim()
      : type === 'M-Pesa'
        ? paymentForm.mpesaNumber.trim()
        : type === 'Bank Account'
          ? `${paymentForm.bankName.trim()} • ${paymentForm.bankAccountNumber.trim()}`
          : `${paymentForm.cardBrand} • •••• ${paymentForm.cardNumber.trim().slice(-4)}`

    if ((type === 'Mobile Money' && !paymentForm.mobileMoneyNumber.trim()) ||
      (type === 'M-Pesa' && !paymentForm.mpesaNumber.trim()) ||
      (type === 'Bank Account' && (!paymentForm.bankName.trim() || !paymentForm.bankAccountNumber.trim())) ||
      (type === 'Card' && (!paymentForm.cardNumber.trim() || !paymentForm.cardHolder.trim()))) {
      setStatus(`Please complete the ${type} details before saving.`)
      return
    }

    setCustomers((current) => current.map((customer) => {
      if (customer.name !== selectedCustomer) return customer
      const paymentMethods = [...getPaymentMethods(customer), { type: type === 'Card' ? paymentForm.cardBrand : type, detail }]
      return { ...customer, paymentMethods }
    }))
    setStatus(`${type} was saved for ${selectedCustomer}. A simulated verification prompt is ready.`)
    setShowPaymentModal(false)
    setPaymentForm({
      type: 'Mobile Money',
      mobileMoneyNumber: '',
      mpesaNumber: '',
      bankName: '',
      bankAccountNumber: '',
      cardBrand: 'Visa',
      cardNumber: '',
      cardHolder: '',
    })
  }

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      const customer = customers.find((item) => item.email?.toLowerCase() === loginForm.email.trim().toLowerCase())
      if (customer) setSelectedCustomer(customer.name)
      setIsLoggedIn(true)
      setCurrentFlowStep(2)
      setStatus(`Welcome back, ${customer?.name || loginForm.email.split('@')[0]}. Your private customer workspace is ready.`)
      setShowLoginModal(false)
      return
    }

    setStatus('Please enter both your email and password to sign in.')
  }

  const handleCryptoOrder = () => {
    const quantity = Number(cryptoQuantity)
    if (!quantity || quantity <= 0) {
      setStatus('Enter a crypto quantity greater than zero before placing the order.')
      return
    }

    if (cryptoSide === 'Buy' && selectedCryptoMarket.symbol === 'BTC/USDT') {
      const subject = encodeURIComponent('BTC purchase request')
      const body = encodeURIComponent([
        'Hello,',
        '',
        'I would like to buy BTC through Jaguar Markets.',
        `Quantity: ${quantity.toFixed(6)} BTC`,
        `Estimated value: ${formatCurrency(cryptoNotional)}`,
        '',
        'Please confirm the next steps.',
      ].join('\n'))
      window.location.assign(`mailto:ronloy255@gmail.com?subject=${subject}&body=${body}`)
      return
    }

    const apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8787'
    fetch(`${apiUrl}/api/crypto/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: selectedCryptoMarket.symbol.replace('/', ''), side: cryptoSide, quantity }),
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'The crypto exchange rejected the order.')
        const order = {
          symbol: selectedCryptoMarket.symbol,
          side: cryptoSide,
          quantity: quantity.toFixed(6),
          total: formatCurrency(cryptoNotional),
          status: data.order?.status || 'Submitted',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setCryptoOrders((current) => [order, ...current].slice(0, 5))
        setStatus(`${cryptoSide} order submitted to ${data.provider} for ${order.quantity} ${selectedCryptoMarket.symbol}.`)
      })
      .catch((error) => setStatus(`Crypto order failed: ${error.message}`))
  }

  const handleAccountOpen = () => {
    const name = accountForm.name.trim()
    const email = accountForm.email.trim()

    if (!name || !email) {
      setStatus('Please complete the customer name and email to open an account.')
      return
    }

    const paymentMethod = accountForm.paymentMethod
    const initialBalance = Number(accountForm.initialDeposit || 0)

    if (paymentMethod === 'Mobile Money' || paymentMethod === 'M-Pesa') {
      if (paymentMethod === 'Mobile Money' && !accountForm.mobileMoneyNumber.trim()) {
        setStatus('Add a valid mobile money number before opening the account.')
        return
      }

      if (paymentMethod === 'M-Pesa' && !accountForm.mpesaNumber.trim()) {
        setStatus('Add a valid M-Pesa number before opening the account.')
        return
      }
    }

    if (paymentMethod === 'Bank Account') {
      if (!accountForm.bankName.trim() || !accountForm.bankAccountNumber.trim()) {
        setStatus('Please add the bank name and account number before approval.')
        return
      }
    }

    if (paymentMethod === 'Card') {
      if (!accountForm.cardNumber.trim() || !accountForm.cardHolder.trim()) {
        setStatus('Please add the card number and cardholder name before approval.')
        return
      }
    }

    const entry = {
      customerId: `CUS-${name.replace(/[^a-zA-Z]/g, '').slice(0, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      name,
      email,
      accountNumber: `JM-${Math.floor(1000000 + Math.random() * 8999999)}`,
      account: accountForm.accountType,
      balance: `$${initialBalance.toLocaleString()}`,
      status: 'Approved',
      paymentMethod,
      walletBalance: initialBalance,
      mobileMoneyNumber: accountForm.mobileMoneyNumber,
      mpesaNumber: accountForm.mpesaNumber,
      bankName: accountForm.bankName,
      bankAccountNumber: accountForm.bankAccountNumber,
      cardBrand: accountForm.cardBrand,
      cardNumber: accountForm.cardNumber,
      cardHolder: accountForm.cardHolder,
      kycStatus: 'Verified',
      riskLevel: initialBalance >= 10000 ? 'Moderate' : 'Low',
      lastFunding: 'Today',
    }

    setCustomers((current) => [entry, ...current])
    setSelectedCustomer(name)
    setIsLoggedIn(true)
    setCurrentView('customer')
    setCustomerSubView('overview')
    setSelectedPaymentMethod(paymentMethod)
    setCurrentFlowStep(2)
    setStatus(`Account approved for ${name}. ${paymentMethod} funding is verified and will settle through MTN Mobile Money ${settlementAccounts.mtn} or Airtel Money ${settlementAccounts.airtel}.`)
    setAccountForm({
      name: '',
      email: '',
      accountType: 'Standard',
      initialDeposit: '5000',
      paymentMethod: 'Mobile Money',
      mobileMoneyNumber: '',
      mpesaNumber: '',
      bankName: '',
      bankAccountNumber: '',
      cardBrand: 'Visa',
      cardNumber: '',
      cardHolder: '',
      expiry: '',
      cvv: '',
    })
    setShowAccountModal(false)
  }

  const handleApprovalUpdate = (customerName, nextStatus) => {
    setApprovalQueue((current) =>
      current.map((item) =>
        item.customer === customerName
          ? { ...item, status: nextStatus }
          : item
      )
    )

    setCustomers((current) =>
      current.map((customer) => {
        if (customer.name !== customerName) return customer

        const updatedStatus = nextStatus === 'Approved' ? 'Approved' : nextStatus === 'Rejected' ? 'Rejected' : customer.status

        return {
          ...customer,
          status: updatedStatus,
          kycStatus: nextStatus === 'Approved' ? 'Verified' : nextStatus === 'Rejected' ? 'Rejected' : customer.kycStatus,
          riskLevel: nextStatus === 'Approved' ? 'Moderate' : customer.riskLevel,
        }
      })
    )

    if (nextStatus === 'Approved') {
      setCurrentFlowStep(3)
    }

    setStatus(`${customerName} was marked as ${nextStatus.toLowerCase()}. The approval queue has been updated.`)
  }

  const filteredApprovals =
    approvalFilter === 'All'
      ? approvalQueue
      : approvalQueue.filter((item) => item.status === approvalFilter)

  const toggleApprovalSelection = (customerName) => {
    setSelectedApprovals((current) =>
      current.includes(customerName)
        ? current.filter((name) => name !== customerName)
        : [...current, customerName]
    )
  }

  const handleBulkApprove = () => {
    if (!selectedApprovals.length) {
      setStatus('Select at least one customer to approve in bulk.')
      return
    }

    setApprovalQueue((current) =>
      current.map((item) =>
        selectedApprovals.includes(item.customer)
          ? { ...item, status: 'Approved' }
          : item
      )
    )

    setCustomers((current) =>
      current.map((customer) =>
        selectedApprovals.includes(customer.name)
          ? { ...customer, status: 'Approved', kycStatus: 'Verified', riskLevel: customer.riskLevel || 'Moderate' }
          : customer
      )
    )

    setSelectedApprovals([])
    setCurrentFlowStep(3)
    setStatus(`${selectedApprovals.length} customer request${selectedApprovals.length > 1 ? 's were' : ' was'} approved in bulk.`)
  }

  const handleExportApprovals = () => {
    const csvRows = [
      ['Customer', 'Account', 'Action', 'Risk', 'Amount', 'Status', 'Score'],
      ...approvalQueue.map((item) => [
        item.customer,
        item.account,
        item.action,
        item.risk,
        item.amount,
        item.status,
        item.score,
      ]),
    ]

    const csvContent = csvRows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'jaguar-approval-export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setStatus('Approval export downloaded as CSV.')
  }

  const handleRiskRefresh = () => {
    setApprovalQueue((current) =>
      current.map((item) => ({
        ...item,
        score: Math.max(20, Math.min(95, item.score + (item.risk === 'Elevated' ? 2 : item.risk === 'Moderate' ? 1 : -1))),
      }))
    )
    setStatus('Risk scoring refreshed across the approval queue.')
  }

  const handleTrade = async () => {
    const normalizedQuantity = Math.max(1, Number(quantity) || 1)
    const tradeValue = Number((selected.last * normalizedQuantity).toFixed(2))
    const tradeTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    if (activeCustomer.status !== 'Approved') {
      setStatus(`Account review is still ${activeCustomer.status.toLowerCase()}. Funding cannot be released until KYC is approved.`)
      setShowModal(false)
      return
    }

    const directPayment = side === 'Buy' && ['Mobile Money', 'Airtel Money', 'M-Pesa'].includes(selectedPaymentMethod)

    if (side === 'Buy' && !directPayment && activeCustomer.walletBalance < tradeValue) {
      setStatus(`Insufficient cleared funds in ${activeCustomer.paymentMethod}. Available cash is ${readableCash}. The system will not process this trade until the wallet is funded.`)
      setShowModal(false)
      return
    }

    if (directPayment) {
      const provider = selectedPaymentMethod === 'Airtel Money' ? 'airtel' : selectedPaymentMethod === 'Mobile Money' ? 'mtn' : null
      const phone = selectedPaymentMethod === 'M-Pesa' ? activeCustomer.mpesaNumber : activeCustomer.mobileMoneyNumber

      if (!provider) {
        setStatus('M-Pesa collection is not enabled for this Uganda account yet. Configure a licensed M-Pesa provider before accepting this payment.')
        setShowModal(false)
        return
      }

      if (!phone) {
        setStatus(`Add the customer's ${selectedPaymentMethod} number before starting payment.`)
        setShowModal(false)
        return
      }

      setStatus(`Sending a ${selectedPaymentMethod} confirmation prompt to ${phone}...`)

      try {
        const paymentResponse = await fetch(`${import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8787'}/api/payments/collect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            amount: tradeValue,
            currency: 'UGX',
            phone,
          }),
        })
        const paymentResult = await paymentResponse.json()

        if (!paymentResponse.ok) {
          throw new Error(paymentResult.error || 'The payment provider rejected the collection request.')
        }

        const paymentReference = paymentResult.providerReference
        let paymentCompleted = false

        for (let attempt = 0; attempt < 12; attempt += 1) {
          setStatus(`Payment prompt sent to ${phone}. Waiting for customer approval (${attempt + 1}/12)...`)
          await new Promise((resolve) => setTimeout(resolve, 3000))
          const statusResponse = await fetch(`${import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8787'}/api/payments/status/${paymentReference}`)
          const statusResult = await statusResponse.json()

          if (!statusResponse.ok) throw new Error(statusResult.error || 'Unable to verify payment status.')
          if (statusResult.status === 'completed') {
            paymentCompleted = true
            break
          }
          if (statusResult.status === 'failed') throw new Error('The customer or payment provider declined the payment.')
        }

        if (!paymentCompleted) {
          setStatus('Payment is still awaiting customer approval. No shares were purchased and no wallet balance was changed.')
          setShowModal(false)
          return
        }

        setStatus('Payment confirmed by the provider. Recording the share purchase...')
      } catch (error) {
        setStatus(`Payment could not be started: ${error.message}`)
        setShowModal(false)
        return
      }
    }

    const walletDebit = side === 'Buy' ? tradeValue : 0
    const airtelCredit = side === 'Buy' ? tradeValue : 0
    const cardCredit = side === 'Buy' && cardFunding ? tradeValue : 0

    const entry = {
      symbol: selectedSymbol,
      side,
      quantity: normalizedQuantity,
      total: tradeValue,
      time: tradeTime,
      paymentMethod: selectedPaymentMethod,
      settlement: settlementNumber,
      walletDebit,
      airtelCredit,
      cardCredit,
      status: side === 'Buy' ? 'Queued for settlement' : 'Funds released',
    }

    setTrades((current) => [entry, ...current].slice(0, 4))
    setWalletTransactions((current) => [
      {
        label: side === 'Buy' ? 'Wallet debit' : 'Funds returned',
        amount: side === 'Buy' ? -tradeValue : tradeValue,
        method: selectedPaymentMethod,
        time: `Today • ${tradeTime}`,
      },
      {
        label: side === 'Buy' ? 'Airtel credit' : 'Settlement reversed',
        amount: side === 'Buy' ? tradeValue : -tradeValue,
        method: 'Airtel Money',
        time: `Today • ${tradeTime}`,
      },
      ...current,
    ].slice(0, 6))
    setCustomers((current) =>
      current.map((customer) => {
        if (customer.name !== selectedCustomer) return customer

        const nextBalance =
          side === 'Buy' ? customer.walletBalance - tradeValue : customer.walletBalance + tradeValue

        return {
          ...customer,
          walletBalance: Number(nextBalance.toFixed(2)),
          balance: `$${Number(nextBalance.toFixed(2)).toLocaleString()}`,
          paymentMethod: selectedPaymentMethod,
        }
      })
    )
    setPositions((current) => {
      const next = [...current]
      const index = next.findIndex((position) => position.symbol === selectedSymbol)

      if (side === 'Buy') {
        if (index >= 0) {
          const existing = Number(next[index].shares)
          next[index] = {
            ...next[index],
            shares: (existing + normalizedQuantity).toFixed(2),
            price: `$${selected.last.toFixed(2)}`,
            pnl: '+$1,420',
            positive: true,
          }
        } else {
          next.push({
            symbol: selectedSymbol,
            shares: normalizedQuantity.toFixed(2),
            price: `$${selected.last.toFixed(2)}`,
            pnl: '+$0.00',
            positive: true,
          })
        }
      } else if (index >= 0) {
        const existing = Number(next[index].shares)
        const remaining = Math.max(existing - normalizedQuantity, 0)

        if (remaining > 0) {
          next[index] = {
            ...next[index],
            shares: remaining.toFixed(2),
            price: `$${selected.last.toFixed(2)}`,
            pnl: '-$1,260',
            positive: false,
          }
        } else {
          next.splice(index, 1)
        }
      }

      return next
    })

    const confirmationText = notifyCustomer
      ? `A simulated confirmation prompt was sent to the customer's ${selectedPaymentMethod} account. The transaction is marked approved for demo settlement.`
      : 'No customer confirmation message was sent.'
    const cardText = cardFunding ? 'The card account was also credited for settlement.' : 'No card funding instruction was triggered.'
    const settlementMessage =
      side === 'Buy'
        ? `${selectedPaymentMethod} was debited in real time for ${formatCurrency(tradeValue)} and the configured mobile-money settlement routes MTN ${settlementAccounts.mtn} / Airtel ${settlementAccounts.airtel} were credited for settlement. ${confirmationText} ${cardText}`
        : `${selectedSymbol} proceeds were released back to ${selectedPaymentMethod} and the Airtel settlement account was reconciled in the same batch.`

    setCurrentFlowStep(3)
    setStatus(`${side} order queued and verified for ${normalizedQuantity} ${selectedSymbol} shares. ${settlementMessage}`)
    setShowModal(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Jaguar Markets home">
          <span className="brand-mark">J</span>
          <span>Jaguar Markets</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <details className="nav-dropdown" open={currentView === 'operator' || currentView === 'crypto'}>
            <summary className={currentView === 'operator' || currentView === 'crypto' ? 'nav-link active' : 'nav-link'}>Trade <span aria-hidden="true">⌄</span></summary>
            <div className="nav-dropdown-menu">
              <button type="button" className={currentView === 'operator' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentView('operator')}>Overview & markets</button>
              <button type="button" className={currentView === 'crypto' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentView('crypto')}>Crypto trading</button>
            </div>
          </details>

          <details className="nav-dropdown" open={currentView === 'customer'}>
            <summary className={currentView === 'customer' ? 'nav-link active' : 'nav-link'}>Account <span aria-hidden="true">⌄</span></summary>
            <div className="nav-dropdown-menu">
              <button type="button" className="nav-link" onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return }; setCurrentView('customer') }}>Customer portal</button>
              <button type="button" className="nav-link" onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return }; setCurrentView('customer'); setCustomerSubView('overview') }}>Portfolio overview</button>
              <button type="button" className="nav-link" onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return }; setCurrentView('customer'); setCustomerSubView('details') }}>Account details</button>
            </div>
          </details>

          <details className="nav-dropdown" open={currentView === 'contact' || currentView === 'faq'}>
            <summary className={currentView === 'contact' || currentView === 'faq' ? 'nav-link active' : 'nav-link'}>Help <span aria-hidden="true">⌄</span></summary>
            <div className="nav-dropdown-menu">
              <button type="button" className={currentView === 'contact' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentView('contact')}>Contact us</button>
              <button type="button" className={currentView === 'faq' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentView('faq')}>FAQ</button>
            </div>
          </details>
        </nav>

        <div className="share-actions" aria-label="Share Jaguar Markets">
          <button type="button" className="share-button share-native" onClick={handleNativeShare} title="Share this page">
            {shareCopied ? 'Copied' : 'Share'}
          </button>
          <a className="share-button" href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://ugtrading256.com/')}`} target="_blank" rel="noreferrer" title="Share on WhatsApp">WA</a>
          <a className="share-button" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://ugtrading256.com/')}`} target="_blank" rel="noreferrer" title="Share on Facebook">f</a>
          <a className="share-button" href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://ugtrading256.com/')}`} target="_blank" rel="noreferrer" title="Share on X">X</a>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (isLoggedIn) {
              setCurrentView('customer')
              return
            }
            setShowLoginModal(true)
          }}
        >
          {isLoggedIn ? 'Customer portal' : 'Sign in'}
        </button>
      </header>

      {currentView === 'customer' ? (
        <main className="customer-dashboard">
          <section className="customer-hero panel">
            <div className={`avatar avatar-${getAvatarColor(activeCustomer.name)}`} aria-hidden="true">
              {getAvatarInitials(activeCustomer.name)}
            </div>
            <div>
              <p className="eyebrow small">Customer dashboard</p>
              <h1>{activeCustomer.name}</h1>
              <p className="subtitle">
                Welcome back. Your account is active and ready for funding, settlement, and trading review.
              </p>
              <div className="customer-identity-line">
                <span>{activeCustomer.accountNumber}</span>
                <span>{activeCustomer.email}</span>
              </div>
            </div>
            <div className="customer-status-box">
              <span>Account status</span>
              <strong>{activeCustomer.status}</strong>
              <small>{activeCustomer.account} account • {activeCustomer.paymentMethod}</small>
            </div>
          </section>

          <div className="customer-tabs">
            {['overview', 'details', 'transfers'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={customerSubView === tab ? 'customer-tab active' : 'customer-tab'}
                onClick={() => setCustomerSubView(tab)}
              >
                {tab === 'overview' ? 'Overview' : tab === 'details' ? 'Account details' : 'Transfer history'}
              </button>
            ))}
          </div>

          {customerSubView === 'overview' && (
            <>
              <section className="stats-grid customer-stats">
                {customerDashboardCards(activeCustomer).map((item) => (
                  <div key={item.label} className="stat-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <em>{item.change}</em>
                  </div>
                ))}
              </section>

              <section className="customer-grid">
                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow small">Portfolio</p>
                      <h2>Open positions</h2>
                    </div>
                    <span className="pill positive">Live</span>
                  </div>

                  <div className="customer-table">
                    {positions.map((position) => (
                      <div key={position.symbol} className="customer-row-item">
                        <div>
                          <strong>{position.symbol}</strong>
                          <small>{position.shares} shares</small>
                        </div>
                        <div>
                          <strong>{position.price}</strong>
                          <small className={position.positive ? 'positive' : 'negative'}>{position.pnl}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow small">Wallet</p>
                      <h2>Funding details</h2>
                    </div>
                  </div>

                  <div className="customer-wallet-box">
                    <span>Available cash</span>
                    <strong>{readableCash}</strong>
                    <small>{activeCustomer.paymentMethod} • default settlement route</small>
                  </div>

                  <div className="funding-list">
                    <div>
                      <span>Mobile money</span>
                      <strong>{activeCustomer.mobileMoneyNumber || 'Not added'}</strong>
                    </div>
                    <div>
                      <span>M-Pesa</span>
                      <strong>{activeCustomer.mpesaNumber || 'Not added'}</strong>
                    </div>
                    <div>
                      <span>Bank account</span>
                      <strong>
                        {activeCustomer.bankAccountNumber
                          ? `${activeCustomer.bankName || 'Bank'} • ${activeCustomer.bankAccountNumber}`
                          : 'Not added'}
                      </strong>
                    </div>
                    <div>
                      <span>Card</span>
                      <strong>
                        {activeCustomer.cardNumber
                          ? `${activeCustomer.cardBrand || 'Card'} • •••• ${activeCustomer.cardNumber.slice(-4)}`
                          : 'Not added'}
                      </strong>
                    </div>
                  </div>
                </article>
              </section>

              <section className="customer-grid lower-grid">
                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow small">Activity</p>
                      <h2>Recent account activity</h2>
                    </div>
                  </div>

                  <div className="trade-list">
                    {trades.map((trade) => (
                      <div key={`${trade.symbol}-${trade.time}-${trade.side}`} className="trade-item">
                        <div>
                          <strong>{trade.symbol}</strong>
                          <small>{trade.side} • {trade.quantity} shares</small>
                        </div>
                        <div className="trade-meta">
                          <span className={trade.side === 'Buy' ? 'positive' : 'negative'}>{trade.side}</span>
                          <small>${trade.total.toFixed(2)}</small>
                          <time>{trade.time}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow small">Documents</p>
                      <h2>Compliance records</h2>
                    </div>
                  </div>

                  <div className="document-list">
                    <div className="document-item">
                      <span>KYC verification</span>
                      <strong>{activeCustomer.kycStatus}</strong>
                    </div>
                    <div className="document-item">
                      <span>Risk assessment</span>
                      <strong>{activeCustomer.riskLevel}</strong>
                    </div>
                    <div className="document-item">
                      <span>Settlement account</span>
                      <strong>MTN {settlementAccounts.mtn} / Airtel {settlementAccounts.airtel}</strong>
                    </div>
                  </div>
                </article>
              </section>
            </>
          )}

          {customerSubView === 'details' && (
            <section className="customer-grid">
              <article className="panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow small">Profile</p>
                    <h2>Account details</h2>
                  </div>
                  <button type="button" className="secondary-button" onClick={() => setShowPaymentModal(true)}>
                    Add payment method
                  </button>
                </div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <span>Full name</span>
                    <strong>{activeCustomer.name}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Account number</span>
                    <strong>{activeCustomer.accountNumber}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Email</span>
                    <strong>{activeCustomer.email}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Account type</span>
                    <strong>{activeCustomer.account}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Risk level</span>
                    <strong>{activeCustomer.riskLevel}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Primary funding</span>
                    <strong>{activeCustomer.paymentMethod}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Mobile money</span>
                    <strong>{activeCustomer.mobileMoneyNumber || 'Not provided'}</strong>
                  </div>
                  <div className="detail-card">
                    <span>M-Pesa</span>
                    <strong>{activeCustomer.mpesaNumber || 'Not provided'}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Bank account</span>
                    <strong>
                      {activeCustomer.bankAccountNumber
                        ? `${activeCustomer.bankName || 'Bank'} • ${activeCustomer.bankAccountNumber}`
                        : 'Not linked'}
                    </strong>
                  </div>
                  <div className="detail-card">
                    <span>Visa/Mastercard</span>
                    <strong>
                      {activeCustomer.cardNumber
                        ? `${activeCustomer.cardBrand || 'Card'} • •••• ${activeCustomer.cardNumber.slice(-4)}`
                        : 'Not linked'}
                    </strong>
                  </div>
                </div>

                  <div className="saved-methods">
                    <div className="panel-header compact-header">
                      <div>
                        <p className="eyebrow small">Saved methods</p>
                        <h3>Payment accounts</h3>
                      </div>
                    </div>
                    {getPaymentMethods(activeCustomer).map((method, index) => (
                      <div key={`${method.type}-${method.detail}-${index}`} className="document-item">
                        <span>{method.type}</span>
                        <strong>{method.detail}{index === 0 ? ' • Default' : ''}</strong>
                      </div>
                    ))}
                  </div>
              </article>

              <article className="panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow small">Ops</p>
                    <h2>Settlement routing</h2>
                  </div>
                </div>

                <div className="document-list">
                  <div className="document-item">
                    <span>Default settlement</span>
                    <strong>MTN {settlementAccounts.mtn} / Airtel {settlementAccounts.airtel}</strong>
                  </div>
                  <div className="document-item">
                    <span>Notification</span>
                    <strong>SMS confirmation enabled</strong>
                  </div>
                  <div className="document-item">
                    <span>Wallet status</span>
                    <strong>Verified and funded</strong>
                  </div>
                </div>
              </article>
            </section>
          )}

          {customerSubView === 'transfers' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow small">History</p>
                  <h2>Transfer history</h2>
                </div>
              </div>

              <div className="transfer-list">
                {transferHistory.map((item) => (
                  <div key={item.id} className="transfer-item">
                    <div className="transfer-main">
                      <strong>{item.type}</strong>
                      <small>{item.id} • {item.method}</small>
                    </div>
                    <div className="transfer-meta">
                      <span className={item.amount >= 0 ? 'positive' : 'negative'}>
                        {item.amount >= 0 ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                      </span>
                      <small className={item.status === 'Completed' ? 'positive' : item.status === 'Queued' ? 'warning' : 'neutral'}>{item.status}</small>
                      <time>{item.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      ) : currentView === 'crypto' ? (
        <main className="crypto-page">
          <section className="crypto-hero panel">
            <div>
              <p className="eyebrow small">24/7 digital assets</p>
              <h1>Crypto markets, in focus.</h1>
              <p className="subtitle">Track high-liquidity pairs, compare momentum, and place a crypto order from one calm workspace.</p>
            </div>
            <div className="crypto-market-status">
              <span><i className="live-dot" /> Market open</span>
              <strong>24/7</strong>
              <small>Streaming prices • demo feed</small>
            </div>
          </section>

          <section className="crypto-stats">
            <div className="stat-card"><span>Crypto equity</span><strong>$28,640.18</strong><em>+12.4%</em></div>
            <div className="stat-card"><span>Available USDT</span><strong>8,420.55</strong><em>+4.8%</em></div>
            <div className="stat-card"><span>24h volume</span><strong>$5.28B</strong><em>Across tracked pairs</em></div>
            <div className="stat-card"><span>Risk mode</span><strong>Balanced</strong><em>Within limit</em></div>
          </section>

          <section className="crypto-workspace">
            <article className="panel crypto-chart-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow small">Price action</p>
                  <h2>{selectedCryptoMarket.name} <span className="muted-symbol">{selectedCryptoMarket.symbol}</span></h2>
                </div>
                <div className="crypto-price-block">
                  <strong>${selectedCryptoMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  <span className={selectedCryptoMarket.positive ? 'positive' : 'negative'}>{selectedCryptoMarket.change} today</span>
                </div>
              </div>
              <div className="chart-toolbar">
                {['1H', '4H', '1D', '1W'].map((period) => <button key={period} type="button" className={period === cryptoTimeframe ? 'chart-period active' : 'chart-period'} onClick={() => setCryptoTimeframe(period)}>{period}</button>)}
                <span>USD / USDT</span>
              </div>
              <div className="crypto-chart" aria-label={`${selectedCryptoMarket.symbol} price chart`}>
                {candleLayout.map((candle, index) => <span key={`${candle.open}-${index}`} className={candle.close >= candle.open ? 'candle candle-up' : 'candle candle-down'} style={{ '--candle-high': `${candle.high}%`, '--candle-low': `${candle.low}%` }}><i style={{ top: `${100 - Math.max(candle.open, candle.close)}%`, height: `${Math.max(Math.abs(candle.close - candle.open), 5)}%` }} /></span>)}
              </div>
              <div className="chart-axis"><span>00:00</span><span>08:00</span><span>16:00</span><span>Now</span></div>
              <div className="trend-strip">
                <div className="trend-signal buy-signal"><span>Buy trend</span><strong>Strong</strong><small>Momentum +72 • {cryptoTimeframe}</small></div>
                <div className="trend-signal sell-signal"><span>Sell pressure</span><strong>Low</strong><small>Resistance $65,420</small></div>
                <div className="trend-signal"><span>Support</span><strong>$61,880</strong><small>Volume confirms trend</small></div>
              </div>
            </article>

            <article className="panel crypto-ticket">
              <div className="panel-header">
                <div><p className="eyebrow small">Trade crypto</p><h2>Order ticket</h2></div>
                <span className="pill positive">Low spread</span>
              </div>
              <div className="order-toggle" aria-label="Crypto order side">
                <button type="button" className={cryptoSide === 'Buy' ? 'toggle-button buy active' : 'toggle-button buy'} onClick={() => setCryptoSide('Buy')}>Buy</button>
                <button type="button" className={cryptoSide === 'Sell' ? 'toggle-button sell active' : 'toggle-button sell'} onClick={() => setCryptoSide('Sell')}>Sell</button>
              </div>
              <label className="field-label" htmlFor="cryptoPair">Trading pair</label>
              <select id="cryptoPair" value={selectedCrypto} onChange={(event) => setSelectedCrypto(event.target.value)}>
                {liveCryptoMarkets.map((market) => <option key={market.symbol} value={market.symbol}>{market.symbol}</option>)}
              </select>
              <label className="field-label" htmlFor="cryptoQuantity">Quantity</label>
              <div className="crypto-input-wrap"><input id="cryptoQuantity" type="number" min="0.000001" step="0.000001" value={cryptoQuantity} onChange={(event) => setCryptoQuantity(event.target.value)} /><span>{selectedCryptoMarket.symbol.split('/')[0]}</span></div>
              <div className="order-summary crypto-summary"><div><span>Mark price</span><strong>${selectedCryptoMarket.price.toLocaleString()}</strong></div><div><span>Estimated total</span><strong>{formatCurrency(cryptoNotional)}</strong></div></div>
              <div className="account-balance compact"><span>Settlement wallet</span><strong>8,420.55 USDT</strong><small>Verified crypto balance • instant demo settlement</small></div>
              {cryptoSide === 'Buy' && selectedCryptoMarket.symbol === 'BTC/USDT' ? (
                <a className="primary-button order-button buy-action" href={btcEmailHref}>Email BTC purchase request</a>
              ) : (
                <button type="button" className={cryptoSide === 'Buy' ? 'primary-button order-button buy-action' : 'secondary-button order-button sell-action'} onClick={handleCryptoOrder}>{cryptoSide} {selectedCryptoMarket.symbol.split('/')[0]}</button>
              )}
              <p className="demo-note">Demo execution only. Connect a regulated exchange or broker API before accepting real orders.</p>
            </article>
          </section>

          <section className="crypto-lower-grid">
            <article className="panel crypto-markets-panel">
              <div className="panel-header"><div><p className="eyebrow small">Market explorer</p><h2>Top crypto pairs</h2></div><span className="muted-symbol">Updated just now</span></div>
              <div className="crypto-market-list">
                {liveCryptoMarkets.map((market) => <button key={market.symbol} type="button" className={market.symbol === selectedCrypto ? 'crypto-market-row active' : 'crypto-market-row'} onClick={() => setSelectedCrypto(market.symbol)}><span className="coin-badge">{market.symbol.split('/')[0].slice(0, 1)}</span><span className="crypto-name"><strong>{market.name}</strong><small>{market.symbol}</small></span><strong>${market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><span className={market.positive ? 'positive' : 'negative'}>{market.change}</span><small>{market.volume}</small></button>)}
              </div>
            </article>
            <article className="panel crypto-orders-panel">
              <div className="panel-header"><div><p className="eyebrow small">Execution log</p><h2>Recent crypto orders</h2></div></div>
              <div className="crypto-order-list">{cryptoOrders.map((order, index) => <div className="crypto-order-row" key={`${order.symbol}-${order.time}-${index}`}><div><strong>{order.symbol}</strong><small>{order.side} • {order.quantity}</small></div><div><strong>{order.total}</strong><small className="positive">{order.status} • {order.time}</small></div></div>)}</div>
            </article>
          </section>
        </main>
      ) : currentView === 'contact' ? (
        <main className="contact-page">
          <section className="contact-hero panel">
            <div>
              <p className="eyebrow small">Jaguar Markets support</p>
              <h1>Let’s talk about your account.</h1>
              <p className="subtitle">Questions about trading, funding, crypto, or customer onboarding? Send us a message and our team will respond.</p>
            </div>
            <div className="contact-channel">
              <span>Email support</span>
              <a href="mailto:ronloy255@gmail.com">ronloy255@gmail.com</a>
              <small>Account and trading enquiries</small>
            </div>
          </section>

          <section className="contact-grid">
            <form className="panel contact-form" onSubmit={handleContactSubmit}>
              <div className="panel-header">
                <div><p className="eyebrow small">Send a message</p><h2>Contact us</h2></div>
              </div>
              <div className="contact-form-grid">
                <label>Full name<input name="name" value={contactForm.name} onChange={handleContactInput} placeholder="Your name" /></label>
                <label>Email address<input name="email" type="email" value={contactForm.email} onChange={handleContactInput} placeholder="you@example.com" /></label>
              </div>
              <label>Subject<input name="subject" value={contactForm.subject} onChange={handleContactInput} placeholder="How can we help?" /></label>
              <label>Message<textarea name="message" rows="7" value={contactForm.message} onChange={handleContactInput} placeholder="Tell us what you need help with..." /></label>
              <button type="submit" className="primary-button">Open email draft</button>
              <small className="contact-note">Your default email application will open with your message addressed to Jaguar Markets.</small>
            </form>

            <aside className="panel contact-info">
              <p className="eyebrow small">Support channels</p>
              <h2>We’re here to help.</h2>
              <div className="contact-info-item"><span>General support</span><a href="mailto:ronloy255@gmail.com">ronloy255@gmail.com</a></div>
              <div className="contact-info-item"><span>Trading enquiries</span><strong>Market and order support</strong></div>
              <div className="contact-info-item"><span>Funding enquiries</span><strong>Mobile money and account support</strong></div>
              <div className="contact-info-item"><span>Response window</span><strong>During business hours</strong></div>
            </aside>
          </section>
        </main>
      ) : currentView === 'faq' ? (
        <main className="faq-page">
          <section className="faq-hero panel">
            <div>
              <p className="eyebrow small">Jaguar Markets help center</p>
              <h1>Answers before you trade.</h1>
              <p className="subtitle">Find quick answers about customer accounts, payment methods, crypto markets, and account support.</p>
            </div>
            <a className="secondary-button" href="mailto:ronloy255@gmail.com">Ask support</a>
          </section>

          <section className="faq-layout">
            <article className="panel faq-list">
              <div className="panel-header">
                <div><p className="eyebrow small">Common questions</p><h2>Frequently asked questions</h2></div>
              </div>
              {faqItems.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary>{item.question}<span aria-hidden="true">+</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </article>

            <aside className="panel faq-side-card">
              <p className="eyebrow small">Need more help?</p>
              <h2>Talk to our team.</h2>
              <p>For account-specific questions, include your customer account number in your message.</p>
              <a className="primary-button" href="mailto:ronloy255@gmail.com?subject=Jaguar%20Markets%20support">Email support</a>
              <div className="faq-support-line"><span>Email</span><strong>ronloy255@gmail.com</strong></div>
            </aside>
          </section>
        </main>
      ) : (
        <main className="dashboard" id="overview">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Trade smarter</p>
            <h1>Growth strategy built for volatile markets.</h1>
            <p className="subtitle">
              Track momentum, manage risk, and act on real-time market signals from a
              single control center.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-button" onClick={() => setShowAccountModal(true)}>
                Open account
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowLoginModal(true)}>
                {isLoggedIn ? 'Portal access' : 'Customer sign in'}
              </button>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <em>{stat.change}</em>
                </div>
              ))}
            </div>
          </div>

          <aside className="portfolio-card" id="portfolio" aria-label="Portfolio summary">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Portfolio</p>
                <h2>Alpha basket</h2>
              </div>
              <span className="pill positive">+9.7%</span>
            </div>

            <div className="equity-ring" aria-hidden="true">
              <div className="equity-inner">
                <span>Equity</span>
                <strong>$148.4K</strong>
              </div>
            </div>

            <div className="positions-list">
              {positions.map((position) => (
                <div key={position.symbol} className="position-row">
                  <div className="position-symbol">
                    <span>{position.symbol}</span>
                    <small>{position.shares} shares</small>
                  </div>

                  <div className="position-meta">
                    <span>{position.price}</span>
                    <strong className={position.positive ? 'positive' : 'negative'}>
                      {position.pnl}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="account-balance">
              <span>Available cash</span>
              <strong>{readableCash}</strong>
              <small>{activeCustomer.name} • {activeCustomer.paymentMethod}</small>
            </div>

            <div className="account-balance compact">
              <span>Customer status</span>
              <strong>{activeCustomer.kycStatus}</strong>
              <small>{customerRiskLabel} • last funding {activeCustomer.lastFunding}</small>
            </div>
          </aside>
        </section>

        <section className="panel workflow-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Operations flow</p>
              <h2>Production customer lifecycle</h2>
            </div>
            <span className="pill positive">{Math.round(workflowProgress)}% complete</span>
          </div>

          <div className="workflow-layout">
            <div className="workflow-progress" aria-label="Customer onboarding progress">
              <div className="progress-bar">
                <span style={{ width: `${workflowProgress}%` }} />
              </div>

              <div className="workflow-steps">
                {workflowStages.map((stage, index) => (
                  <div
                    key={stage.label}
                    className={index <= currentFlowStep ? 'workflow-step active' : 'workflow-step'}
                  >
                    <span className="workflow-index">{index + 1}</span>
                    <div>
                      <strong>{stage.label}</strong>
                      <small>{stage.detail}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workflow-summary">
              <span>Live status</span>
              <strong>{currentWorkflowStage.label}</strong>
              <p>{currentWorkflowStage.detail}</p>

              <div className="workflow-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setCurrentFlowStep(Math.min(currentFlowStep + 1, workflowStages.length - 1))}
                >
                  Advance step
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setCurrentFlowStep(Math.max(currentFlowStep - 1, 0))}
                >
                  Rewind
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="market-grid" id="markets">
          <article className="panel chart-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Market pulse</p>
                <h2>US tech momentum</h2>
              </div>
              <span className="pill positive">Strong</span>
            </div>

            <div className="chart-bars" aria-label="Market trend chart">
              {[42, 58, 47, 73, 68, 88, 92, 86, 96, 105, 99, 118].map((value, index) => (
                <span
                  key={index}
                  className="bar"
                  style={{ height: `${value}%` }}
                  aria-label={`Point ${index + 1}: ${value}`}
                />
              ))}
            </div>
          </article>

          <article className="panel watchlist-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Watchlist</p>
                <h2>Top movers</h2>
              </div>
            </div>

            <ul className="watchlist">
              {watchlist.map((item) => (
                <li key={item.name} className="watch-row">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.price}</small>
                  </div>
                  <span className={item.positive ? 'positive' : 'negative'}>{item.trend}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="lower-grid">
          <article className="panel market-table-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Live market</p>
                <h2>Stocks</h2>
              </div>
            </div>

            <div className="table-header" aria-hidden="true">
              <span>Symbol</span>
              <span>Last</span>
              <span>Change</span>
              <span>Volume</span>
            </div>

            <div className="market-table">
              {marketRows.map((row) => (
                <button
                  key={row.symbol}
                  type="button"
                  className={row.symbol === selectedSymbol ? 'ticker-row active' : 'ticker-row'}
                  onClick={() => setSelectedSymbol(row.symbol)}
                >
                  <span>{row.symbol}</span>
                  <span>${row.last.toFixed(2)}</span>
                  <span className={row.positive ? 'positive' : 'negative'}>{row.change}</span>
                  <span>{row.volume}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="panel order-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Order ticket</p>
                <h2>{selectedSymbol}</h2>
              </div>
            </div>

            <div className="order-toggle" aria-label="Order side selection">
              <button
                type="button"
                className={side === 'Buy' ? 'toggle-button buy active' : 'toggle-button buy'}
                onClick={() => setSide('Buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={side === 'Sell' ? 'toggle-button sell active' : 'toggle-button sell'}
                onClick={() => setSide('Sell')}
              >
                Sell
              </button>
            </div>

            <label className="field-label" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            />

            <label className="field-label" htmlFor="paymentMethod">
              Payment method
            </label>
            <select
              id="paymentMethod"
              className="payment-select"
              value={selectedPaymentMethod}
              onChange={(event) => {
                const value = event.target.value
                setSelectedPaymentMethod(value)
                setCardFunding(value === 'Card')
              }}
            >
              <option value="Mobile Money">Mobile Money</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Card">Card</option>
            </select>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={notifyCustomer}
                onChange={(event) => setNotifyCustomer(event.target.checked)}
              />
              <span>Send phone notification for confirmation</span>
            </label>

            {selectedPaymentMethod === 'Card' && (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={cardFunding}
                  onChange={(event) => setCardFunding(event.target.checked)}
                />
                <span>Credit the customer card</span>
              </label>
            )}

            <div className="order-summary">
              <div>
                <span>Last price</span>
                <strong>${selected.last.toFixed(2)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>${total}</strong>
              </div>
            </div>

            <div className="account-balance compact">
              <span>Funding account</span>
              <strong>{activeCustomer.name}</strong>
              <small>{activeCustomer.paymentMethod} • {readableCash}</small>
            </div>

            <div className="order-status" role="status" aria-live="polite">
              {status}
            </div>

            <div className="order-actions">
              <button
                type="button"
                className={side === 'Buy' ? 'primary-button order-button buy-action' : 'secondary-button order-button sell-action'}
                onClick={openConfirmation}
              >
                {side} {quantity} shares
              </button>
            </div>
          </article>
        </section>

        <section className="operations-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Settlement</p>
                <h2>Settlement timeline</h2>
              </div>
            </div>

            <div className="timeline-list">
              {settlementTimeline.map((item) => (
                <div key={item.label} className="timeline-item">
                  <span className="timeline-dot" aria-hidden="true"></span>
                  <div className="timeline-copy">
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </div>
                  <div className="timeline-meta">
                    <span className={item.status === 'Completed' ? 'positive' : item.status === 'Queued' ? 'warning' : 'neutral'}>{item.status}</span>
                    <time>{item.time}</time>
                    <strong>{item.amount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Risk</p>
                <h2>Exposure overview</h2>
              </div>
            </div>

            <div className="risk-list">
              {riskExposure.map((item) => (
                <div key={item.label} className="risk-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <em>{item.change}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Wallet</p>
                <h2>Wallet history</h2>
              </div>
            </div>

            <div className="wallet-list compact-wallet-list">
              {walletTransactions.map((item, index) => (
                <div key={`${item.label}-${item.time}-${index}`} className="wallet-item">
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.method}</small>
                  </div>
                  <div className="wallet-meta">
                    <span className={item.amount >= 0 ? 'positive' : 'negative'}>
                      {item.amount >= 0 ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                    </span>
                    <time>{item.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Approvals</p>
                <h2>Approval dashboard</h2>
              </div>
            </div>

            <div className="admin-toolbar">
              <button type="button" className="toolbar-button primary" onClick={handleBulkApprove}>
                Approve selected
              </button>
              <button type="button" className="toolbar-button" onClick={handleExportApprovals}>
                Export CSV
              </button>
              <button type="button" className="toolbar-button" onClick={handleRiskRefresh}>
                Refresh risk
              </button>
            </div>

            <div className="filter-row" aria-label="Approval filters">
              {['All', 'Pending', 'Approved', 'Rejected', 'Awaiting docs'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={approvalFilter === filter ? 'filter-button active' : 'filter-button'}
                  onClick={() => setApprovalFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="approval-list">
              {filteredApprovals.map((item) => (
                <div key={`${item.customer}-${item.action}`} className="approval-item">
                  <input
                    type="checkbox"
                    className="selection-toggle"
                    checked={selectedApprovals.includes(item.customer)}
                    onChange={() => toggleApprovalSelection(item.customer)}
                    aria-label={`Select ${item.customer}`}
                  />
                  <div className="approval-main">
                    <strong>{item.customer}</strong>
                    <small>{item.account} • {item.action}</small>
                  </div>
                  <div className="approval-meta">
                    <span className={item.status === 'Pending' ? 'warning' : item.status === 'Rejected' ? 'negative' : item.status === 'Approved' ? 'positive' : 'neutral'}>{item.status}</span>
                    <small>{item.risk} risk • score {item.score}</small>
                    <strong>{item.amount}</strong>
                    <div className="approval-actions">
                      <button type="button" className="tiny-button approve" onClick={() => handleApprovalUpdate(item.customer, 'Approved')}>
                        Approve
                      </button>
                      <button type="button" className="tiny-button reject" onClick={() => handleApprovalUpdate(item.customer, 'Rejected')}>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel account-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Customer onboarding</p>
              <h2>Open accounts</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => setShowAccountModal(true)}>
              New account
            </button>
          </div>

          <div className="customer-list">
            {customers.map((customer) => (
              <button
                type="button"
                key={`${customer.name}-${customer.account}`}
                className={selectedCustomer === customer.name ? 'customer-row customer-row-active' : 'customer-row'}
                onClick={() => {
                  setSelectedCustomer(customer.name)
                  setSelectedPaymentMethod(customer.paymentMethod)
                  setStatus(`${customer.name} is selected. ${customer.paymentMethod} is available for direct settlement.`)
                }}
              >
                <span className={`avatar avatar-small avatar-${getAvatarColor(customer.name)}`} aria-hidden="true">
                  {getAvatarInitials(customer.name)}
                </span>
                <div>
                  <strong>{customer.name}</strong>
                  <small>
                  {customer.accountNumber} • {customer.account} • ${customer.walletBalance.toLocaleString()} • {customer.paymentMethod}
                  {customer.mobileMoneyNumber ? ` • MM: ${customer.mobileMoneyNumber}` : ''}
                  {customer.cardNumber ? ` • Card: ****${customer.cardNumber.slice(-4)}` : ''}
                </small>
              </div>
              <span className={customer.status === 'Approved' ? 'positive' : 'negative'}>{customer.status}</span>
            </button>
            ))}
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Recent activity</p>
              <h2>Latest trades</h2>
            </div>
          </div>

          <div className="trade-list">
            {trades.map((trade) => (
              <div key={`${trade.symbol}-${trade.time}-${trade.side}`} className="trade-item">
                <div>
                  <strong>{trade.symbol}</strong>
                  <small>
                    {trade.side} • {trade.quantity} shares
                  </small>
                </div>
                <div className="trade-meta">
                  <span className={trade.side === 'Buy' ? 'positive' : 'negative'}>
                    {trade.side}
                  </span>
                  <small>${trade.total.toFixed(2)}</small>
                  <time>{trade.time}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel wallet-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Wallet ledger</p>
              <h2>Payment activity</h2>
            </div>
          </div>

          <div className="wallet-list">
            {walletTransactions.map((item, index) => (
              <div key={`${item.label}-${item.time}-${index}`} className="wallet-item">
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.method}</small>
                </div>
                <div className="wallet-meta">
                  <span className={item.amount >= 0 ? 'positive' : 'negative'}>
                    {item.amount >= 0 ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                  </span>
                  <time>{item.time}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel audit-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Compliance</p>
              <h2>Audit trail</h2>
            </div>
          </div>

          <div className="audit-list">
            {auditLog.map((item) => (
              <div key={`${item.time}-${item.action}`} className="audit-item">
                <div>
                  <strong>{item.actor}</strong>
                  <small>{item.action}</small>
                </div>
                <div className="audit-meta">
                  <span className={item.status === 'Success' || item.status === 'Completed' ? 'positive' : item.status === 'Monitoring' ? 'warning' : 'neutral'}>{item.status}</span>
                  <time>{item.time}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="insights-panel panel" id="insights">
          <div className="panel-header">
            <div>
              <p className="eyebrow small">Signal board</p>
              <h2>Actionable trading insights</h2>
            </div>
          </div>

          <div className="insight-list">
            {insights.map((insight) => (
              <div key={insight} className="insight-item">
                <span className="dot" aria-hidden="true"></span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    )}

      {showLoginModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card account-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Customer access</p>
                <h2>{isLoggedIn ? 'Portal active' : 'Sign in'}</h2>
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="account-form">
                <label>
                  Email address
                  <input name="email" type="email" value={loginForm.email} onChange={handleLoginInput} />
                </label>

                <label>
                  Password
                  <input name="password" type="password" value={loginForm.password} onChange={handleLoginInput} />
                </label>

                <div className="modal-actions">
                  <button type="button" className="secondary-button" onClick={() => setShowLoginModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="primary-button" onClick={handleLogin}>
                    Sign in
                  </button>
                </div>
              </div>
            ) : (
              <div className="confirm-body">
                <p>You are signed in and can now continue using the trading portal.</p>
                <div className="confirm-total">
                  <span>Session</span>
                  <strong>Active</strong>
                </div>
                <div className="modal-actions">
                  <button type="button" className="primary-button" onClick={() => setShowLoginModal(false)}>
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Confirm order</p>
                <h2>{side} {selectedSymbol}</h2>
              </div>
            </div>

            <div className="confirm-body">
              <p>
                You are about to {side.toLowerCase()} {quantity} share{quantity > 1 ? 's' : ''} at ${selected.last.toFixed(2)}.
              </p>
              <div className="confirm-total">
                <span>Payment route</span>
                <strong>{selectedPaymentMethod}</strong>
              </div>
              <div className="confirm-total">
                <span>Total notional</span>
                <strong>${total}</strong>
              </div>
              <div className="confirm-total">
                <span>Settlement</span>
                <strong>MTN {settlementAccounts.mtn} / Airtel {settlementAccounts.airtel}</strong>
              </div>
              <div className="confirm-total">
                <span>Auto flow</span>
                <strong>{selectedPaymentMethod} debit → Airtel credit</strong>
              </div>
              <div className="confirm-total">
                <span>Risk check</span>
                <strong>{activeCustomer.riskLevel || 'Moderate'} risk</strong>
              </div>
              <div className="confirm-total">
                <span>Phone confirm</span>
                <strong>{notifyCustomer ? 'Enabled' : 'Disabled'}</strong>
              </div>
              {selectedPaymentMethod === 'Card' && (
                <div className="confirm-total">
                  <span>Card credit</span>
                  <strong>{cardFunding ? 'Enabled' : 'Disabled'}</strong>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleTrade}>
                Confirm {side}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card account-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Customer wallet</p>
                <h2>Add payment method</h2>
              </div>
            </div>

            <div className="account-form">
              <label>
                Payment method
                <select name="type" value={paymentForm.type} onChange={handlePaymentInput}>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Card">Visa or Mastercard</option>
                </select>
              </label>

              {paymentForm.type === 'Mobile Money' ? (
                <label>
                  Mobile money number
                  <input name="mobileMoneyNumber" value={paymentForm.mobileMoneyNumber} onChange={handlePaymentInput} placeholder="+256700000000" />
                </label>
              ) : null}

              {paymentForm.type === 'M-Pesa' ? (
                <label>
                  M-Pesa number
                  <input name="mpesaNumber" value={paymentForm.mpesaNumber} onChange={handlePaymentInput} placeholder="+254700000000" />
                </label>
              ) : null}

              {paymentForm.type === 'Bank Account' ? (
                <>
                  <label>
                    Bank name
                    <input name="bankName" value={paymentForm.bankName} onChange={handlePaymentInput} placeholder="Stanbic Bank" />
                  </label>
                  <label>
                    Bank account number
                    <input name="bankAccountNumber" value={paymentForm.bankAccountNumber} onChange={handlePaymentInput} placeholder="0011223344" />
                  </label>
                </>
              ) : null}

              {paymentForm.type === 'Card' ? (
                <>
                  <label>
                    Card brand
                    <select name="cardBrand" value={paymentForm.cardBrand} onChange={handlePaymentInput}>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                    </select>
                  </label>
                  <label>
                    Cardholder name
                    <input name="cardHolder" value={paymentForm.cardHolder} onChange={handlePaymentInput} placeholder="Ava Lee" />
                  </label>
                  <label>
                    Card number
                    <input name="cardNumber" inputMode="numeric" value={paymentForm.cardNumber} onChange={handlePaymentInput} placeholder="4242 4242 4242 4242" />
                  </label>
                </>
              ) : null}
            </div>

            <p className="modal-note">Demo only: no real payment is charged. Saving a method simulates verification.</p>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button type="button" className="primary-button" onClick={handlePaymentMethodAdd}>Save method</button>
            </div>
          </div>
        </div>
      )}

      {showAccountModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card account-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">New customer</p>
                <h2>Open account</h2>
              </div>
            </div>

            <div className="account-form">
              <label>
                Full name
                <input name="name" value={accountForm.name} onChange={handleAccountInput} placeholder="Jordan Smith" />
              </label>

              <label>
                Email address
                <input name="email" type="email" value={accountForm.email} onChange={handleAccountInput} placeholder="jordan@email.com" />
              </label>

              <label>
                Account type
                <select name="accountType" value={accountForm.accountType} onChange={handleAccountInput}>
                  <option value="Standard">Standard</option>
                  <option value="Margin">Margin</option>
                  <option value="IRA">IRA</option>
                </select>
              </label>

              <label>
                Initial deposit
                <input name="initialDeposit" type="number" min="0" value={accountForm.initialDeposit} onChange={handleAccountInput} />
              </label>

              <label>
                Funding source
                <select name="paymentMethod" value={accountForm.paymentMethod} onChange={handleAccountInput}>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Card">Card</option>
                </select>
              </label>

              {accountForm.paymentMethod === 'Mobile Money' || accountForm.paymentMethod === 'M-Pesa' ? (
                <>
                  {accountForm.paymentMethod === 'Mobile Money' ? (
                    <label>
                      Mobile money number
                      <input
                        name="mobileMoneyNumber"
                        value={accountForm.mobileMoneyNumber}
                        onChange={handleAccountInput}
                        placeholder="+256700000000"
                      />
                    </label>
                  ) : null}

                  {accountForm.paymentMethod === 'M-Pesa' ? (
                    <label>
                      M-Pesa number
                      <input
                        name="mpesaNumber"
                        value={accountForm.mpesaNumber}
                        onChange={handleAccountInput}
                        placeholder="+254700000000"
                      />
                    </label>
                  ) : null}
                </>
              ) : null}

              {accountForm.paymentMethod === 'Bank Account' ? (
                <>
                  <label>
                    Bank name
                    <input
                      name="bankName"
                      value={accountForm.bankName}
                      onChange={handleAccountInput}
                      placeholder="Stanbic Bank"
                    />
                  </label>

                  <label>
                    Bank account number
                    <input
                      name="bankAccountNumber"
                      value={accountForm.bankAccountNumber}
                      onChange={handleAccountInput}
                      placeholder="0011223344"
                    />
                  </label>
                </>
              ) : null}

              {accountForm.paymentMethod === 'Card' ? (
                <>
                  <label>
                    Card brand
                    <select name="cardBrand" value={accountForm.cardBrand} onChange={handleAccountInput}>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                    </select>
                  </label>

                  <label>
                    Cardholder name
                    <input
                      name="cardHolder"
                      value={accountForm.cardHolder}
                      onChange={handleAccountInput}
                      placeholder="Ava Lee"
                    />
                  </label>

                  <label>
                    Card number
                    <input
                      name="cardNumber"
                      value={accountForm.cardNumber}
                      onChange={handleAccountInput}
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>

                  <div className="card-split">
                    <label>
                      Expiry
                      <input
                        name="expiry"
                        value={accountForm.expiry}
                        onChange={handleAccountInput}
                        placeholder="MM/YY"
                      />
                    </label>

                    <label>
                      CVV
                      <input
                        name="cvv"
                        value={accountForm.cvv}
                        onChange={handleAccountInput}
                        placeholder="123"
                      />
                    </label>
                  </div>
                </>
              ) : null}
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowAccountModal(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleAccountOpen}>
                Create account
              </button>
            </div>
          </div>
        </div>
      )}

      <a
        className="whatsapp-widget"
        href="https://wa.me/256709991502?text=Hello%20UGTrading%20team%2C%20I%20need%20help%20with%20my%20account."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-icon" aria-hidden="true">💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  )
}

export default App
