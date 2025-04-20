import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useParkStore = defineStore('park', () => {
  const parkPageData = ref({})

  const getParkData = async (filterSearch = null, number = 1) => {
    const payload = {
      parkName: null,
      keyword: filterSearch,
      addressArea: [''],
      parkThemes: [],
      withSunToilet: false,
      WithPlayset: false,
      WithParkingLot: false,
      pageNumber: number,
      pageSize: 12,
    }
    const res = await axios.post('http://localhost:3000/api/parks', payload)
    parkPageData.value = res.data
  }

  const parkInfo = ref({})
  const getParkDetail = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/parks/${id}`)
    parkInfo.value = res.data.data
    console.log(parkInfo.value)
  }
  const hotTags = ref([])
  const getHotTags = async () => {
    const res = await axios.get('http://localhost:3000/api/tags/hot')
    console.log(res)
    hotTags.value = res.data
  }
  getParkData()
  getHotTags()

  return {
    parkPageData,
    parkInfo,
    hotTags,
    getParkData,
    getParkDetail,
    getHotTags,
  }
})
