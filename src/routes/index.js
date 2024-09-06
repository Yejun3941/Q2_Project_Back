const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes"); // authRoutes.js를 불러옴
const courseRoutes = require("./courseRoutes");
const spotRoutes = require("./spotRoutes");
const commentRoutes = require("./courseCommentRoutes");
const user = require("./userRoutes");
const link = require("./linkRoutes");

router.use("/auth", authRoutes); // /auth 경로에서 authRoutes 사용

router.use("/course", courseRoutes);

router.use("/spot", spotRoutes);

router.use("/comment", commentRoutes);

router.use("/user", user);

router.use("/link", link);

module.exports = router;
