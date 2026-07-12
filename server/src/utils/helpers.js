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
    Tanzania: ['Tigo Pesa', 'M-Pesa', 'Airtel Money'],
    Nigeria: ['Bank Transfer', 'USDT'],
    South Africa: ['EFT', 'SnapScan', 'USDT'],
    Ghana: ['MTN Mobile Money', 'Vodafone Cash'],
    'United States': ['Bank Transfer', 'USDT', 'Bitcoin'],
    'United Kingdom': ['Bank Transfer', 'USDT'],
    India: ['UPI', 'Bank Transfer', 'USDT'],
    Ethiopia: ['Telebirr', 'CBE Birr'],
    'Democratic Republic of Congo': ['M-Pesa', 'Airtel Money'],
    Zambia: ['MTN MoMo', 'Airtel Money'],
    Zimbabwe: ['EcoCash', 'USDT'],
    Mozambique: ['M-Pesa', 'e-Mola'],
    Cameroon: ['MTN Mobile Money', 'Orange Money'],
    Senegal: ['Orange Money', 'Wave'],
  };
  return methods[country] || ['USDT', 'Bitcoin', 'Ethereum'];
};

const getCountryCurrency = (country) => {
  const currencies = {
    'Afghanistan': 'AFN', 'Albania': 'ALL', 'Algeria': 'DZD', 'Andorra': 'EUR',
    'Angola': 'AOA', 'Antigua and Barbuda': 'XCD', 'Argentina': 'ARS', 'Armenia': 'AMD',
    'Australia': 'AUD', 'Austria': 'EUR', 'Azerbaijan': 'AZN', 'Bahamas': 'BSD',
    'Bahrain': 'BHD', 'Bangladesh': 'BDT', 'Barbados': 'BBD', 'Belarus': 'BYN',
    'Belgium': 'EUR', 'Belize': 'BZD', 'Benin': 'XOF', 'Bhutan': 'BTN',
    'Bolivia': 'BOB', 'Bosnia and Herzegovina': 'BAM', 'Botswana': 'BWP', 'Brazil': 'BRL',
    'Brunei': 'BND', 'Bulgaria': 'BGN', 'Burkina Faso': 'XOF', 'Burundi': 'BIF',
    'Cambodia': 'KHR', 'Cameroon': 'XAF', 'Canada': 'CAD', 'Cape Verde': 'CVE',
    'Central African Republic': 'XAF', 'Chad': 'XAF', 'Chile': 'CLP', 'China': 'CNY',
    'Colombia': 'COP', 'Comoros': 'KMF', 'Congo (DRC)': 'CDF', 'Congo (Republic)': 'XAF',
    'Costa Rica': 'CRC', 'Croatia': 'EUR', 'Cuba': 'CUP', 'Cyprus': 'EUR',
    'Czech Republic': 'CZK', 'Denmark': 'DKK', 'Djibouti': 'DJF', 'Dominica': 'XCD',
    'Dominican Republic': 'DOP', 'East Timor': 'USD', 'Ecuador': 'USD', 'Egypt': 'EGP',
    'El Salvador': 'USD', 'Equatorial Guinea': 'XAF', 'Eritrea': 'ERN', 'Estonia': 'EUR',
    'Eswatini': 'SZL', 'Ethiopia': 'ETB', 'Fiji': 'FJD', 'Finland': 'EUR',
    'France': 'EUR', 'Gabon': 'XAF', 'Gambia': 'GMD', 'Georgia': 'GEL',
    'Germany': 'EUR', 'Ghana': 'GHS', 'Greece': 'EUR', 'Grenada': 'XCD',
    'Guatemala': 'GTQ', 'Guinea': 'GNF', 'Guinea-Bissau': 'XOF', 'Guyana': 'GYD',
    'Haiti': 'HTG', 'Honduras': 'HNL', 'Hungary': 'HUF', 'Iceland': 'ISK',
    'India': 'INR', 'Indonesia': 'IDR', 'Iran': 'IRR', 'Iraq': 'IQD',
    'Ireland': 'EUR', 'Israel': 'ILS', 'Italy': 'EUR', 'Ivory Coast': 'XOF',
    'Jamaica': 'JMD', 'Japan': 'JPY', 'Jordan': 'JOD', 'Kazakhstan': 'KZT',
    'Kenya': 'KES', 'Kiribati': 'AUD', 'Kosovo': 'EUR', 'Kuwait': 'KWD',
    'Kyrgyzstan': 'KGS', 'Laos': 'LAK', 'Latvia': 'EUR', 'Lebanon': 'LBP',
    'Lesotho': 'LSL', 'Liberia': 'LRD', 'Libya': 'LYD', 'Liechtenstein': 'CHF',
    'Lithuania': 'EUR', 'Luxembourg': 'EUR', 'Madagascar': 'MGA', 'Malawi': 'MWK',
    'Malaysia': 'MYR', 'Maldives': 'MVR', 'Mali': 'XOF', 'Malta': 'EUR',
    'Marshall Islands': 'USD', 'Mauritania': 'MRU', 'Mauritius': 'MUR', 'Mexico': 'MXN',
    'Micronesia': 'USD', 'Moldova': 'MDL', 'Monaco': 'EUR', 'Mongolia': 'MNT',
    'Montenegro': 'EUR', 'Morocco': 'MAD', 'Mozambique': 'MZN', 'Myanmar': 'MMK',
    'Namibia': 'NAD', 'Nauru': 'AUD', 'Nepal': 'NPR', 'Netherlands': 'EUR',
    'New Zealand': 'NZD', 'Nicaragua': 'NIO', 'Niger': 'XOF', 'Nigeria': 'NGN',
    'North Korea': 'KPW', 'North Macedonia': 'MKD', 'Norway': 'NOK', 'Oman': 'OMR',
    'Pakistan': 'PKR', 'Palau': 'USD', 'Palestine': 'ILS', 'Panama': 'PAB',
    'Papua New Guinea': 'PGK', 'Paraguay': 'PYG', 'Peru': 'PEN', 'Philippines': 'PHP',
    'Poland': 'PLN', 'Portugal': 'EUR', 'Qatar': 'QAR', 'Romania': 'RON',
    'Russia': 'RUB', 'Rwanda': 'RWF', 'Saint Kitts and Nevis': 'XCD', 'Saint Lucia': 'XCD',
    'Saint Vincent and the Grenadines': 'XCD', 'Samoa': 'WST', 'San Marino': 'EUR',
    'Sao Tome and Principe': 'STN', 'Saudi Arabia': 'SAR', 'Senegal': 'XOF',
    'Serbia': 'RSD', 'Seychelles': 'SCR', 'Sierra Leone': 'SLL', 'Singapore': 'SGD',
    'Slovakia': 'EUR', 'Slovenia': 'EUR', 'Solomon Islands': 'SBD', 'Somalia': 'SOS',
    'South Africa': 'ZAR', 'South Korea': 'KRW', 'South Sudan': 'SSP', 'Spain': 'EUR',
    'Sri Lanka': 'LKR', 'Sudan': 'SDG', 'Suriname': 'SRD', 'Sweden': 'SEK',
    'Switzerland': 'CHF', 'Syria': 'SYP', 'Taiwan': 'TWD', 'Tajikistan': 'TJS',
    'Tanzania': 'TZS', 'Thailand': 'THB', 'Togo': 'XOF', 'Tonga': 'TOP',
    'Trinidad and Tobago': 'TTD', 'Tunisia': 'TND', 'Turkey': 'TRY', 'Turkmenistan': 'TMT',
    'Tuvalu': 'AUD', 'Uganda': 'UGX', 'Ukraine': 'UAH', 'United Arab Emirates': 'AED',
    'United Kingdom': 'GBP', 'United States': 'USD', 'Uruguay': 'UYU', 'Uzbekistan': 'UZS',
    'Vanuatu': 'VUV', 'Vatican City': 'EUR', 'Venezuela': 'VES', 'Vietnam': 'VND',
    'Yemen': 'YER', 'Zambia': 'ZMW', 'Zimbabwe': 'ZWL',
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
