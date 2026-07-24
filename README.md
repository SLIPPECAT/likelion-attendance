# 멋쟁이사자부트캠프 출결 분석기

<div align="center">
<img width="600" alt="출결 분석 결과 화면 — 등급, 출석률, 수료 여부가 나온다" src="docs/app-screenshot.jpg" />

**[👉 바로 사용해보기](https://slippecat.github.io/likelion-attendance/)**
</div>

멋쟁이사자부트캠프 출결현황 PDF를 업로드하면 3회 지각/조퇴/외출 = 결석 1회 환산 규칙을 적용해 80% 수료 가능 여부를 계산해주는 웹 앱입니다.

개인적으로 만들어서 GitHub Pages에 올려둔 테스트 프로젝트입니다.

## 로컬 실행

**Prerequisites:** Node.js

1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`

## 빌드

```
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

`main`에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드해서 GitHub Pages(`slippecat.github.io/likelion-attendance`)에 올려줍니다.
