const express = require("express");
const router = express.Router();
const Path = require("path");
const authRoutes = require("./authRoutes"); // authRoutes.js를 불러옴
const courseRoutes = require("./courseRoutes");
const spotRoutes = require("./spotRoutes");
const commentRoutes = require("./courseCommentRoutes");
const user = require("./userRoutes");
const link = require("./linkRoutes");
const location = require("./locationRoutes")

router.use("/auth", authRoutes); // /auth 경로에서 authRoutes 사용

router.use("/course-api", courseRoutes);

router.use("/spot-api", spotRoutes);

router.use("/comment-api", commentRoutes);

router.use("/user-api", user);

router.use("/link-api", link);

router.use("/location-api", location);

router.get("*", (req, res) => {
  res.sendFile(Path.join(__dirname, "../../build", "index.html"));
});

module.exports = router;
