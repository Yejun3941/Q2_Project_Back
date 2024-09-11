const { where, or } = require("sequelize");
const { Course, User, Location, Spot } = require("../models"); // 필요한 모델 불러오기
const db = require("../models"); // 전체 db 객체를 가져와 사용할 수 있음
const {
  decode2queryData,
  fermatDecode,
  fermatIncode,
} = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 코스 가져오기
// GET /course?data={sortBy=starPoint&loc=1&user=1&limit=5&offset=0}
exports.getAllCourses = async (req, res) => {
  try {
    const { sortBy, location, user, direction, limit, offset } =
      decode2queryData(req.query.data); // URL 쿼리에서 정렬 정보 추출

    const orderCondition = []; // 정렬 조건을 담을 객체 생성
    direction ? (direction = direction) : (direction = "ASC"); // 정렬 방향이 없을 경우 기본값 설정

    sortBy ? orderCondition.push([sortBy, direction]) : null; // 정렬 정보가 있을 경우 정렬
    const whereCondition = {}; // 조회 조건을 담을 객체 생성
    location
      ? (whereCondition.F_Course_Location = fermatDecode(location))
      : null; // 구역 정보가 있을 경우 조회 조건에 추가
    user ? (whereCondition.F_User_id = fermatDecode(user)) : null; // 유저 정보가 있을 경우 조회 조건에 추가

    const totalCourse = await Course.count({
      where: {
        ...whereCondition,
      },
    });

    const courses = await Course.findAll({
      where: {
        ...whereCondition,
      }, // 조회 조건이 있을 경우 조회 조건 추가
      order: orderCondition, // 정렬 조건이 있을 경우 정렬
      include: [
        { model: User, as: "Writer", attributes: ["nickname"] },
        { model: Location, as: "Location", attributes: ["name"] },
      ],
      limit: limit ? parseInt(limit) : 5, // 조회 개수를 설정할 수 있음
      offset: offset ? parseInt(offset) : 0, // 조회 시작 위치를 설정할 수 있음
    });
    // ***********************************************************
    // include 로 조인된 결과 조회 해서 id 혹시나 불러오는게 있는지 확인 필요**
    // console.log(courses);
    // ***********************************************************
    const modifiedCourses = courses.map((course) => ({
      ...course.get(),
      id: fermatIncode(course.id),
      F_User_id: fermatIncode(course.F_User_id),
      F_Course_Location: fermatIncode(course.F_Course_Location),
      nickname: course.Writer.nickname,
      location: course.Location.name,
      total: totalCourse,
    }));

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// 특정 코스 가져오기 (ID로 조회)
// GET /courses/:id
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const modifiedid = fermatDecode(id);
    const course = await Course.findByPk(modifiedid, {
      include: [
        { model: User, as: "Writer", attributes: ["nickname"] },
        { model: Location, as: "Location", attributes: ["name"] },
      ],
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const modifiedCourse = {
      ...course.get(),
      id: fermatIncode(course.id),
      F_User_id: fermatIncode(course.F_User_id),
      F_Course_Location: fermatIncode(course.F_Course_Location),
      nickname: course.Writer.nickname,
      location: course.Location.name,
    };

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// POST /course
exports.createCourse = async (req, res) => {
  const { F_User_id, Course_title, Course_content, F_Course_Location } =
    req.body;
  try {
    F_User_id = fermatDecode(F_User_id);
    F_Course_Location = fermatDecode(F_Course_Location);

    const newCourse = await Course.create({
      F_User_id,
      Course_title,
      Course_content,
      F_Course_Location,
      meanStartPoint: 0, // 초기 평점
      countStarPoint: 0, // 초기 댓글 갯수
      createAt: new Date(), // 현재 시간
    });
    const modifiedCourse = {
      ...newCourse.get(),
      id: fermatIncode(newCourse.id),
      F_User_id: fermatIncode(newCourse.F_User_id),
      F_Course_Location: fermatIncode(newCourse.F_Course_Location),
    };
    res.status(201).json(modifiedCourse);
  } catch (err) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

// UPDATE /course/:id
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    Course_title,
    Course_content,
    F_Course_Location,
    meanStartPoint,
    countStarPoint,
  } = req.body;
  try {
    const modifiedid = fermatDecode(id);
    F_Course_Location = fermatDecode(F_Course_Location); // User 는 변경이 없음

    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.Course_title = Course_title || course.Course_title;
    course.Course_content = Course_content || course.Course_content;
    course.F_Course_Location = F_Course_Location || course.F_Course_Location;
    course.meanStartPoint =
      meanStartPoint !== undefined ? meanStartPoint : course.meanStartPoint;
    course.countStarPoint =
      countStarPoint !== undefined ? countStarPoint : course.countStarPoint;

    await course.save();

    const modifiedCourse = {
      ...course.get(),
      id: fermatIncode(course.id),
      F_User_id: fermatIncode(course.F_User_id),
      F_Course_Location: fermatIncode(course.F_Course_Location),
    };

    res.json(modifiedCourse);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" });
  }
};

// DELETE /course/:id
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const modifiedid = fermatDecode(id);
    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
};
