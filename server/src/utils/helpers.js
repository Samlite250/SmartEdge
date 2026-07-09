const crypto = require('crypto');

const generateRef = (prefix = 'SE') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const generateDepositRef = () => generateRef('DEP');
const generateWithdrawRef = () => generateRef('WTH');
const generateTransactionRef = () => generateRef('TXN');
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const calculateDailyReturn = (amount, percentage) => {
  return (amount * percentage) / 100;
};

const calculateTotalReturn = (amount, percentage, duration) => {
  const daily = calculateDailyReturn(amount, percentage);
  return daily * duration;
};

const calculateGrowth = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

const getPaymentMethodsForCountry = (country) => {
  const methods = {
    Uganda: ['MTN Mobile Money', 'Airtel Money'],
    Kenya: ['M-Pesa', 'Airtel Money'],
    Rwanda: ['MTN MoMo', 'Airtel Money'],
    Burundi: ['Lumicash', 'EcoCash'],
  };
  return methods[country] || ['USDT', 'Bitcoin', 'Ethereum'];
};

const getCountryCurrency = (country) => {
  const currencies = {
    Uganda: 'UGX',
    Kenya: 'KES',
    Rwanda: 'RWF',
    Burundi: 'BIF',
  };
  return currencies[country] || 'USD';
};

module.exports = {
  generateDepositRef,
  generateWithdrawRef,
  generateTransactionRef,
  generateReferralCode,
  calculateDailyReturn,
  calculateTotalReturn,
  calculateGrowth,
  formatCurrency,
  getPaymentMethodsForCountry,
  getCountryCurrency,
};
