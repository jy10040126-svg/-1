# SmartVend AI - 스마트 자판기 위치, 재고 및 QR 예약 시스템

Vercel 기반 스마트 자판기 추천 및 QR 예약 웹 애플리케이션입니다.

## 파일 구조

```text
smart-vending-app/
├── index.html          # 프론트엔드 UI 및 스크립트
├── api/
│   └── generate.js     # Vercel Serverless Function (Gemini API 호출)
├── package.json        # Node.js 프로젝트 설정
└── README.md           # 안내 문서
```

## 배포 가이드 (Vercel)

1. 이 프로젝트 소스코드를 GitHub 레포지토리에 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인 후 "New Project"를 통해 레포지토리를 가져옵니다.
3. 프로젝트 설정의 **Environment Variables**에 아래 환경변수를 등록합니다.
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Google Gemini API 키
4. 배포(Deploy)를 진행합니다.
