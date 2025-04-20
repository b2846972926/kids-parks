const parkModel = require("../models/parkModel");

const handleQueryParks = async (req, res) => {
  try {
    const payload = req.body;
    const finalResult = await parkModel.queryParks(payload);
    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ error: "請求失敗" });
  }
};

const handleGetParkInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await parkModel.getParkInfo(id);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "政府 API 請求失敗" });
  }
};

module.exports = {
  handleQueryParks,
  handleGetParkInfo,
};
