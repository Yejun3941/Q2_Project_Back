const { User } = require("../models"); // User 모델 불러오기
const { decode2queryData } = require("../services/decodingService"); // base64 디코딩 서비스 불러오기

// 모든 유저 가져오기
// GET /users
// admin 전용 => 보류
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll(); // 데이터베이스에서 모든 유저를 조회
//     res.json(users); // 조회된 유저들을 JSON 형태로 응답
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
//   }
// };

// 특정 유저 가져오기 (ID로 조회)
// GET /users/:id
exports.getUserById = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 유저 ID 추출
  try {
    modifiedId = id;

    const user = await User.findByPk(modifiedId); // 주어진 ID로 유저 조회
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // 유저가 없을 경우 404 상태 코드 반환
    }

    const modifiedUser = {
      ...user.get(),
      // id: fermatIncode(user.id),
    };
    res.json(modifiedUser); // 조회된 유저를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 새 유저 생성하기 사용X(passport 에서 수행)
// POST /users
// exports.createUser = async (req, res) => {
//   const { email, nickname, password, provider } = req.body; // 요청 바디에서 필요한 데이터 추출
//   try {
//     const newUser = await User.create({
//       email,
//       nickname,
//       password, // 여기에서 비밀번호는 SHA256과 같은 해시 방식으로 암호화할 수 있습니다.
//       provider,
//       createdAt: new Date(), // 생성일자는 현재 시간으로 설정
//     });
//     res.status(201).json(newUser); // 생성된 유저를 JSON 형태로 응답
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create user" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
//   }
// };

// 기존 유저 업데이트하기 (ID로 조회)
// PUT /users/:id
exports.updateUser = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 유저 ID 추출
  const { nickname } = req.body; // 요청 바디에서 업데이트할 데이터 추출
  try {
    modifiedId = id;
    const user = await User.findByPk(modifiedId); // 주어진 ID로 유저 조회
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // 유저가 없을 경우 404 상태 코드 반환
    }

    // 새로운 값이 제공되었을 때만 업데이트, 그렇지 않으면 기존 값을 유지
    // user.email = email || user.email;
    user.nickname = nickname || user.nickname;
    // user.provider = provider || user.provider;
    user.updatedAt = new Date(); // 업데이트 일자 갱신

    await user.save(); // 변경된 내용을 데이터베이스에 저장
    modifiedUser = {
      ...user.get(),
      // id: fermatIncode(user.id),
    };
    res.json(modifiedUser); // 업데이트된 유저를 JSON 형태로 응답
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};

// 유저 삭제하기 (ID로 조회)
// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 유저 ID 추출
  try {
    modifiedId = id;
    const user = await User.findByPk(modifiedId); // 주어진 ID로 유저 조회
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // 유저가 없을 경우 404 상태 코드 반환
    }

    // 실제로 삭제하지 않고, 삭제 예정일(deletedAt)을 설정하여 소프트 삭제
    user.deletedAt = new Date();
    user.deletedAt.setFullYear(user.deletedAt.getFullYear() + 1);
    await user.save();

    res.json({
      message: "User deleted successfully. Account will be deleted in 1 year.",
    }); // 삭제 완료 메시지 반환
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
};
