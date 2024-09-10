const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// 모든 스팟 가져오기
router.get("/", locationController.getAllLocations);

module.exports = router;