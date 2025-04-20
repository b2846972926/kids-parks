<template>
  <div class="navbar">
    <div class="navbar-logo">
      <RouterLink to="/"><img src="/4457.jpg" alt="" /> </RouterLink>
      <h1>溜娃就來這</h1>
    </div>
    <div class="login-area">
      <RouterLink to="/login" v-if="!userStore.userInfo.token">會員登入</RouterLink>

      <div class="logout-area" v-else>
        <div class="user">
          <el-icon><UserFilled /></el-icon> {{ userStore.userInfo.user.username }}
        </div>
        <div class="logoutbtn">
          <el-popconfirm
            title="確認登出嗎?"
            @confirm="confirm"
            confirm-button-text="確認"
            cancel-button-text="取消"
          >
            <template #reference>
              <a href="javascript:;">登出</a>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { UserFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const confirm = () => {
  userStore.userInfo = {}
}
</script>

<style scoped>
.navbar {
  background-color: rgb(160, 190, 251);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  height: 66px;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.login-area {
  display: flex;
  align-items: center;
}
.user {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logout-area {
  display: flex;
  align-items: center;
}
a {
  padding: 0 15px;
  color: #4b4b4b;
  line-height: 1;
  display: inline-block;
  text-decoration: none;
}
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 50px;
  margin-left: 10px;
}
.navbar-logo h1 {
  color: rgb(255, 254, 254);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 36px;
}
.navbar img {
  width: 150px;
  height: 50px;
  object-fit: cover;
}
</style>
