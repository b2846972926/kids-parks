import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
})

http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (e) => Promise.reject(e),
)

export default http
