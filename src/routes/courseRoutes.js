const express = require("express");
const multer = require("multer");
const router = express.Router();
const courseController = require("../controllers/courseController");

const imageUpload = multer();

// 모든 코스 가져오기
router.get("/", courseController.getAllCourses);

// 특정 코스 가져오기 (ID로 조회)
router.get("/:id", courseController.getCourseById);

// 새 코스 생성하기
router.post("/", courseController.createCourse);

// image uplodad
router.post(
  "/image",
  imageUpload.array("files"),
  courseController.uploadImage
);

// 코스 업데이트하기 (ID로 조회)
router.put("/:id", courseController.updateCourse);

// 코스 삭제하기 (ID로 조회)
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
