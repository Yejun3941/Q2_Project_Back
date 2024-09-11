const { Location } = require("../models"); // Location 모델 불러오기. spot 단일 모델만 사용하는 경우여서, 따로 db 객체를 불러오지 않았음
const {
  decode2queryData,
  fermatIncode,
  fermatDecode,
} = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 location 가져오기
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({}); // 데이터베이스에서 category가 "리액트에서 받은 데이터"인 모든 스팟을 조회
    const modifiedLocations = locations.map((location) => ({
      ...location.get(),
      id: fermatIncode(location.id),
    }));
    res.json(modifiedLocations); // 조회된 스팟들을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spots" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};
