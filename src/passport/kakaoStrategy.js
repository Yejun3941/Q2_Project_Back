const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND}/auth/kakao/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("kakao profile", profile);
          const exUser = await User.findOne({
            where: {
              email: profile._json?.kakao_account?.email,
              provider: "kakao",
            },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email,
              nickname: profile.displayName,
              provider: "kakao",
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
