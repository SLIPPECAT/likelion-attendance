# 멋쟁이사자부트캠프 출결 분석기 (GitHub Repository Spec)

멋쟁이사자부트캠프 수강생을 위한 **출결 데이터(PDF) 분석 및 80% 수료 예측 계산 웹 애플리케이션**입니다.

---

## 📌 주요 기능 (Features)

1. **PDF 출결 데이터 파싱**
   - 멋쟁이사자부트캠프 출결 현황 페이지(`https://bootcamp.likelion.net/my/courses/detail/kdt-cld-6th/attendance`)에서 다운로드한 PDF 지원
   - 브라우저 내 pdf.js + 정규식 기반 파서로 자동 데이터 추출 (성명, 출결 기간, 일자별 출석/결석/지각/조퇴/외출 내역). 서버나 외부 API를 거치지 않습니다.

2. **3회 지각·조퇴·외출 = 결석 1회 환산 규정 자동 계산**
   - 지각, 조퇴, 외출 누적 횟수를 3으로 나누어 자동 결석 일수 산출
   - 환산 후 잔여 누적 횟수 및 다음 결석까지의 남은 회수 시각화

3. **80% 수료 기준 실시간 판정**
   - 총 교육일수 대비 현재 인정 출석률 계산
   - 수료 기준(80%) 달성 여부(PASS / FAIL) 및 여유 결석 일수 도출

4. **향후 출결 가상 시뮬레이터**
   - 남아있는 교육일수 동안의 예상 결석, 지각/조퇴 횟수를 인터랙티브 슬라이더로 조절하여 최종 출석률 예측

5. **개인정보 보호 & 파일 즉시 파기**
   - 업로드된 PDF 파일은 서버 디스크에 저장되지 않으며, 분석 직후 즉시 메모리에서 소멸 처리

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **PDF Parsing**: pdf.js (`pdfjs-dist`), 전부 브라우저에서 실행
- **Deployment Target**: GitHub Pages (정적 파일만으로 동작, 서버 불필요)

---

## 🚀 GitHub Pages 배포 가이드

이 저장소는 순수 정적 파일(Vite 빌드 결과물)만 배포하면 되므로, GitHub Pages와 궁합이 가장 좋습니다.

### 자동 배포 (권장)
`.github/workflows/deploy.yml`이 `main` 브랜치 push마다 자동으로 빌드 후 GitHub Pages에 배포합니다.
1. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정
2. `main`에 push하면 자동 배포 완료

### 수동 배포
```
npm install -D gh-pages   # 이미 devDependency에 포함되어 있음
npm run deploy            # dist/ 를 gh-pages 브랜치로 push
```

---

## 🔒 보안 및 개인정보 처리방침
- 업로드한 PDF 파일은 서버로 전송되지 않으며, 분석은 전부 사용자 브라우저 안에서 이루어집니다.
- 본 서비스는 수강생 개인이 본인의 출석율을 편리하게 가늠해볼 수 있도록 제작된 보조 계산 도구입니다.
