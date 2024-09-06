const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 모든 유저 가져오기
// router.get("/", userController.getAllUsers);

// 특정 유저 가져오기 (ID로 조회)
router.get("/:id", userController.getUserById);

// 새 유저 생성하기
// router.post("/", userController.createUser);

// 유저 업데이트하기 (ID로 조회)
router.put("/:id", userController.updateUser);

// 유저 삭제하기 (ID로 조회)
router.delete("/:id", userController.deleteUser);

module.exports = router;
