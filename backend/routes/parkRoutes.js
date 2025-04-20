const express = require("express");

const router = express.Router();

const parkController = require("../controllers/parkController");

router.post("/", parkController.handleQueryParks);
router.get("/:id", parkController.handleGetParkInfo);

module.exports = router;
