const { Spot, Location } = require("../models"); // Spot 모델 불러오기. spot 단일 모델만 사용하는 경우여서, 따로 db 객체를 불러오지 않았음
const { decode2queryData } = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 스팟 가져오기
// GET /spot-api?data={category="카페"&location=1}
// 스팟 가져오는 방식 : 전체 / 구역별 / 카테고리별 /
exports.getAllSpots = async (req, res) => {
  try {
    // 쿼리 스트링에서 'data' 값을 디코딩
    const { page, pageSize, category, location } = decode2queryData(
      req.query.data
    );

    // 조회 조건 설정
    const whereCondition = {}; // 조회 조건을 담을 객체 생성

    if (category) {
      whereCondition.category = category; // 카테고리 필터 추가
    }
    if (location) {
      whereCondition.F_Spot_Location = location; // 위치 필터 추가
    }

    // 총 스팟 수 계산
    const totalSpot = await Spot.count({
      where: { ...whereCondition },
    });

    // 스팟 데이터 조회
    const spots = await Spot.findAll({
      where: { ...whereCondition },
      include: [
        {
          model: Location,
          as: "Location",
          attributes: ["name"],
        },
      ],
      limit: pageSize ? parseInt(pageSize) : 15,
      offset: page ? parseInt(page - 1) * parseInt(pageSize) : 0,
    });

    // 이 부분에서 콘솔로그
    console.log(spots);

    // 조회된 스팟 데이터에 인코딩 작업 추가
    const modifiedSpots = spots.map((spot) => {
      const spotData = spot.get();
      console.log(spotData); // 변환된 데이터 확인
      return {
        ...spotData,
        // id: spotData.id,
        // F_Spot_Location: spotData.F_Spot_Location,
      };
    });

    res.json({ spots: modifiedSpots, total: totalSpot }); // 조회된 스팟들과 총 스팟 수를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spots" }); // 에러 처리
  }
};

// 특정 스팟 가져오기 (ID로 조회)
// GET /spots/:id
exports.getSpotById = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 스팟 ID 추출
  try {
    const modifiedId = id;
    const spot = await Spot.findByPk(modifiedId); // 주어진 ID로 스팟 조회
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" }); // 스팟이 없을 경우 404 상태 코드 반환
    }

    const modeifiedSpot = {
      ...spot.get(),
      // id: spot.id,
      // F_Spot_Location: spot.F_Spot_Location,
    };
    res.json(modeifiedSpot); // 조회된 스팟을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spot" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 새 스팟 생성하기
// POST /spots
exports.createSpot = async (req, res) => {
  const { Lat, Lng, Spot_Name, F_Spot_Location, Category, Photo } = req.body; // 요청 바디에서 필요한 데이터 추출
  try {
    // F_Spot_Location = F_Spot_Location;
    const newSpot = await Spot.create({
      Lat,
      Lng,
      Spot_Name,
      F_Spot_Location,
      Category,
      Photo,
    }); // 새로운 스팟을 데이터베이스에 생성

    const modifiedSpot = {
      ...newSpot.get(),
      // id: fermatIncode(newSpot.id),
      // F_Spot_Location: fermatIncode(newSpot.F_Spot_Location),
    };
    res.status(201).json(modifiedSpot); // 생성된 스팟을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to create spot" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 기존 스팟 업데이트하기 (ID로 조회)
// PUT /spots/:id
exports.updateSpot = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 스팟 ID 추출
  const { Lat, Lng, Spot_Name, F_Spot_Location, Category, Photo } = req.body; // 요청 바디에서 업데이트할 데이터 추출
  try {
    const modifiedId = id;
    // F_Spot_Location = fermatDecode(F_Spot_Location); // User 는 변경이 없음

    const spot = await Spot.findByPk(modifiedId); // 주어진 ID로 스팟 조회
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" }); // 스팟이 없을 경우 404 상태 코드 반환
    }

    // 새로운 값이 제공되었을 때만 업데이트, 그렇지 않으면 기존 값을 유지
    spot.Lat = Lat || spot.Lat;
    spot.Lng = Lng || spot.Lng;
    spot.Spot_Name = Spot_Name || spot.Spot_Name;
    spot.F_Spot_Location = F_Spot_Location || spot.F_Spot_Location;
    spot.Category = Category || spot.Category;
    spot.Photo = Photo || spot.Photo;

    await spot.save(); // 변경된 내용을 데이터베이스에 저장

    const modifiedSpot = {
      ...spot.get(),
      // id: fermatIncode(spot.id),
      // F_Spot_Location: fermatIncode(spot.F_Spot_Location),
    };
    res.json(modifiedSpot); // 업데이트된 스팟을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to update spot" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 스팟 삭제하기 (ID로 조회)
// DELETE /spots/:id
exports.deleteSpot = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 스팟 ID 추출
  try {
    const modifiedId = id;
    const spot = await Spot.findByPk(modifiedId); // 주어진 ID로 스팟 조회
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" }); // 스팟이 없을 경우 404 상태 코드 반환
    }

    await spot.destroy(); // 해당 스팟을 데이터베이스에서 삭제
    res.json({ message: "Spot deleted successfully" }); // 삭제 완료 메시지 반환
  } catch (err) {
    res.status(500).json({ error: "Failed to delete spot" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};
