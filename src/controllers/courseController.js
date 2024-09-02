const { Course, User, Location } = require("../models"); // 필요한 모델 불러오기
const db = require("../models"); // 전체 db 객체를 가져와 사용할 수 있음

// 모든 코스 가져오기
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: db.User, as: "Writer" },
        { model: db.Location, as: "Location" },
      ],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// 특정 코스 가져오기 (ID로 조회)
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id, {
      include: [
        { model: db.User, as: "Writer" },
        { model: db.Location, as: "Location" },
      ],
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// 새 코스 생성하기
exports.createCourse = async (req, res) => {
  const { F_User_id, Course_title, Course_content, F_Course_Location } =
    req.body;
  try {
    const newCourse = await Course.create({
      F_User_id,
      Course_title,
      Course_content,
      F_Course_Location,
      meanStartPoint: 0, // 초기 평점
      countStarPoint: 0, // 초기 댓글 갯수
      createAt: new Date(), // 현재 시간
    });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

// 코스 업데이트하기 (ID로 조회)
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
    const course = await Course.findByPk(id);
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
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" });
  }
};

// 코스 삭제하기 (ID로 조회)
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
};
