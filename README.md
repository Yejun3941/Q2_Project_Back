# Q2 Project

## Project Folder Architecture
```md
src/
├── controllers/
│   ├── authController.js
│   ├── spotController.js
│   ├── courseController.js
│   └── userController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Location.js
│   ├── Spot.js
│   ├── Course.js
│   ├── FavoritSpot.js
│   ├── FavoritCourse.js
│   ├── Link.js
│   └── CourseComment.js
├── passport/               
│   ├── index.js            
│   ├── kakaoStrategy.js    
│   └── naverStrategy.js    
├── routes/
│   ├── authRoutes.js
│   ├── spotRoutes.js
│   ├── courseRoutes.js
│   ├── userRoutes.js
│   └── index.js
├── services/
│   ├── authService.js
│   ├── spotService.js
│   ├── courseService.js
│   └── userService.js
└── app.js
```
## 폴더 및 파일 설명

### `controllers/`
애플리케이션의 주요 비즈니스 로직을 처리하는 컨트롤러 모음입니다. 각 컨트롤러는 특정 도메인에 대한 요청을 처리합니다.

- **`authController.js`**: 사용자 인증 관련 로직을 처리하는 컨트롤러입니다. 로그인, 회원가입, 로그아웃 등의 기능을 담당합니다.
- **`spotController.js`**: 스팟(장소) 관련 요청을 처리하는 컨트롤러입니다. 스팟 목록 조회, 스팟 상세 조회 등의 기능을 포함합니다.
- **`courseController.js`**: 코스 관련 요청을 처리하는 컨트롤러입니다. 코스 목록 조회, 코스 상세 조회 및 생성, 수정, 삭제 기능을 담당합니다.
- **`userController.js`**: 사용자 정보 및 관리와 관련된 로직을 처리하는 컨트롤러입니다. 사용자 정보 조회 및 수정, 계정 삭제 등의 기능을 포함합니다.

### `middlewares/`
요청 처리 과정에서 특정 기능을 수행하는 미들웨어 모음입니다.

- **`authMiddleware.js`**: 사용자 인증이 필요한 요청을 보호하는 미들웨어입니다. 요청에 인증 토큰이 있는지 확인하고, 유효한 토큰인지 검사합니다.
- **`errorMiddleware.js`**: 애플리케이션 내에서 발생하는 에러를 처리하는 미들웨어입니다. 에러를 적절히 처리하여 클라이언트에게 응답을 반환합니다.

### `models/`
데이터베이스와 상호작용하는 모델 정의 모음입니다. 각 모델은 데이터베이스의 테이블에 해당하며, 데이터 구조를 정의합니다.

- **`User.js`**: 사용자 정보를 저장하는 모델입니다. 사용자의 프로필, 인증 정보 등을 포함합니다.
- **`Location.js`**: 위치 정보를 저장하는 모델입니다. 장소의 좌표, 주소 등의 정보를 포함합니다.
- **`Spot.js`**: 스팟(장소) 정보를 저장하는 모델입니다. 스팟의 이름, 설명, 위치 정보 등을 포함합니다.
- **`Course.js`**: 코스 정보를 저장하는 모델입니다. 여러 스팟을 묶어 코스를 구성하며, 코스의 이름, 설명 등을 포함합니다.
- **`FavoritSpot.js`**: 사용자가 즐겨찾기한 스팟 정보를 저장하는 모델입니다.
- **`FavoritCourse.js`**: 사용자가 즐겨찾기한 코스 정보를 저장하는 모델입니다.
- **`Link.js`**: 스팟이나 코스 간의 링크 정보를 저장하는 모델입니다. 코스에 포함된 스팟 간의 관계를 정의합니다.
- **`CourseComment.js`**: 코스에 대한 댓글 정보를 저장하는 모델입니다.

### `passport/`
소셜 로그인과 관련된 로직을 정의하는 폴더입니다. Passport.js를 사용하여 소셜 로그인 전략을 설정합니다.

- **`index.js`**: Passport.js 초기화 및 설정 파일입니다. 여러 전략들을 통합하고 초기화합니다.
- **`kakaoStrategy.js`**: 카카오 소셜 로그인 전략을 정의하는 파일입니다.
- **`naverStrategy.js`**: 네이버 소셜 로그인 전략을 정의하는 파일입니다.

### `routes/`
각 요청 URL과 해당 컨트롤러를 매핑하는 라우트 정의 모음입니다.

- **`authRoutes.js`**: 인증 관련 API 엔드포인트를 정의하는 라우트 파일입니다.
- **`spotRoutes.js`**: 스팟 관련 API 엔드포인트를 정의하는 라우트 파일입니다.
- **`courseRoutes.js`**: 코스 관련 API 엔드포인트를 정의하는 라우트 파일입니다.
- **`userRoutes.js`**: 사용자 관련 API 엔드포인트를 정의하는 라우트 파일입니다.
- **`index.js`**: 모든 라우트를 통합하고 관리하는 파일입니다.

