# Next.js & Supabase 기반 블로그 플랫폼

이 프로젝트는 Next.js 15(App Router)와 Supabase를 사용하여 구축된 최신 기술 스택의 블로그 애플리케이션입니다. 사용자 인증, 게시물 관리(CRUD), 댓글, 다국어 지원 등 블로그의 핵심 기능을 포함하고 있습니다.

## ✨ 주요 기능

- **사용자 인증**: Supabase Auth를 이용한 이메일/비밀번호 기반 회원가입 및 로그인
- **게시물 관리**: 마크다운 에디터를 사용한 게시물 생성, 조회, 수정, 삭제 (CRUD)
- **댓글 기능**: 각 게시물에 대한 사용자 댓글 작성 및 조회
- **프로필 관리**: 사용자 이름, 아바타 등 프로필 정보 수정
- **태그 시스템**: 게시물에 태그를 추가하여 분류
- **다국어 지원**: `next-intl`을 활용한 한국어/영어 지원 (i18n)
- **테마 전환**: 라이트/다크 모드 테마 지원
- **방문자 통계**: 간단한 방문자 수 추적 기능

## 🚀 기술 스택

- **프론트엔드**: Next.js 15, React, TypeScript, Tailwind CSS
- **백엔드**: Supabase (PostgreSQL Database, Auth, Storage)
- **상태 관리**: React Hooks & Context API
- **UI/UX**: `react-hot-toast` (알림), `react-icons` (아이콘)
- **코드 품질**: ESLint, Prettier

## 🏛️ 아키텍처 특징

- **Next.js App Router**: 서버 컴포넌트와 클라이언트 컴포넌트를 적극적으로 활용하여 성능 최적화
- **Supabase 통합**: 브라우저와 서버 환경을 위한 별도의 Supabase 클라이언트를 구현 (`/lib/supabase/client.ts`, `/lib/supabase/server.ts`)
- **인증 및 미들웨어**: `middleware.ts`를 통해 인증 상태를 확인하고 보호된 라우트(/dashboard)로의 접근을 제어
- **데이터베이스 보안**: Supabase의 RLS(Row Level Security)를 적용하여 사용자별 데이터 접근 권한 관리
- **타입 안정성**: Supabase CLI를 통해 데이터베이스 스키마로부터 TypeScript 타입을 자동 생성하여 사용

## 🏁 시작하기

### 1. 레포지토리 클론

```bash
git clone https://github.com/your-username/nextjs-supabase-blog-ai.git
cd nextjs-supabase-blog-ai
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일이 있다면 복사하여 `.env.local` 파일을 생성하고, 본인의 Supabase 프로젝트 정보를 입력합니다. 없다면 `.env.local` 파일을 직접 생성하세요.

```bash
# .env.example이 있는 경우
cp .env.example .env.local
```

```.env.local
# 다음 값들을 본인의 Supabase 프로젝트 값으로 채워주세요.
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 🛠️ 주요 명령어

- `npm run dev`: 개발 서버를 시작합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run start`: 빌드된 애플리케이션을 실행합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run typecheck`: TypeScript 타입 체크를 실행합니다.
