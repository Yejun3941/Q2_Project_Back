const express = require("express");
const router = express.Router();
const courseCommentController = require("../controllers/courseCommentController");

// 모든 코멘트 가져오기
router.get("/", courseCommentController.getAllComments);

// 특정 코멘트 가져오기 (ID로 조회)
router.get("/:id", courseCommentController.getCommentById);

// 새 코멘트 생성하기
router.post("/", courseCommentController.createComment);

// 코멘트 업데이트하기 (ID로 조회)
router.put("/:id", courseCommentController.updateComment);

// 코멘트 삭제하기 (ID로 조회)
router.delete("/:id", courseCommentController.deleteComment);

module.exports = router;
