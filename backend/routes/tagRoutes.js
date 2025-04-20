const express = require("express");

const router = express.Router();

const tagController = require("../controllers/tagController");

router.get("/hot", tagController.getHotTags);

module.exports = router;