### `services/`
비즈니스 로직을 처리하고 컨트롤러와 모델 사이에서 데이터 처리를 담당하는 서비스 모음입니다.

- **`authService.js`**: 인증 관련 비즈니스 로직을 처리하는 서비스입니다. 사용자 로그인, 회원가입, 토큰 관리 등을 담당합니다.
- **`spotService.js`**: 스팟 관련 비즈니스 로직을 처리하는 서비스입니다. 스팟 데이터를 처리하고 컨트롤러에 전달합니다.
- **`courseService.js`**: 코스 관련 비즈니스 로직을 처리하는 서비스입니다. 코스 데이터를 생성, 수정, 삭제하는 로직을 포함합니다.
- **`userService.js`**: 사용자 관련 비즈니스 로직을 처리하는 서비스입니다. 사용자 정보 조회 및 수정 로직을 담당합니다.

### 최상위 파일들
- **`app.js`**: 애플리케이션의 진입점 파일로, 서버를 초기화하고 필요한 미들웨어, 라우트 등을 설정합니다. Express 서버가 이 파일에서 시작됩니다.

---

## 설치 및 실행

### 1. 패키지 설치
프로젝트 루트 디렉토리에서 다음 명령어를 치세요.
- npx create-react-app . --template typescript
- npm i / npm start

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

##  GIT 규칙 - commit, branch

### Commit 규칙

- **`타입(태그)`**: 커밋의 성격을 간결하게 나타냅니다.
- **`주제`**: 변경 사항을 요약합니다 (50자 이내).
- **`본문`**: 선택 사항으로, 커밋에 대한 추가 설명이나 이유, 세부사항을 포함할 수 있습니다. 본문은 한 줄 비워둔 뒤 작성하며, 각 줄은 72자를 넘지 않도록 합니다.
- **`이슈 번호`**: 관련된 이슈 번호를 명시합니다 (있을 경우).
```
feat: Add user authentication

Implemented JWT-based authentication for the user login system.
This includes token generation, verification, and middleware setup.

Closes #42
```

### 커밋 메시지 타입(태그)

- **`feat`**: 새로운 기능 추가 (예: feat: Add payment processing module)
- **`fix`**: 버그 수정 (예: fix: Correct user login issue)
- **`refactor`**: 코드 리팩토링 (기능 변화 없음) (예: refactor: Optimize API response handling)
- **`style`**: 코드 스타일 수정 (포매팅, 세미콜론 추가 등) (예: style: Reformat code according to ESLint rules)
- **`docs`**: 문서 수정 (예: docs: Update API documentation for v2.0)
- **`test`**: 테스트 코드 추가 또는 수정 (예: test: Add unit tests for user service)
- **`chore`**: 빌드 또는 개발 도구 관련 작업 (예: chore: Update dependencies)
- **`perf`**: 성능 개선 (예: perf: Improve query performance for large datasets)
- **`ci`**: CI 설정 수정 (예: ci: Update GitHub Actions configuration)
- **`revert`**: 이전 커밋 되돌리기 (예: revert: Revert "feat: Add payment processing module")

### Git-flow 전략에 따른 커밋 예시
  
 **Feature 브랜치 작업**:
 - `feat`: Implement user registration form
 - `feat`: Add password validation logic

 **Bugfix 작업**:
 - `fix`: Resolve issue with login redirection
 - `fix`: Correct API endpoint path

  **Release 브랜치에서 버전 준비**:
 - `chore`: Prepare version 1.2.0 release
 - `docs`: Update CHANGELOG for 1.2.0 release

  **Hotfix 작업**:
 - `fix`: Critical bug in production environment
 - `revert`: Revert faulty migration script

### 커밋 메시지 작성 시 Best Practices
- **`작은 커밋`**: 커밋을 자주, 작은 단위로 나누어 기록합니다. 각 커밋은 독립적으로 이해될 수 있어야 합니다.
- **`의미 있는 메시지`**: 커밋 메시지는 코드 변경 내용만이 아닌, 변경의 이유도 설명해야 합니다.
- **`현재 시제 사용`**: 커밋 메시지는 현재 시제로 작성합니다. 예: "Added" 대신 "Add".
- **`관련 이슈 참조`**: 관련된 이슈 번호를 명시하여 변경 사항과 이슈를 연결합니다.

### 규약 준수
모든 팀원은 이 규칙을 준수하여 일관된 Git 커밋 메시지를 작성해야 하며, 이를 통해 프로젝트 관리와 협업이 원활하게 진행될 수 있도록 노력합니다. 규칙을 준수하지 않을 경우, 코드 리뷰에서 지적되어 수정 요청을 받을 수 있습니다.

### 이 규약은 팀 프로젝트의 성공적인 진행을 위해 만들어졌으며, 모든 팀원은 이를 숙지하고 준수해야 합니다.
