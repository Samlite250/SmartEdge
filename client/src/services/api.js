import api from '../lib/api'

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(r => r.data),
}

export const userApi = {
  getProfile: () => api.get('/users/profile').then(r => r.data),
  updateProfile: (data) => api.put('/users/profile', data).then(r => r.data),
  changePassword: (newPassword) => api.post('/users/change-password', { newPassword }).then(r => r.data),
  getDashboard: () => api.get('/users/dashboard').then(r => r.data),
}

export const investmentApi = {
  getPlans: () => api.get('/investments/plans').then(r => r.data),
  getPlan: (id) => api.get(`/investments/plans/${id}`).then(r => r.data),
  invest: (data) => api.post('/investments/invest', data).then(r => r.data),
  getActive: () => api.get('/investments/active').then(r => r.data),
  getHistory: () => api.get('/investments/history').then(r => r.data),
}

export const walletApi = {
  getWallet: () => api.get('/wallet').then(r => r.data),
  getTransactions: (page = 1, limit = 20) => api.get(`/wallet/transactions?page=${page}&limit=${limit}`).then(r => r.data),
}

export const depositApi = {
  getMethods: () => api.get('/deposits/methods').then(r => r.data),
  create: (data) => api.post('/deposits', data).then(r => r.data),
  getAll: () => api.get('/deposits').then(r => r.data),
}

export const withdrawalApi = {
  getMethods: () => api.get('/withdrawals/methods').then(r => r.data),
  create: (data) => api.post('/withdrawals', data).then(r => r.data),
  getAll: () => api.get('/withdrawals').then(r => r.data),
}

export const marketApi = {
  getAll: () => api.get('/markets').then(r => r.data),
  getOne: (id) => api.get(`/markets/${id}`).then(r => r.data),
}

export const referralApi = {
  getAll: () => api.get('/referrals').then(r => r.data),
}

export const announcementApi = {
  getAll: () => api.get('/announcements').then(r => r.data),
}

export const adminApi = {
  setupAdmin: (email, secret) => api.post('/admin/setup-admin', { email, secret }).then(r => r.data),
  devPromote: () => api.post('/admin/dev-promote').then(r => r.data),
  getDashboard: () => api.get('/admin/dashboard').then(r => r.data),
  getUsers: () => api.get('/admin/users').then(r => r.data),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
  getPlans: () => api.get('/admin/investment-plans').then(r => r.data),
  createPlan: (data) => api.post('/admin/investment-plans', data).then(r => r.data),
  updatePlan: (id, data) => api.put(`/admin/investment-plans/${id}`, data).then(r => r.data),
  deletePlan: (id) => api.delete(`/admin/investment-plans/${id}`).then(r => r.data),
  getDeposits: () => api.get('/admin/deposits').then(r => r.data),
  approveDeposit: (id) => api.put(`/admin/deposits/${id}/approve`).then(r => r.data),
  getWithdrawals: () => api.get('/admin/withdrawals').then(r => r.data),
  approveWithdrawal: (id) => api.put(`/admin/withdrawals/${id}/approve`).then(r => r.data),
  rejectWithdrawal: (id) => api.put(`/admin/withdrawals/${id}/reject`).then(r => r.data),
  getCoins: () => api.get('/admin/coins').then(r => r.data),
  createCoin: (data) => api.post('/admin/coins', data).then(r => r.data),
  updateCoin: (id, data) => api.put(`/admin/coins/${id}`, data).then(r => r.data),
  getAnnouncements: () => api.get('/admin/announcements').then(r => r.data),
  createAnnouncement: (data) => api.post('/admin/announcements', data).then(r => r.data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`).then(r => r.data),
  getTransactions: (page = 1, limit = 20) => api.get(`/admin/transactions?page=${page}&limit=${limit}`).then(r => r.data),
  getReferrals: () => api.get('/admin/referrals').then(r => r.data),
  getSettings: () => api.get('/admin/settings').then(r => r.data),
  updateSettings: (data) => api.put('/admin/settings', data).then(r => r.data),
}
