import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/utils/http'

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({})
    const userLogin = async (username, password) => {
      const res = await http.post('/api/users/login', { username, password })
      userInfo.value = res.data
      console.log(userInfo)
      return res.data
    }
    const clearUser = () => {
      userInfo.value = {}
    }
    return {
      userInfo,
      userLogin,
      clearUser,
    }
  },
  {
    persist: true,
  },
)
