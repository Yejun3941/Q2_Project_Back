const express = require("express");

// 에러 처리 미들웨어 함수
const errorMiddleware = (err, req, res, next) => {
  // 에러 로그 기록
  console.error(err.stack);

  // 클라이언트에 에러 메시지와 상태 코드 반환
  res.status(err.status || 500).json({
    success: false,
    message: err.message || `서버 에러가 발생했습니다.`,
  });
};

module.exports = errorMiddleware;
