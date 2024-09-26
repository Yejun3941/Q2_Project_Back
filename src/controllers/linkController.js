const { Link, Spot, Course } = require("../models"); // 필요한 모델 불러오기
const db = require("../models"); // 전체 db 객체를 가져와 사용할 수 있음
const { decode2queryData } = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 링크 가져오기
// GET /link?data={course=1&spot=1}
// 링크 가져오는 방식 : F_Course_id / F_Spot_id (둘 중 하나만 가능)
exports.getAllLinks = async (req, res) => {
  try {
    const { course, spot } = decode2queryData(req.query.data); // URL 쿼리에서 카테고리와 구역 정보 추출

    const whereCondition = {}; // 조회 조건을 담을 객체 생성
    course ? (whereCondition.course = course) : null; // 코스 아이디 있을 경우 조회 조건에 추가
    spot ? (whereCondition.spot = spot) : null; // 스팟 아이디 있을 경우 조회 조건에 추가
    const links = await Link.findAll({
      where: {
        ...whereCondition,
      },
      include: [
        { model: Spot, as: "Spots", attributes: ["Spot_name"] },
        {
          model: Course,
          as: "Courses",
          attributes: ["Course_title", "meanStarPoint"],
        },
      ],
    });
    const modifiedLinks = links.map((link) => ({
      ...link.get(),
      // id: fermatIncode(link.id),
      // course: fermatIncode(link.course),
      // spot: fermatIncode(link.spot),
      spot_name: link.Spots.Spot_name,
      course_title: link.Courses.Course_title,
      meanStarPoint: link.Courses.meanStarPoint,
    }));

    res.json(modifiedLinks); // 조회된 링크들을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 새 링크 생성하기
// POST /link

exports.createLink = async (req, res) => {
  const { course, spot } = req.body; // 요청 바디에서 필요한 데이터 추출
  try {
    const newLink = await Link.create({
      // course: fermatDecode(course),
      // spot: fermatDecode(spot),
    }); // 새로운 링크를 데이터베이스에 생성

    const modifiedLink = {
      ...newLink.get(),
      // id: fermatIncode(newLink.id),
      // course: fermatIncode(newLink.course),
      // spot: fermatIncode(newLink.spot),
    };
    res.status(201).json(modifiedLink); // 생성된 링크를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to create link" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 다중 링크 생성하기
// POST /links
exports.createMultipleLinks = async (req, res) => {
  const linksData = req.body.links; // 요청 바디에서 여러 링크 데이터를 추출
  try {
    const decodedLinksData = linksData.map((link) => ({
      // course: fermatDecode(link.course),
      // spot: fermatDecode(link.spot),
    }));

    const newLinks = await Link.bulkCreate(decodedLinksData); // 여러 링크를 데이터베이스에 생성

    const modifiedLinks = newLinks.map((link) => ({
      ...link.get(),
      // id: fermatIncode(link.id),
      // course: fermatIncode(link.course),
      // spot: fermatIncode(link.spot),
    }));

    res.status(201).json(modifiedLinks); // 생성된 링크들을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to create links" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 기존 링크 업데이트하기 (ID로 조회)
// PUT /link/:id
exports.updateLink = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 링크 ID 추출
  const { course, spot } = req.body; // 요청 바디에서 업데이트할 데이터 추출
  try {
    const modifiedId = id;
    const link = await Link.findByPk(modifiedId); // 주어진 ID로 링크 조회
    if (!link) {
      return res.status(404).json({ error: "Link not found" }); // 링크가 없을 경우 404 상태 코드 반환
    }

    // 새로운 값이 제공되었을 때만 업데이트, 그렇지 않으면 기존 값을 유지
    link.course = course ? course : link.course;
    link.spot = spot ? spot : link.spot;

    await link.save(); // 변경된 내용을 데이터베이스에 저장

    const modifiedLink = {
      ...link.get(),
      // id: fermatIncode(link.id),
      // course: fermatIncode(link.course),
      // spot: fermatIncode(link.spot),
    };
    res.json(modifiedLink); // 업데이트된 링크를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to update link" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 링크 삭제하기 (ID로 조회)
// DELETE /link/:id
exports.deleteLink = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 링크 ID 추출
  try {
    const modifiedId = id;
    const link = await Link.findByPk(modifiedId); // 주어진 ID로 링크 조회
    if (!link) {
      return res.status(404).json({ error: "Link not found" }); // 링크가 없을 경우 404 상태 코드 반환
    }

    await link.destroy(); // 해당 링크를 데이터베이스에서 삭제
    res.json({ message: "Link deleted successfully" }); // 삭제 완료 메시지 반환
  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};
