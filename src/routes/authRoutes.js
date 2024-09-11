const express = require("express");
const router = express.Router();
const passport = require("passport");
const { join, login, logout, sessionCheckController } = require("../controllers/authController");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/authMiddleware");
// const {
//   isLoggedIn,
//   isNotLoggedIn,
//   setLocals,
// } = require("../middlewares/authMiddleware");
// 미들웨어: 로그인 상태에 따라 로컬 변수 설정
// router.use(setLocals);

// 회원가입 라우트
router.post("/join", isNotLoggedIn, join);

// 로그인 라우트
router.post("/login", isNotLoggedIn, login);

// // 로그아웃 라우트
// router.get("/logout", isLoggedIn, logout);

// 카카오 로그인 라우트
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    failureRedirect: "/?loginError=카카오로그인 실패",
  })
);

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?loginError=카카오로그인 실패",
  }),
  (req, res) => {
    res.redirect(`${process.env.BACKEND}/course`); // 성공 시에는 로컬로 이동
  }
);

// 네이버 로그인 라우트 및 콜백
router.get("/naver", passport.authenticate("naver"));

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/?loginError=네이버로그인 실패",
  }),
  (req, res) => {
    console.log(`${process.env.BACKEND}/course`);
    // res.redirect(`${process.env.FRONTEND}`); // 성공 시에는 /로 이동
    res.redirect(`${process.env.BACKEND}/course`); // 성공 시에는 /로 이동
  }
);

router.get("/session-check", sessionCheckController);


module.exports = router;
