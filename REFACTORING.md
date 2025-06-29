# 리팩토링 내역 (Refactoring Summary)

이 문서는 프로젝트의 유지보수성, 가독성, 재사용성을 높이기 위해 진행된 주요 리팩토링 내역을 정리합니다.

## 1. 페이지 및 공통 컴포넌트 리팩토링

### `PostList` 컴포넌트 추출

-   **Before**: 홈페이지(`page.tsx`)와 포스트 목록 페이지(`posts/page.tsx`)에서 각각 `map`을 사용하여 `PostCard`를 렌더링하는 중복된 코드가 존재했습니다.
-   **After**: 포스트 배열을 `props`로 받아 목록을 렌더링하는 `PostList.tsx` 컴포넌트를 추출하여 중복을 제거했습니다.

### `NoPosts` 컴포넌트 추출

-   **Before**: 여러 페이지에서 포스트가 없을 때 표시하는 UI가 중복 구현되어 있었습니다.
-   **After**: 아이콘, 제목, 설명 등을 `props`로 받는 재사용 가능한 `NoPosts.tsx` 컴포넌트를 추출하여 일관성을 높였습니다.

## 2. 서비스 레이어 리팩토링 (`/src/lib/services`)

### `post.service.ts` 쿼리 상수화

-   **Before**: `getRecentPosts`, `getAllPosts` 등 여러 함수에서 게시물 정보를 가져오는 `select` ���리문이 중복되었습니다.
-   **After**: 중복되는 쿼리문을 `POST_WITH_AUTHOR_AND_TAGS_QUERY` 상수로 추출하여 재사용하고 유지보수성을 향상시켰습니다.

### `comment.service.ts` 일관성 개선

-   **Before**: 다른 서비스와 달리 파일 상단에서 Supabase 클라이언트를 생성하고, 에러를 `throw`하는 등 일관성이 부족했습니다.
-   **After**: 각 함수 내에서 클라이언트를 생성하고, 에러 처리 방식을 다른 서비스와 동일하게 `console.error` 로깅 및 `null` 반환으로 통일하여 코드의 일관성을 확보했습니다.

## 3. 인증 및 네비게이션 리팩토링 (`Navbar`)

### `useAuth` 커스텀 훅 추출

-   **Before**: `Navbar.tsx` 내부에 인증 상태(`user`, `profile`, `isAdmin`), 로딩 상태, `onAuthStateChange` 리스너 등 복잡한 로직이 혼재했습니다.
-   **After**: 인증 관련 모든 로직을 `useAuth.ts` 커스텀 훅으로 분리하여 `Navbar`의 코드를 대폭 간소화하고, 인증 상태 로직의 재사용성을 높였습니다.

### `AuthButtons` 및 `UserMenu` 컴포넌트 분리

-   **Before**: `Navbar` 내에서 인증 상태에 따라 로그인 버튼, 사용자 메뉴 등을 조건부로 렌더링하여 코드가 복잡했습니다.
-   **After**:
    -   인증 상태에 따른 UI ���기 처리를 담당하는 `AuthButtons.tsx`를 생성했습니다.
    -   사용자 드롭다운 메뉴를 `UserMenu.tsx`로 분리했습니다.
    -   이를 통해 `Navbar`는 순수하게 네비게이션 구조만 담당하도록 책임이 명확해졌습니다.

## 4. 게시물 카드 리팩토링 (`PostCard`)

### `PostCardMeta` 및 `PostCardTags` 컴포넌트 분리

-   **Before**: `PostCard.tsx` 컴포넌트가 작성자 정보, 작성일, 읽는 시간, 태그 목록 등 모든 하위 UI를 직접 렌더링했습니다.
-   **After**:
    -   작성자 및 메타 정보를 `PostCardMeta.tsx`로 분리했습니다.
    -   태그 목록을 `PostCardTags.tsx`로 분리했습니다.
    -   `PostCard`는 이 컴포넌트들을 조합하는 역할만 하도록 하여 복잡도를 낮추고 각 UI 요소의 재사용성을 높였습니다.

## 5. 게시물 폼 리팩토링 (Dashboard)

### `PostForm` 컴포넌트 추출

-   **Before**: 게시물 생성 페이지(`new/page.tsx`)와 수정 페이지(`edit/page.tsx`)에 거의 동일한 폼 UI와 상태 관리, 핸들러 로직이 중복되어 있었습니다.
-   **After**: 공통 로직을 모두 `PostForm.tsx` 컴포넌트로 추출했습니다. 각 페이지는 `PostForm`에 `onSubmit` 함수와 초기 데이터(`initialData`)만 `props`로 전달하여 코드가 획기적으��� 간소화되고 유지보수성이 크게 향상되었습니다.
