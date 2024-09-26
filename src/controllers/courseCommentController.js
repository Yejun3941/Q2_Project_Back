const { CourseComment, User, Course } = require("../models"); // CourseComment 모델 불러오기
const { decode2queryData } = require("../services/decodingService");

// 모든 코멘트 가져오기
// GET /comment-api?data={sortBy=starPoint&user=121323&course=12345(encoded)}
// sort by starPoint / createdAt
// where user / course
exports.getAllComments = async (req, res) => {
  try {
    console.log("Start get all comments");
    const { sortBy, user, course } = decode2queryData(
      req.query.data
    ); // URL 쿼리에서 정렬 정보 추출

    console.log("get query value ", course);

    const whereCondition = {}; // 조회 조건을 담을 객체 생성
    // user ? (whereCondition.F_User_id = fermatDecode(user)) : null; // 유저 정보가 있을 경우 조회 조건에 추가
    user ? (whereCondition.F_User_id = user) : null; // 유저 정보가 있을 경우 조회 조건에 추가
    course ? (whereCondition.F_Course_id = course) : null; // 코스 정보가 있을 경우 조회 조건에 추가
    // const orderCondition = []; // 정렬 조건을 담을 객체 생성
    // sortBy ? orderCondition.push([sortBy, "ASC"]) : null; // 정렬 정보가 있을 경우 정렬
    // sortBy ? orderCondition.push([(secondSortBy = "createdAt"), "ASC"]) : null; // 정렬 정보가 있을 경우 Second 정렬 기준

    const totalComment = await CourseComment.count({
      where: {
        ...whereCondition,
      },
    });
    console.log("totalComment", totalComment);
    const comments = await CourseComment.findAll({
      where: {
        ...whereCondition,
      },
      incluede: [
        { model: User, as: "Writer", attributes: ["nickname"] },
      ],
      // order: orderCondition
    }); // 데이터베이스에서 모든 코멘트를 조회
    console.log("Finish comments", comments);

    const modifiedComments = comments.map((comment) => ({
      ...comment.get(),
      // id: comment.id,
      // F_User_id: comment.F_User_id,
      // F_Course_id: comment.F_Course_id,
    }));

    res.json({ comments: modifiedComments, total: totalComment }); // 조회된 코멘트들을 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 특정 코멘트 가져오기 (ID로 조회)
// GET /course-comments/:id
exports.getCommentById = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 코멘트 ID 추출
  try {
    const modifiedid = id;
    const comment = await CourseComment.findByPk(modifiedid); // 주어진 ID로 코멘트 조회
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" }); // 코멘트가 없을 경우 404 상태 코드 반환
    }

    const modifiedComment = {
      ...comment.get(),
      // id: comment.id,
      // F_User_id: comment.F_User_id,
      // F_Course_id: comment.F_Course_id,
    };
    res.json(modifiedComment); // 조회된 코멘트를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comment" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 새 코멘트 생성하기
// POST /comment-api
exports.createComment = async (req, res) => {
  try {
    console.log("Start create comment");
    const { F_Course_id, F_User_id, comment_content, starPoint } = req.body; // 요청 바디에서 필요한 데이터 추출
    // F_Course_id = F_Course_id;
    // F_User_id = F_User_id;
    console.log("query value ", F_Course_id, F_User_id, comment_content, starPoint);
    const newComment = await CourseComment.create({
      F_Course_id,
      F_User_id,
      comment_content,
      starPoint,
      createdAt: new Date(), // 생성 시간은 현재 시간으로 설정
    });
    console.log("Finish create comment", newComment);
    const modifiedComment = {
      ...newComment.get(),
      // id: comment.id,
      // F_User_id: fermatIncode(comment.F_User_id),
      // F_Course_id: comment.F_Course_id,
    };

    res.status(201).json(modifiedComment); // 생성된 코멘트를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 기존 코멘트 업데이트하기 (ID로 조회)
// PUT /course-comments/:id
exports.updateComment = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 코멘트 ID 추출
  const { comment_content, starPoint } = req.body; // 요청 바디에서 업데이트할 데이터 추출
  try {
    const modifiedid = id;
    const comment = await CourseComment.findByPk(modifiedid); // 주어진 ID로 코멘트 조회
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" }); // 코멘트가 없을 경우 404 상태 코드 반환
    }

    // 새로운 값이 제공되었을 때만 업데이트, 그렇지 않으면 기존 값을 유지
    comment.comment_content = comment_content || comment.comment_content;
    comment.starPoint = starPoint !== undefined ? starPoint : comment.starPoint;

    await comment.save(); // 변경된 내용을 데이터베이스에 저장

    const modifiedComment = {
      ...comment.get(),
      // id: comment.id,
      // F_User_id: fermatIncode(comment.F_User_id),
      F_Course_id: comment.F_Course_id,
    };
    res.json(modifiedComment); // 업데이트된 코멘트를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 코멘트 삭제하기 (ID로 조회)
// DELETE /course-comments/:id
exports.deleteComment = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 코멘트 ID 추출
  try {
    const modifiedid = id;
    const comment = await CourseComment.findByPk(modifiedid); // 주어진 ID로 코멘트 조회
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" }); // 코멘트가 없을 경우 404 상태 코드 반환
    }

    await comment.destroy(); // 해당 코멘트를 데이터베이스에서 삭제
    res.json({ message: "Comment deleted successfully" }); // 삭제 완료 메시지 반환
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};
