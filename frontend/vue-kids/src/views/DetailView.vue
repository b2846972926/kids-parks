<template>
  <div class="park-detail">
    <!-- 圖片輪播區 -->
    <div class="banner">
      <el-carousel height="500px">
        <el-carousel-item v-for="item in parkStore.parkInfo.pictures" :key="item.filePath">
          <img :src="item.filePath" alt="公園圖片" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 基本資料區塊 -->
    <div class="park-info">
      <div class="park-header">
        <h2>{{ parkStore.parkInfo.name }}</h2>
        <p>{{ parkStore.parkInfo.addressArea }}</p>
      </div>

      <div class="info-item">
        <strong>地址：</strong>
        <span>{{ parkStore.parkInfo.address }}</span>
      </div>
      <div class="info-item">
        <strong>開放時間：</strong>
        <span>{{ parkStore.parkInfo.openTime }}</span>
      </div>
      <div class="info-item">
        <strong>公園規模：</strong>
        <span>{{ parkStore.parkInfo.parkScale }}</span>
      </div>
    </div>

    <!-- 公園描述 -->
    <div class="park-description">
      <h3>公園介紹</h3>
      <p>{{ parkStore.parkInfo.parkDescription }}</p>
    </div>

    <div class="comment-section">
      <h3>心得分享</h3>
      <template v-if="userStore.userInfo.token">
        <!-- 評分星星 -->
        <div class="demo-rate-block">
          <el-rate v-model="rating" />
        </div>
        <el-input-tag
          v-model="tags"
          :max="3"
          placeholder="為這個公園加上標籤"
          class="mgt"
          style="width: 600px"
        />
        <!-- 留言輸入框 -->
        <el-input
          v-model="commentText"
          style="width: 100%"
          :rows="4"
          type="textarea"
          placeholder="分享你對這個公園的心得吧！"
          resize="none"
          class="mgt"
        />

        <!-- 提交按鈕 -->
        <el-button type="primary" plain @click="submitComment" class="mgt">送出留言</el-button>
      </template>
      <el-button type="info" plain v-else @click="$router.push('/login')">留言請登入</el-button>
      <!-- 留言列表 -->
      <div class="comment-list">
        <div comment-filter>
          <el-button type="info" plain @click="getComments('latest')">由近到遠</el-button>
          <el-button type="info" plain @click="getComments('highest')">由高到低</el-button>
          <el-button type="info" plain @click="getComments('lowest')">由低到高</el-button>
        </div>

        <div class="comment-item" v-for="(comment, index) in comments" :key="index">
          <div class="comment-item-top">
            <el-icon><UserFilled /></el-icon
            ><el-text class="mx-1 comment-name">{{ comment.nickname }}</el-text>
            <el-tag v-for="item in comment.tags" :key="item" type="success" effect="light" round>
              {{ item }}
            </el-tag>
            <el-text class="mx-1 comment-date">{{
              new Date(comment.created_at).toLocaleString()
            }}</el-text>
          </div>

          <div class="comment-rating mgt">
            <el-rate v-model="comment.rating" disabled text-color="#ff9900" />
          </div>
          <div class="comment-bottom">
            <p class="comment-text">{{ comment.comment }}</p>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="deleteComment(comment.id)"
              v-if="userStore.userInfo.user?.username === 'admin'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="goback">
    <el-button type="warning" round @click="$router.push('/')">回到公園列表</el-button>
  </div>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParkStore } from '@/stores/parkStore'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import { UserFilled } from '@element-plus/icons-vue'
import http from '@/utils/http'
const route = useRoute()
const parkStore = useParkStore()
const router = useRouter()
// 取得公園資料
const getParkInfo = () => {
  const id = route.params.id
  parkStore.getParkDetail(id)
}
onMounted(() => {
  getParkInfo() // 頁面加載後獲取公園資料
})

//留言區
const rating = ref(0)
const commentText = ref('')
const comments = ref([])

const submitComment = async () => {
  if (!commentText.value || rating.value === 0) {
    alert('請輸入留言並評分')
    return
  }

  const res = await http.post('/api/comments', {
    nickname: userStore.userInfo.user.username,
    text: commentText.value,
    rating: rating.value,
    parkId: route.params.id,
    tags: tags.value,
  })
  console.log(res)
  // 清空
  commentText.value = ''
  rating.value = 0
  tags.value = []
  getComments()
}

//取得評論
const getComments = async (sortBy) => {
  const id = route.params.id
  const res = await axios.get(`http://localhost:3000/api/comments/${id}`, { params: { sortBy } })
  comments.value = res.data
  console.log(comments.value)
}

onMounted(() => {
  getComments()
})

//標籤

const tags = ref([])

const userStore = useUserStore()

import { Delete } from '@element-plus/icons-vue'
const deleteComment = async (commentId) => {
  try {
    const res = await http.delete(`http://localhost:3000/api/comments/${commentId}`)
    console.log(res)
    getComments()
  } catch (err) {
    console.log(err)
    router.push('/login')
    userStore.clearUser()
  }
}
</script>

<style scoped>
/* 整體頁面設計 */
.park-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 輪播圖樣式 */
.banner {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-carousel__item img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.el-carousel__item img:hover {
  transform: scale(1.05);
}

/* 公園標題和區域 */
.park-header {
  margin-bottom: 20px;
  text-align: center;
}

.park-header h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.park-header p {
  font-size: 1.2rem;
  color: #777;
}

/* 公園資訊區 */
.park-info {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  font-size: 1.2rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.info-item strong {
  color: #007bff;
  font-weight: 600;
}

.info-item span {
  color: #495057;
}

/* 公園描述區 */
.park-description {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.park-description h3 {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.park-description p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

/* 留言區 */
.comment-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff7f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-section h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

/* 留言列表 */

.comment-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  background-color: #fdfdfd;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.comment-item-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.comment-name {
  font-size: 1.3rem;
  color: #6a2020;
  font-weight: bold;
}
.comment-date {
  margin-left: auto;
}
.comment-text {
  font-size: 1rem;
  color: #807e7e;
}
.comment-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mgt {
  margin-top: 15px;
}
.goback {
  text-align: center;
}
</style>
