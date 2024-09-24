const { where, or } = require("sequelize");
const {
  Course,
  User,
  Location,
  Spot,
  Link,
  CourseComment,
} = require("../models");
const db = require("../models");
const fs = require("fs");
const path = require("path");
const { decode2queryData } = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 코스 가져오기
// GET /course-api?data={sortBy=createdAt&location=서울&user=121323&limit=5&offset=0}
exports.getAllCourses = async (req, res) => {
  try {
    const { sortBy, location, user, direction, limit, offset } =
      decode2queryData(req.query.data); // URL 쿼리에서 정렬 정보 추출
    const sortDirection = direction || "ASC"; // 기본 정렬 방향 설정
    const orderCondition = sortBy ? [[sortBy, sortDirection]] : []; // 정렬 조건
    const whereCondition = {}; // 조회 조건을 담을 객체 생성

    if (location) whereCondition.F_Course_Location = location; // 구역 정보 조회 조건 추가
    if (user) whereCondition.F_User_id = user; // 유저 정보 조회 조건 추가

    const totalCourse = await Course.count({ where: { ...whereCondition } });

    const courses = await Course.findAll({
      where: { ...whereCondition },
      order: orderCondition,
      include: [
        { model: User, as: "Writer", attributes: ["nickname"] },
        { model: Location, as: "Location", attributes: ["name"] },
        {
          model: Spot,
          as: "Spots",
          attributes: ["Category"],
          through: { model: Link, attributes: [] },
        },
      ],
      limit: limit ? parseInt(limit) : 5, // 조회 개수를 설정할 수 있음
      offset: offset ? parseInt(offset) : 0, // 조회 시작 위치를 설정할 수 있음
    });
    // ***********************************************************
    // include 로 조인된 결과 조회 해서 id 혹시나 불러오는게 있는지 확인 필요**
    // console.log(courses);
    // ***********************************************************
    const modifiedCourses = courses.map((course) => {
      const imagePath = path.join(
        __dirname,
        `../assets/courseImage/${course.id}`,
        `${course.id}_0.jpg`
      );
      let imageUrl = null;
      const backend = process.env.BACKEND || "http://localhost:3001";
      if (fs.existsSync(imagePath)) {
        imageUrl = path.join(backend,`courseImage/${course.id}/${course.id}_0.jpg`); // 이미지 파일의 URL 제공
      }
      return {
        ...course.get(),
        id: course.id,
        // F_User_id: course.F_User_id,
        F_Course_Location: course.F_Course_Location,
        userName: course.Writer.nickname,
        location: course.Location.name,
        tags: course.Spots.map((spot) => spot.Category),
        imageUrl,
      };
    });

    console.log(modifiedCourses);

    res.json({ modifiedCourses: modifiedCourses, total: totalCourse });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// 특정 코스 가져오기 (ID로 조회)
// GET /course-api/:id
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    // const modifiedid = fermatDecode(id);
    const course = await Course.findByPk(id, {
      include: [
        { model: User, as: "Writer", attributes: ["nickname"] },
        { model: Location, as: "Location", attributes: ["name"] },
        {
          model: Spot,
          as: "Spot",
          attributes: ["id", "Spot_Name", "Category"],
          through: { model: Link },
        },
        {
          model: CourseComment,
          as: "CourseComment",
          attributes: [
            "comment_content",
            "starPoint",
            "createdAt",
            "F_User_id",
          ],
          include: [{ model: User, attributes: ["nickname"] }],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const imagePath = path.join(
      __dirname,
      `../assets/courseImage/${course.id}`,
      `${course.id}_${index}.jpg`
    );
    let imageUrl = null;
    if (fs.existsSync(imagePath)) {
      imageUrl = `/assets/courseImage/${course.id}.jpg`; // 이미지 URL 제공
    }

    const modifiedCourse = {
      ...course.get(),
      // id: course.id,
      // F_User_id: course.F_User_id,
      // F_Course_Location: course.F_Course_Location,
      nickname: course.Writer.nickname,
      location: course.Location.name,
      spot: course.Spot.map((spot) => ({
        ...spot.get(),
        // id: spot.id,
      })),
      comment: course.CourseComment.map((comment) => ({
        ...comment.get(),
        nickName: comment.User.nickname,
      })),
      imageUrl,
    };

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// 코스 생성하기
// POST /course-api
exports.createCourse = async (req, res) => {
  const { F_User_id, Course_title, Course_content, F_Course_Location, spots } =
    req.body;
  const transaction = await db.sequelize.transaction(); // 트랜잭션 시작
  try {
    const newCourse = await Course.create(
      {
        F_User_id,
        Course_title,
        Course_content,
        F_Course_Location,
        meanStartPoint: 0,
        countStarPoint: 0,
        createAt: new Date(),
      },
      { transaction }
    );

    await newCourse.addSpots(
      spots.map((spot) => spot),
      { transaction }
    );

    await transaction.commit(); // 트랜잭션 커밋

    const modifiedCourse = {
      ...newCourse.get(),
      // id: newCourse.id,
      // F_User_id: newCourse.F_User_id,
      // F_Course_Location: newCourse.F_Course_Location,
    };

    res.status(201).json(modifiedCourse);
  } catch (err) {
    await transaction.rollback(); // 트랜잭션 롤백
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// 이미지 업로드
// POST /course-api/image?courseId=123
exports.uploadImage = async (req, res) => {
  const { courseId } = req.query;
  const files = req.files;
  try {
    const modifiedid = courseId;
    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 여러 이미지 저장 처리
    files.forEach((file, index) => {
      const imagePath = path.join(
        __dirname,
        `../assets/courseImage/${course.id}`,
        `${course.id}_${index}.jpg`
      );
      fs.mkdirSync(path.dirname(imagePath), { recursive: true }); // 폴더 생성
      fs.writeFileSync(imagePath, file.buffer); // 파일 저장
    });

    res.json({ message: "Images uploaded successfully" });
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// 코스 수정하기
// PUT /course-api/:id
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
    const modifiedid = id;
    const decodedLocation = F_Course_Location;

    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.Course_title = Course_title || course.Course_title;
    course.Course_content = Course_content || course.Course_content;
    course.F_Course_Location = decodedLocation || course.F_Course_Location;
    course.meanStartPoint =
      meanStartPoint !== undefined ? meanStartPoint : course.meanStartPoint;
    course.countStarPoint =
      countStarPoint !== undefined ? countStarPoint : course.countStarPoint;

    await course.save();

    const modifiedCourse = {
      ...course.get(),
      // id: fermatIncode(course.id),
      // F_User_id: fermatIncode(course.F_User_id),
      // F_Course_Location: fermatIncode(course.F_Course_Location),
    };

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// PUT /course-api/startpoint-update/:id
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { addStartPoint } = req.body;
  try {
    const modifiedid = id;
    const decodedLocation = F_Course_Location;

    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.meanStartPoint =
      meanStartPoint !== undefined
        ? addStartPoint + course.meanStartPoint
        : addStartPoint;
    course.countStarPoint =
      countStarPoint !== undefined ? course.countStarPoint + 1 : 1;

    await course.save();

    const modifiedCourse = {
      ...course.get(),
      // id: fermatIncode(course.id),
      // F_User_id: fermatIncode(course.F_User_id),
      // F_Course_Location: fermatIncode(course.F_Course_Location),
    };

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// DELETE /course-api/:id
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const modifiedid = id;
    const course = await Course.findByPk(modifiedid);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy({ cascade: true }); // 관련된 데이터도 삭제
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
