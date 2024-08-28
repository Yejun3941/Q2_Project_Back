// 로그인된 상태인지 확인하는 미들웨어
// 사용자가 인증된 상태인지 확인하고, 인증되지 않은 경우 401 상태 코드를 반환합니다.
exports.isLoggedIn = (req, res, next) => {
  // req.isAuthenticated()는 Passport.js에서 제공하는 함수로, 사용자가 로그인된 상태인지 확인합니다.
  if (req.isAuthenticated()) {
    return next(); // 사용자가 로그인된 상태이면, 다음 미들웨어로 넘어갑니다.
  } else {
    return res.status(401).json({ message: "로그인이 필요합니다." }); // 로그인되지 않은 경우, 401 응답과 함께 에러 메시지를 반환합니다.
  }
};

// 로그인되지 않은 상태인지 확인하는 미들웨어
// 사용자가 인증되지 않은 상태인지 확인하고, 인증된 경우 메인 페이지로 리다이렉트합니다.
exports.isNotLoggedIn = (req, res, next) => {
  // 사용자가 로그인되지 않은 상태인지 확인합니다.
  if (!req.isAuthenticated()) {
    return next(); // 사용자가 로그인되지 않은 상태이면, 다음 미들웨어로 넘어갑니다.
  } else {
    return res.redirect("/"); // 로그인된 상태라면, 메인 페이지로 리다이렉트합니다.
  }
};

// // 로컬 변수 설정 미들웨어
// // 로그인 상태와 관계없이 로컬 변수를 설정하여 뷰에서 사용할 수 있도록 합니다.
// exports.setLocals = (req, res, next) => {
//   // res.locals는 Express.js에서 제공하는 객체로, 뷰에서 사용할 수 있는 전역 변수를 설정하는 데 사용됩니다.
//   res.locals.user = req.user; // 로그인된 사용자 정보를 설정합니다. req.user는 Passport.js가 제공하는 로그인된 사용자 정보입니다.
//   res.locals.followerCount = req.user?.Followers?.length || 0; // 사용자의 팔로워 수를 설정합니다. Followers가 없는 경우 0으로 설정합니다.
//   res.locals.followingCount = req.user?.Followings?.length || 0; // 사용자의 팔로잉 수를 설정합니다. Followings가 없는 경우 0으로 설정합니다.
//   res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || []; // 사용자가 팔로잉하는 사람들의 ID 목록을 설정합니다.

// 로컬 변수 설정 미들웨어
exports.setLocals = (req, res, next) => {
  res.locals.user = req.user || null;

  if (req.user) {
    res.locals.followerCount = req.user.Followers
      ? req.user.Followers.length
      : 0;
    res.locals.followingCount = req.user.Followings
      ? req.user.Followings.length
      : 0;
    res.locals.followingIdList = req.user.Followings
      ? req.user.Followings.map((f) => f.id)
      : [];
  } else {
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
  }

  // 다음 미들웨어로 넘어갑니다.
  next();
};
