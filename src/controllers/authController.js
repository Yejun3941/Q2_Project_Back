const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models");
const { check } = require("express-validator");
const { Session } = require("express-session");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { fermatIncode, fermatDecode } = require("../services/decodingService");

exports.join = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  console.log("authController");
  console.log(nickname);
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickname,
      password: hash,
    });
    return res.redirect(`${process.env.FRONTEND}`);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("naver", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // return res.redirect("localhost");
      return res.redirect(`${process.env.FRONTEND}`);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

// exports.logout = (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error(err);
//       return next(err); // 에러가 발생하면 이를 처리할 수 있도록 합니다.
//     }
//     console.log("Before destroying session:", req.session);
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err);
//         return next(err);
//       }
//       console.log("Session destroyed");
//       res.clearCookie("connect.sid", {
//         httpOnly: true,
//         secure: false,
//         maxAge: now(),
//       }); // 세션 쿠키 삭제
//       res.redirect("/"); // 로그아웃 후 리다이렉트
//       console.log("Logging out...");
//     });
//   });
// };

exports.sessionCheckController = (req, res) => {
  console.log(">>>Session ID : ", req.sessionID);
  console.log(">>>>Session Data:", req.session);
  console.log(">>>>Authenticated", req.isAuthenticated());
  const { id, email, nickname } = req.user.dataValues;
  const userData = { id: id, email: email, nickname: nickname };
  if (req.isAuthenticated()) {
    res.json({ isLoggedIn: true, user: userData });
  } else {
    res.json({ isLoggedIn: false, user: null });
  }
};