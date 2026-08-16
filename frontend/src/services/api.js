import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
})

// attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// optional: normalize errors
api.interceptors.response.use(r=>r, err => {
  if (err.response && err.response.data && err.response.data.error) {
    return Promise.reject(err)
  }
  return Promise.reject(err)
})

export default api
