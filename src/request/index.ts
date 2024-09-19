import axios from 'axios'
import router from '@/router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = 'Bearer ' + userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (res) => {
    const userStore = useUserStore()
    const { code } = res.data
    if (code !== 0) {
      message.error(res.data.msg)
      if (code === 401) {
        userStore.$reset()
        router.push('/login')
        return Promise.reject(res)
      }
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    message.error(error.message)
    return Promise.reject(error)
  }
)

export default request
