const express = require("express");
const router = express.Router();
const spotController = require("../controllers/spotController");

// 링크 가져오기
router.get("/", linkController.getAllLinks);

// 특정 링크 가져오기 (ID로 조회)
router.get("/:id", linkController.getLinkById);

// 새 링크 생성하기
router.post("/", linkController.createLink);

// 다중 링크 생성하기
router.post("/multiple", linkController.createMultipleLinks);

// 링크 업데이트하기 (ID로 조회)
router.put("/:id", linkController.updateLink);

// 링크 삭제하기 (ID로 조회)
router.delete("/:id", linkController.deleteLink);



module.exports = router;
