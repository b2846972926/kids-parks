const axios = require("axios");
const db = require("../db");
const commentModel = require("./commentModel");

const queryParks = async (payload) => {
  //先從API撈公園資料
  const response = await axios.post(
    "https://taichungmelody.taichung.gov.tw/api/Park/QueryParks",
    payload
  );
  const parks = response.data;
  const parkIds = parks.data.pageData.map((p) => p.parkId);

  //再從資料庫撈資料
  const ratingRows = await commentModel.getAvgRating(parkIds);
  const topTagRows = await commentModel.getTopTags(parkIds);
  const ratingMap = {};
  const commentCountMap = {};
  ratingRows.forEach((r) => {
    ratingMap[r.park_id] = r.average_rating;
    commentCountMap[r.park_id] = r.comment_count;
  });
  const tagMap = {};
  topTagRows.forEach((r) => {
    if (!tagMap[r.park_id]) tagMap[r.park_id] = [];
    if (tagMap[r.park_id].length < 3) {
      tagMap[r.park_id].push(r.tag);
    }
  });

  //合併
  const parkWithTags = parks.data.pageData.map((p) => {
    return {
      ...p,
      avgRating:
        ratingMap[p.parkId] != null ? Number(ratingMap[p.parkId]) : null,
      topTags: tagMap[p.parkId] ?? [],
      commentCount: commentCountMap[p.parkId] ?? 0,
    };
  });

  //最後結果
  const finalResult = {
    dataSum: parks.data.dataSum,
    pageNumber: parks.data.pageNumber,
    pageSize: parks.data.pageSize,
    pageData: parkWithTags,
  };
  return finalResult;
};

const getParkInfo = async (id) => {
  const response = await axios.get(
    `https://taichungmelody.taichung.gov.tw/api/Park/GetParkIntro/${id}`
  );
  return response;
};

module.exports = {
  queryParks,
  getParkInfo,
};
