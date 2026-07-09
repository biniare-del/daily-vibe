# 데일리바이브 (Daily Vibe)

매일 30초, 오늘의 기분과 에너지를 기록하는 감성 저널 PWA. Galaxy(안드로이드) 기기에서 홈 화면에
설치해 네이티브 앱처럼 사용할 수 있습니다.

## 주요 기능

- **오늘 체크인**: 이모지 기반 기분(5단계) + 에너지 슬라이더 + 한 줄 메모
- **연속 기록 스트릭 / 총 기록 수** 트래킹
- **기록 히트맵**: GitHub 잔디밭 스타일로 기분 트렌드를 한눈에 확인
- **월간 리포트**: 평균 기분/에너지, 기분 분포, 최고의 하루 (프리미엄)
- **PWA**: 오프라인 캐싱, 홈 화면 설치, 독립 실행형(standalone) 표시

## 수익화 모델 (Freemium)

| 플랜 | 내용 |
| --- | --- |
| 무료 | 오늘 체크인, 최근 30일 히스토리, 기본 스트릭 |
| 프리미엄 (월 2,900원 가정) | 전체 히스토리, 월간 리포트, 데이터 내보내기(JSON), 커스텀 리마인더 |

> 현재 프리미엄 잠금 해제는 결제 연동 전 **데모 버튼**입니다 (`src/storage.ts`의
> `setPremium`). 실제 서비스 전환 시 아래 "다음 단계"를 참고하세요.

## 개발

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
```

## Galaxy(안드로이드)에서 설치 확인하는 법

1. `npm run build && npm run preview` 로 로컬 서버 실행 (또는 배포된 URL 접속)
2. Galaxy 기기의 **Chrome** 또는 **Samsung Internet**으로 접속
3. 주소창 메뉴 → "앱 설치" / "홈 화면에 추가" 선택
4. 홈 화면 아이콘으로 실행하면 standalone 모드(주소창 없이 전체화면)로 열림

## 수익화까지 가기 위한 다음 단계

1. **배포**: Vercel/Netlify/Cloudflare Pages 중 하나로 정적 배포 (HTTPS 필수 - PWA 설치 조건)
2. **결제 연동**: 웹 기준 Stripe Checkout + Webhook으로 구독 상태를 서버(또는 Supabase/Firebase)에
   저장. Google Play에 TWA(Trusted Web Activity)로 감싸 올릴 경우 Play Billing 연동도 검토
3. **계정/동기화**: 현재는 기기 localStorage만 사용 → 기기 변경 시 데이터 유실. Firebase Auth +
   Firestore 또는 Supabase로 전환해 로그인 기반 동기화 추가
4. **푸시 알림**: 매일 체크인 리마인더 (Web Push API) → 리텐션의 핵심 레버
5. **분석**: Plausible/GA4로 DAU, 체크인 완료율, 무료→유료 전환율 추적
6. **ASO/마케팅**: PWA는 스토어 노출이 없으므로 초기엔 커뮤니티(블라인드, 링크드인, 스레드)
   공유 + SEO(랜딩페이지)로 유입 확보가 중요

## 기술 스택

React 18 + TypeScript + Vite + Tailwind CSS + vite-plugin-pwa (Workbox)
