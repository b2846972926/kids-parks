const tagModel = require("../models/tagModel");

const getHotTags = async (req, res) => {
  try {
    const result = await tagModel.getHotTags();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "取得熱門標籤失敗" });
  }
};

module.exports = {
  getHotTags,
};
