<template>
  <div class="container">
    <div class="login">
      <h2 class="title">會員登入</h2>
      <el-input v-model="account" style="width: 100%" placeholder="請輸入帳號" />
      <el-input
        v-model="password"
        style="width: 100%"
        type="password"
        placeholder="請輸入密碼"
        show-password
      />
      <div class="btn">
        <el-button type="primary" @click="login" plain> 登入 </el-button>
        <el-button type="primary" plain @click="isRegister = true"> 立即註冊 </el-button>
        <el-dialog v-model="isRegister" title="註冊會員" width="400">
          <el-form :model="form">
            <el-form-item>
              <el-input v-model="form.username" autocomplete="off" placeholder="請輸入帳號" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" autocomplete="off" placeholder="請輸入密碼" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="isRegister = false">取消</el-button>
              <el-button type="primary" @click="confirmRegister"> 確認註冊 </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const account = ref('')
const password = ref('')

const isRegister = ref(false)
const form = ref({
  username: '',
  password: '',
})

const userStroe = useUserStore()
const login = async () => {
  const res = await userStroe.userLogin(account.value, password.value)
  router.replace('/')
}
onMounted(() => {
  if (userStroe.userInfo.token) {
    router.replace('/')
  }
})

const confirmRegister = async () => {
  const res = await axios.post('http://localhost:3000/api/users/register', {
    username: form.value.username,
    password: form.value.password,
  })
  console.log(res)
  isRegister.value = false
  alert(res.data.message)
}
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
}
.login {
  width: 320px;
  padding: 32px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  text-align: center;
  margin-bottom: 8px;
}
</style>
