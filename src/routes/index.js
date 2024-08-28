const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes"); // authRoutes.js를 불러옴

router.use("/auth", authRoutes); // /auth 경로에서 authRoutes 사용

module.exports = router;
