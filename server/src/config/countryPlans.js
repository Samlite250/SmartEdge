const countryPlans = {
  Kenya: [
    { level: 1,  name: 'VIP 1',  min: 1000,     max: 1000,     daily_return: 10, duration: 30 },
    { level: 2,  name: 'VIP 2',  min: 2000,     max: 2000,     daily_return: 10, duration: 30 },
    { level: 3,  name: 'VIP 3',  min: 5000,     max: 5000,     daily_return: 10, duration: 30 },
    { level: 4,  name: 'VIP 4',  min: 10000,    max: 10000,    daily_return: 10, duration: 30 },
    { level: 5,  name: 'VIP 5',  min: 20000,    max: 20000,    daily_return: 10, duration: 30 },
    { level: 6,  name: 'VIP 6',  min: 30000,    max: 30000,    daily_return: 10, duration: 30 },
    { level: 7,  name: 'VIP 7',  min: 50000,    max: 50000,    daily_return: 10, duration: 30 },
    { level: 8,  name: 'VIP 8',  min: 100000,   max: 100000,   daily_return: 10, duration: 30 },
    { level: 9,  name: 'VIP 9',  min: 200000,   max: 200000,   daily_return: 10, duration: 30 },
    { level: 10, name: 'VIP 10', min: 300000,   max: 300000,   daily_return: 10, duration: 30 },
    { level: 11, name: 'VIP 11', min: 500000,   max: 500000,   daily_return: 10, duration: 30 },
    { level: 12, name: 'VIP 12', min: 700000,   max: 700000,   daily_return: 10, duration: 30 },
    { level: 13, name: 'VIP 13', min: 800000,   max: 800000,   daily_return: 10, duration: 30 },
    { level: 14, name: 'VIP 14', min: 1000000,  max: 1000000,  daily_return: 10, duration: 30 },
  ],
  Burundi: [
    { level: 1,  name: 'VIP 1',  min: 100000,   max: 100000,   daily_return: 10, duration: 30 },
    { level: 2,  name: 'VIP 2',  min: 200000,   max: 200000,   daily_return: 10, duration: 30 },
    { level: 3,  name: 'VIP 3',  min: 300000,   max: 300000,   daily_return: 10, duration: 30 },
    { level: 4,  name: 'VIP 4',  min: 500000,   max: 500000,   daily_return: 10, duration: 30 },
    { level: 5,  name: 'VIP 5',  min: 700000,   max: 700000,   daily_return: 10, duration: 30 },
    { level: 6,  name: 'VIP 6',  min: 900000,   max: 900000,   daily_return: 10, duration: 30 },
    { level: 7,  name: 'VIP 7',  min: 1100000,  max: 1100000,  daily_return: 10, duration: 30 },
    { level: 8,  name: 'VIP 8',  min: 1300000,  max: 1300000,  daily_return: 10, duration: 30 },
    { level: 9,  name: 'VIP 9',  min: 1500000,  max: 1500000,  daily_return: 10, duration: 30 },
    { level: 10, name: 'VIP 10', min: 1800000,  max: 1800000,  daily_return: 10, duration: 30 },
    { level: 11, name: 'VIP 11', min: 2100000,  max: 2100000,  daily_return: 10, duration: 30 },
    { level: 12, name: 'VIP 12', min: 2500000,  max: 2500000,  daily_return: 10, duration: 30 },
    { level: 13, name: 'VIP 13', min: 3000000,  max: 3000000,  daily_return: 10, duration: 30 },
  ],
  Uganda: [
    { level: 1,  name: 'VIP 1',  min: 20000,    max: 20000,    daily_return: 10, duration: 30 },
    { level: 2,  name: 'VIP 2',  min: 50000,    max: 50000,    daily_return: 10, duration: 30 },
    { level: 3,  name: 'VIP 3',  min: 100000,   max: 100000,   daily_return: 10, duration: 30 },
    { level: 4,  name: 'VIP 4',  min: 200000,   max: 200000,   daily_return: 10, duration: 30 },
    { level: 5,  name: 'VIP 5',  min: 300000,   max: 300000,   daily_return: 10, duration: 30 },
    { level: 6,  name: 'VIP 6',  min: 400000,   max: 400000,   daily_return: 10, duration: 30 },
    { level: 7,  name: 'VIP 7',  min: 500000,   max: 500000,   daily_return: 10, duration: 30 },
    { level: 8,  name: 'VIP 8',  min: 700000,   max: 700000,   daily_return: 10, duration: 30 },
    { level: 9,  name: 'VIP 9',  min: 800000,   max: 800000,   daily_return: 10, duration: 30 },
    { level: 10, name: 'VIP 10', min: 1000000,  max: 1000000,  daily_return: 10, duration: 30 },
  ],
  Rwanda: [
    { level: 1,  name: 'VIP 1',  min: 10000,    max: 10000,    daily_return: 10, duration: 30 },
    { level: 2,  name: 'VIP 2',  min: 20000,    max: 20000,    daily_return: 10, duration: 30 },
    { level: 3,  name: 'VIP 3',  min: 30000,    max: 30000,    daily_return: 10, duration: 30 },
    { level: 4,  name: 'VIP 4',  min: 50000,    max: 50000,    daily_return: 10, duration: 30 },
    { level: 5,  name: 'VIP 5',  min: 70000,    max: 70000,    daily_return: 10, duration: 30 },
    { level: 6,  name: 'VIP 6',  min: 100000,   max: 100000,   daily_return: 10, duration: 30 },
    { level: 7,  name: 'VIP 7',  min: 150000,   max: 150000,   daily_return: 10, duration: 30 },
    { level: 8,  name: 'VIP 8',  min: 200000,   max: 200000,   daily_return: 10, duration: 30 },
    { level: 9,  name: 'VIP 9',  min: 300000,   max: 300000,   daily_return: 10, duration: 30 },
    { level: 10, name: 'VIP 10', min: 500000,   max: 500000,   daily_return: 10, duration: 30 },
    { level: 11, name: 'VIP 11', min: 700000,   max: 700000,   daily_return: 10, duration: 30 },
    { level: 12, name: 'VIP 12', min: 1000000,  max: 1000000,  daily_return: 10, duration: 30 },
    { level: 13, name: 'VIP 13', min: 2000000,  max: 2000000,  daily_return: 10, duration: 30 },
    { level: 14, name: 'VIP 14', min: 3000000,  max: 3000000,  daily_return: 10, duration: 30 },
  ],
};

const VIP_COUNTRIES = Object.keys(countryPlans);

function getCountryPlans(country) {
  return countryPlans[country] || null;
}

function hasVIPPlans(country) {
  return VIP_COUNTRIES.includes(country);
}

module.exports = { getCountryPlans, hasVIPPlans, VIP_COUNTRIES };
