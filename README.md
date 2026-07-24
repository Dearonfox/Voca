# Voca

토익 영단어를 Day 단위로 학습하는 React 데모 앱입니다. 단어 목록 조회, 뜻 보기/숨기기, 암기 완료 체크, 단어 추가/삭제, Day 추가/삭제를 지원합니다.

## Tech Stack

- React
- TypeScript
- React Router v5
- json-server
- Create React App

## 실행 방법

```bash
npm install
npm run server
```

다른 터미널에서 프론트엔드를 실행합니다.

```bash
npm start
```

- Frontend: http://localhost:3000
- API server: http://localhost:3001

## 환경 변수

API 주소를 바꾸고 싶다면 `.env`에 아래 값을 설정합니다.

```bash
REACT_APP_API_BASE_URL=http://localhost:3001
```

## 주요 기능

- Day별 단어 목록 보기
- 이전/다음 Day 이동
- 뜻 보기/숨기기
- 암기 완료 체크
- 단어 추가 및 삭제
- Day 추가 및 마지막 Day 삭제

## 데모 한계

현재 백엔드는 실제 서버가 아니라 `json-server` 기반 목업 API입니다. 로그인, 사용자별 데이터, 배포용 API, 테스트 코드는 아직 포함되어 있지 않습니다.
