import { useState } from 'react'
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
    name: 'Ava Lee',
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
    name: 'Noah Patel',
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
  const [transferHistory, setTransferHistory] = useState(initialTransferHistory)
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
      setIsLoggedIn(true)
      setCurrentFlowStep(2)
      setStatus(`Welcome back, ${loginForm.email.split('@')[0]}. You are signed in and can continue with operations.`)
      setShowLoginModal(false)
      return
    }

    setStatus('Please enter both your email and password to sign in.')
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
      name,
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
          <button
            type="button"
            className={currentView === 'operator' ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentView('operator')}
          >
            Overview
          </button>
          <button
            type="button"
            className={currentView === 'customer' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginModal(true)
                return
              }
              setCurrentView('customer')
            }}
          >
            Customer portal
          </button>
          <button type="button" className="nav-link" onClick={() => setCurrentView('operator')}>
            Markets
          </button>
          <button type="button" className="nav-link" onClick={() => setCurrentView('customer')}>
            Portfolio
          </button>
        </nav>

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
                  {customer.account} • ${customer.walletBalance.toLocaleString()} • {customer.paymentMethod}
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
