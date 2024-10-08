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
  console.log("getAllCourses called");
  try {
    const { sortBy, location, user, direction, page, pageSize } =
      decode2queryData(req.query.data); // URL 쿼리에서 정렬 정보 추출
    console.log("Query parameters:", { sortBy, location, user, direction});

    const sortDirection = direction || "ASC"; // 기본 정렬 방향 설정
    const orderCondition = sortBy ? [[sortBy, sortDirection]] : []; // 정렬 조건
    const whereCondition = {}; // 조회 조건을 담을 객체 생성

    if (location) whereCondition.F_Course_Location = location; // 구역 정보 조회 조건 추가
    if (user) whereCondition.F_User_id = user; // 유저 정보 조회 조건 추가

    const totalCourse = await Course.count({ where: { ...whereCondition } });
    console.log("Total courses:", totalCourse);

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
      limit: pageSize ? parseInt(pageSize) : 5,
      offset: page ? parseInt(page - 1) * parseInt(pageSize) : 0,
    });
    console.log("Fetched courses:", courses);

    const modifiedCourses = courses.map((course) => {
      const imagePath = path.join(
        __dirname,
        `../assets/courseImage/${course.id}`,
        `${course.id}_0.jpg`
      );
      let imageUrl = null;
      if (fs.existsSync(imagePath)) {
        imageUrl = `courseImage/${course.id}/${course.id}_0.jpg`; // 이미지 파일의 URL 제공
      }
      return {
        ...course.get(),
        id: course.id,
        F_Course_Location: course.F_Course_Location,
        userName: course.Writer.nickname,
        location: course.Location.name,
        tags: course.Spots.map((spot) => spot.Category),
        imageUrl,
      };
    });

    console.log("Modified courses:", modifiedCourses);

    res.json({ modifiedCourses: modifiedCourses, total: totalCourse });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// 특정 코스 가져오기 (ID로 조회)
// GET /course-api/:id
exports.getCourseById = async (req, res) => {
  console.log("getCourseById called");
  const { id } = req.params;
  console.log("Course ID:", id);
  try {
    const course = await Course.findByPk(id, {
      include: [
        { model: User, as: "Writer", attributes: ["nickname"] },
        { model: Location, as: "Location", attributes: ["name"] },
        {
          model: Spot,
          as: "Spots",
          attributes: ["id", "Spot_Name", "Category"],
          through: { model: Link },
        },
        {
          model: CourseComment,
          as: "CourseComments",
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
    console.log("This is RDS finish")
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ error: "Course not found" });
    }

    const imageDir = path.join(__dirname, `../assets/courseImage/${course.id}`);
    let imageUrlList = [];

    if (fs.existsSync(imageDir)) {
      const files = fs.readdirSync(imageDir);
      imageUrlList = files.map(file => `courseImage/${course.id}/${file}`);
    }

    const modifiedCourse = {
      ...course.get(),
      nickname: course.Writer.nickname,
      location: course.Location.name,
      spots: course.Spots,
      comment: course.CourseComments.map((comment) => ({
        ...comment.get(),
        nickname: comment.User.nickname,
      })),
      imageUrlList,
    };

    console.log("This is Modified course in getCourse from ID:", modifiedCourse);

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// 코스 생성하기
// POST /course-api
exports.createCourse = async (req, res) => {
  console.log("createCourse called");
  const { F_User_id, Course_title, Course_content, F_Course_Location, spots } =
    req.body;
  console.log("Request body:", req.body);
  const transaction = await db.sequelize.transaction(); // 트랜잭션 시작
  try {
    const newCourse = await Course.create(
      {
        F_User_id,
        title: Course_title,
        content: Course_content,
        F_Course_Location,
        meanStarPoint: 0,
        countStarPoint: 0,
        createAt: new Date(),
      },
      { transaction }
    );

    await newCourse.addSpots(spots, { transaction });

    await transaction.commit(); // 트랜잭션 커밋

    const modifiedCourse = {
      ...newCourse.get(),
    };

    console.log("Created course:", modifiedCourse);

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
  console.log("uploadImage called");
  const { courseId } = req.query;
  const files = req.files;
  console.log("Course ID:", courseId);
  console.log("Files:", files);
  try {
    const modifiedid = courseId;
    const course = await Course.findByPk(modifiedid);
    if (!course) {
      console.log("Course not found");
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

    console.log("Images uploaded successfully");

    res.json({ message: "Images uploaded successfully" });
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// 코스 수정하기
// PUT /course-api/:id
exports.updateCourse = async (req, res) => {
  console.log("updateCourse called");
  const { id } = req.params;
  const {
    Course_title,
    Course_content,
    F_Course_Location,
    meanStarPoint,
    countStarPoint,
  } = req.body;
  console.log("Course ID:", id);
  console.log("Request body:", req.body);
  try {
    const modifiedid = id;
    const decodedLocation = F_Course_Location;

    const course = await Course.findByPk(modifiedid);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ error: "Course not found" });
    }

    course.Course_title = Course_title || course.Course_title;
    course.Course_content = Course_content || course.Course_content;
    course.F_Course_Location = decodedLocation || course.F_Course_Location;
    course.meanStarPoint =
      meanStarPoint !== undefined ? meanStarPoint : course.meanStarPoint;
    course.countStarPoint =
      countStarPoint !== undefined ? countStarPoint : course.countStarPoint;

    await course.save();

    const modifiedCourse = {
      ...course.get(),
    };

    console.log("Updated course:", modifiedCourse);

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// PUT /course-api/starpoint/:id
exports.updateStarPoint = async (req, res) => {
  console.log("updateCourse (StarPoint) called");
  const { id } = req.params;
  const { addStarPoint } = req.body;
  console.log("Course ID:", id);
  console.log("Request body:", req.body);
  try {
    const modifiedid = id;
    // const decodedLocation = F_Course_Location;

    const course = await Course.findByPk(modifiedid);
    console.log("In CourseContorller, update Course starpoint:", course);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ error: "Course not found" });
    }
    console.log("Before Course StarPoint:", course.meanStarPoint, course.countStarPoint);
    course.meanStarPoint = (addStarPoint + course.meanStarPoint*course.countStarPoint) / (course.countStarPoint+1);
    course.countStarPoint = course.countStarPoint + 1
    console.log("After Course StarPoint:", course.meanStarPoint, course.countStarPoint);
    await course.save();

    const modifiedCourse = {
      ...course.get(),
    };

    console.log("Finish Updated course (starpoint):", modifiedCourse);

    res.json(modifiedCourse);
  } catch (err) {
    console.error("Error updating course (StarPoint):", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// DELETE /course-api/:id
exports.deleteCourse = async (req, res) => {
  console.log("deleteCourse called");
  const { id } = req.params;
  console.log("Course ID:", id);
  try {
    const modifiedid = id;
    const course = await Course.findByPk(modifiedid);
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy({ cascade: true }); // 관련된 데이터도 삭제
    console.log("Course deleted successfully");
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
