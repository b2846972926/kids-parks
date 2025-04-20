<template>
  <div class="filter-area">
    <div class="filter">
      <el-input
        v-model="filterSearch"
        style="max-width: 500px"
        placeholder="輸入你想找的公園關鍵字"
      >
        <template #append
          ><el-button :icon="Search" @click="parkStore.getParkData(filterSearch)"
        /></template>
      </el-input>
    </div>
    <div class="hotTags">
      全站熱門標籤
      <el-tag
        v-for="item in parkStore.hotTags"
        :key="item.tag"
        type="primary"
        effect="plain"
        class="mgl"
      >
        {{ item.tag }}
      </el-tag>
    </div>
  </div>

  <!-- 每個公園圖片連結 -->
  <div class="park-card">
    <RouterLink
      :to="`/parkintro/${park.parkId}`"
      class="park-card-item"
      v-for="park in parkStore.parkPageData.pageData"
      :key="park.parkId"
    >
      <div class="img-container">
        <div class="rating">
          <span>{{ park.avgRating }} </span
          ><el-rate
            v-model="park.avgRating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            class="mgl"
          />
          <span>({{ park.commentCount }})</span>
        </div>
        <img :src="park.coverPicturePath" :alt="park.name" />
        <div class="text-overlay">
          <div class="park-name">{{ park.name }}</div>
          <div>{{ park.addressArea }}</div>
        </div>
      </div>
      <div class="park-card-item-tag">
        <span>熱門標籤:</span>
        <el-tag v-for="item in park.topTags" :key="item" type="success" effect="dark" class="mgl">
          {{ item }}
        </el-tag>
      </div>
    </RouterLink>
  </div>
  <div class="example-pagination-block">
    <el-pagination
      layout="prev,pager,next"
      :total="parkStore.parkPageData.dataSum"
      v-model:page-size="parkStore.parkPageData.pageSize"
      v-model:current-page="currentPage"
      v-if="parkStore.parkPageData.pageSize"
    />
  </div>
</template>

<script setup>
import { useParkStore } from '@/stores/parkStore'
import { ref, watch } from 'vue'
import { ElLoading } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const parkStore = useParkStore()
//分頁
const currentPage = ref(1)
const filterSearch = ref('')

watch(currentPage, async (newPage) => {
  console.log(newPage)
  const loading = ElLoading.service({
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const res = await parkStore.getParkData(filterSearch.value, newPage)
    console.log(res, newPage)
  } catch (error) {
    console.error('取得資料失敗:', error)
  } finally {
    loading.close()
  }
})
</script>

<style scoped>
.rating {
  display: flex;
  align-items: center;
}
.rating span {
  color: black;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.filter-area {
  margin: 20px 30px;
  background-color: rgb(254, 240, 244);
  height: 100px;
  display: flex;
  align-items: center;
  border-radius: 10px;
}
.filter {
  margin-left: 20px;
  flex: 1;
}
.hotTags {
  margin-right: 20px;
  margin-left: auto;
}
.park-card {
  display: flex;
  margin: 30px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  background-color: #caf9b3;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.park-card-item {
  margin: 10px;
  padding: 20px;
  width: 400px;
  height: 350px;
  text-decoration: none;
  background-color: rgb(245, 204, 157);
}
.img-container {
  position: relative;
  width: 100%;
}
.img-container img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.text-overlay {
  position: absolute;
  bottom: 0px;
  left: 0px;
  color: white;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
}
.park-card-item-tag {
  display: flex;
  align-items: center;
}
.park-name {
  font-weight: bold;
  font-size: 26px;
}

.example-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mgl {
  margin-left: 5px;
}
</style>
