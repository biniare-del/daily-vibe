# 클라우드 백업 설정 가이드 (Supabase + 구글 로그인)

앱 코드는 이미 다 준비돼 있어요. 아래 단계를 따라 계정/설정만 만들어주시면 바로 동작합니다.

## 1. Supabase 프로젝트 생성

1. https://supabase.com 접속 → 회원가입/로그인
2. "New project" 클릭 → 프로젝트 이름, DB 비밀번호, 리전(가까운 곳, 예: Northeast Asia) 설정 후 생성
3. 생성되면 왼쪽 메뉴 **Settings → API** 로 이동해서 아래 두 값을 복사해두세요
   - `Project URL`
   - `anon public` 키

## 2. 테이블 + 보안 정책(RLS) 만들기

Supabase 대시보드 왼쪽 메뉴 **SQL Editor** 에서 아래 SQL을 그대로 실행하세요.

```sql
create table vibe_entries (
  user_id uuid references auth.users not null,
  date text not null,
  mood int not null,
  energy int not null,
  note text default '',
  tags text[] default '{}',
  photo text,
  created_at bigint not null,
  primary key (user_id, date)
);

alter table vibe_entries enable row level security;

create policy "Users can manage their own entries"
  on vibe_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

이 정책 덕분에 각 사용자는 본인 데이터만 읽고 쓸 수 있어요 (다른 사람 기록은 절대 못 봄).

## 3. 구글 로그인 연결

Supabase의 구글 로그인은 구글 클라우드 쪽에 OAuth 클라이언트를 하나 만들어서 연결해야 해요.

1. https://console.cloud.google.com → 프로젝트 생성(또는 기존 프로젝트 선택)
2. **APIs & Services → OAuth consent screen** 에서 앱 이름/이메일 등 기본 정보 입력 (External로 설정)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** 선택
   - Application type: **Web application**
   - Authorized redirect URIs 에 Supabase가 안내하는 콜백 URL 추가
     (Supabase 대시보드 **Authentication → Providers → Google** 화면에 정확한 콜백 URL이 표시돼요.
     보통 `https://<프로젝트ref>.supabase.co/auth/v1/callback` 형태예요)
4. 생성된 **Client ID / Client Secret**을 Supabase **Authentication → Providers → Google** 화면에 붙여넣고 저장

## 4. 앱에 연결하기

프로젝트 루트에 `.env.local` 파일을 만들고 (이미 `.gitignore`에 등록되어 있어 커밋되지 않아요):

```
VITE_SUPABASE_URL=여기에_Project_URL
VITE_SUPABASE_ANON_KEY=여기에_anon_public_키
```

저장 후 `npm run dev` (또는 배포 환경의 환경변수로 동일하게 설정)하면 설정 탭의
"클라우드 백업"에서 구글 로그인 버튼이 활성화돼요.

## 5. 배포할 때

Vercel/Netlify 등에 배포한다면, 그 서비스의 환경변수(Environment Variables) 설정 화면에
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 동일하게 등록해주세요.

---

anon 키는 이름 그대로 공개되어도 안전하도록 설계된 키예요 (실제 보안은 위의 RLS 정책이 담당).
그래도 걱정되시면 `.env.local`은 로컬에만 두고, 저한테는 값을 안 알려주셔도 됩니다 — 파일만
만들어두시면 제가 다음에 코드를 더 건드릴 때도 그대로 잘 동작해요.
