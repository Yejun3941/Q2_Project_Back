const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");

const passportConfig = require("./passport");
const routes = require("./routes/");
const { sequelize } = require("./models");

// AWS.config.update({ region: "ap-northeast-2" });
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
// const BUCKET_NAME = "team04-tmdedu-bucket";

// const params = {
//   Bucket: BUCKET_NAME,
//   Key: "build/",
// };

// s3.getObject(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else console.log(data.Body.toString("utf-8"));
// });

dotenv.config(); // dotenv 설정

const app = express();
app.set("port", process.env.PORT || 3001);

// 패스포트 설정 초기화
passportConfig();

// 데이터베이스 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// 미들웨어 설정
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

// 패스포트 미들웨어
app.use(passport.initialize());
app.use(passport.session());

// CORS 설정
app.use(cors({ origin: `${process.env.FRONTEND}` }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../build")));

// 라우터 연결
app.use("/", routes);

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.redirect(`${process.env.FRONTEND}`);
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
