const passport = require("passport");
const kakao = require("./kakaoStrategy");
const naver = require("./naverStrategy");
const User = require("../models/User");

module.exports = passport;

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("deserialize");
    User.findOne({
      where: { id },
    })
      .then((user) => {
        console.log("user", user);
        done(null, user);
      })
      .catch((err) => done(err));
  });

  kakao();
  naver();
};
