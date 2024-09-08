const express = require("express");
const router = express.Router();
const spotController = require("../controllers/linkController");

// 모든 스팟 가져오기
router.get("/", spotController.getAllSpots);

// 특정 스팟 가져오기 (ID로 조회)
router.get("/:id", spotController.getSpotById);

// 새 스팟 생성하기
router.post("/", spotController.createSpot);

// 스팟 업데이트하기 (ID로 조회)
router.put("/:id", spotController.updateSpot);

// 스팟 삭제하기 (ID로 조회)
router.delete("/:id", spotController.deleteSpot);

module.exports = router;
