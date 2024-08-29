const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;

const { User } = require("../models");
console.log("User model:", User); // User 모델이 제대로 정의되었는지 확인

if (!User) {
  throw new Error("User 모델이 정의되지 않았습니다.");
}

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND}/auth/naver/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("naver profile", profile);
        console.log("naver nickname", profile.displayName);
        try {
          const exUser = await User.findOne({
            where: { email: profile.emails[0].value, provider: "naver" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile.emails[0].value,
              nickname: profile.displayName,
              provider: "naver",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
