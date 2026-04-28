# MoHaeng 현재 디자인 시스템 감사

검토일: 2026-04-28

이 문서는 현재 저장소 안에서 실제로 사용 중인 디자인 자산을 기준으로 정리한 자료다. 별도의 Storybook, Figma 파일, 공식 디자인 문서는 저장소에서 확인되지 않았고, 따라서 이 문서는 코드 기반 인벤토리 역할을 한다.

## 1. 범위

우선순위가 높은 화면과 시스템만 추렸다.

- 제품 기준 앱: `apps/mohang-app`
- 공용 UI/토큰: `libs/ui`
- 공용 글로벌 스타일: `libs/util-config`
- 핵심 사용자 흐름
- 랜딩
- 로그인/회원가입/비밀번호 재설정
- 홈/탐색
- 여행 성향 설문
- 여행지 선택
- 일정 상세/여행 상세
- 캘린더
- 마이페이지/블로그/피드백

## 2. 현재 디자인 스택

- React 19 기반 화면 구성
- Tailwind CSS 3.4 사용
- 공용 디자인 토큰은 `libs/ui/src/tokens`에 존재
- 많은 화면이 Tailwind 클래스와 inline style 토큰을 혼용
- 동적 모션은 `framer-motion` 사용
- Tailwind theme 확장은 현재 비어 있음

정리하면, "토큰 파일은 있지만 완전히 토큰 중심으로 운영되는 시스템"은 아니다. 현재는 다음 3가지가 같이 돌아간다.

- Tailwind 유틸리티
- `colors`, `typography` 토큰 객체
- 화면별 하드코딩된 색/그라디언트/폰트

## 3. 디자인 파운데이션

### 3.1 컬러

기본 브랜드 컬러는 `libs/ui/src/tokens/colors.ts`에 정의되어 있다.

| 그룹 | 값 | 현재 의미 |
| --- | --- | --- |
| `primary.500` | `#00CCFF` | 메인 CTA, 활성 상태, 강조 포인트 |
| `primary.50` | `#E1F9FF` | 선택 배경, 보조 강조 배경 |
| `primary.600` | `#54B5CC` | 보조 강조 텍스트 |
| `primary.700` | `#4391A3` | 선택 텍스트, 진한 보조 포인트 |
| `primary.900` | `#152D33` | 매우 진한 브랜드 계열 |
| `gray.50` | `#FAFAFA` | 약한 배경 |
| `gray.200` | `#D4D4D8` | 보더, 비활성 구분선 |
| `gray.300` | `#A1A1AA` | 서브 텍스트, 약한 텍스트 |
| `gray.400` | `#6B6B6B` | 설명 텍스트 |
| `gray.700` | `#262626` | 본문/중요 텍스트 |
| `gray.800` | `#171717` | 제목/강조 텍스트 |
| `system.500` | `#F61C1C` | 에러 상태 |
| `yellowGreen.yellow100` | `#FEE500` | 카카오 버튼 |
| `yellowGreen.green100` | `#00C950` | 네이버 버튼 |

추가로 실제 화면에서는 다음 하드코딩이 반복된다.

- `linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)`
- `bg-[#00CCFF]`
- `#0099FF`
- `#3ADD0D`

즉, 브랜드 컬러의 중심은 분명하지만, 아직 "토큰만으로 닫힌" 상태는 아니다.

### 3.2 타이포그래피

타이포그래피는 현재 3계층으로 나뉘어 있다.

| 계층 | 실제 사용처 | 특징 |
| --- | --- | --- |
| `Pretendard` | `libs/ui/src/tokens/typography.ts` | 공용 토큰 정의의 기준 폰트 |
| `GMarketSans` | `apps/mohang-app/src/styles.css` | 앱 전역 body 폰트 |
| `Paperozi` | `libs/util-config/src/styles/global.css`, 일부 제목/브랜드 영역 | 브랜딩 강조용으로 혼용 |

현재 typography 토큰은 다음 레벨로 나뉜다.

- `headline`
- `title`
- `body`
- `label`

하지만 실제 렌더링에서는 다음 문제가 있다.

- 전역 body는 `GMarketSans`
- 토큰은 `Pretendard`
- 브랜딩/제목 일부는 `Paperozi`

따라서 현재 프로젝트는 "폰트 시스템이 단일 소스 오브 트루스가 아닌 상태"다.

### 3.3 형태 언어

반복되는 형태 언어는 비교적 일관적이다.

- 라운드가 큰 카드: `rounded-xl`, `rounded-2xl`, `rounded-[24px]`, `rounded-[32px]`
- 필 버튼/칩: 국가 선택, 정렬 탭, 최근 검색, CTA
- 흰색 바탕 위 회색 보더 + 시안 포인트
- 이미지 중심 카드 위에 어두운 오버레이
- 고정형 CTA 또는 플로팅 CTA
- 배경 블러와 글래스 스타일 버튼 일부 사용

### 3.4 모션

모션 사용은 과하지 않고, 중요 플로우에서만 쓰인다.

- 랜딩 페이지: staggered reveal, section 전환
- 여행지 선택: hero slider 전환
- Alert/Modal: scale + fade

## 4. 공용 디자인 시스템 자산

### 4.1 공용 토큰

- `libs/ui/src/tokens/colors.ts`
- `libs/ui/src/tokens/typography.ts`

현재 존재하는 토큰은 색상과 타이포그래피뿐이다. 다음은 아직 토큰화되어 있지 않다.

- spacing
- radius
- shadow
- z-index
- motion duration/easing

### 4.2 공용 컴포넌트

핵심 공용 UI는 `libs/ui/src/lib`에 모여 있다.

| 컴포넌트 | 역할 | 디자인 특징 |
| --- | --- | --- |
| `Header` | 전역 상단 내비게이션 | 흰색 바탕, 얇은 보더, sticky 헤더 |
| `Input` | 폼 입력 | 큰 패딩, rounded, 에러 상태 시 red border |
| `LoadingScreen` | 로딩 오버레이 | 흰색 반투명 배경 + blur + 스피너 |
| `TravelCard` | 대표 여행 카드 | 큰 이미지, 어두운 오버레이, 좋아요 버튼 |
| `CourseSection` | 국가 필터 | pill 버튼 그룹 |
| `BlogList` | 블로그 정렬 필터 | pill 버튼 그룹 + Paperozi 제목 |
| `FloatingActionButton` | 생성 CTA | 시안 원형 pill + 강한 그림자 |

이 공용 컴포넌트들이 사실상 현재 디자인 시스템의 최소 단위다.

## 5. 가장 중요한 화면별 디자인 정리

### 5.1 Tier 1: 브랜드 첫인상과 진입

#### 랜딩

파일

- `apps/mohang-app/src/app/pages/LandingPage.tsx`

핵심 디자인 형식

- 풀스크린 섹션 스냅
- 어두운 배경 위 인터랙티브 globe
- 브랜드 시안 그라디언트 텍스트 강조
- 유리 질감의 플로팅 네비게이션 버튼
- 대형 카피 중심의 몰입형 히어로

현재 프로젝트에서 가장 "브랜드 톤"이 강한 화면이다. 다른 화면보다 더 실험적이고 시각 밀도가 높다.

#### 로그인/인증

파일

- `apps/mohang-app/src/app/pages/LoginPage.tsx`
- `apps/mohang-app/src/app/pages/signUp/*`

핵심 디자인 형식

- 데스크톱에서 좌우 분할 레이아웃
- 왼쪽은 감성 이미지와 오버레이 카피
- 오른쪽은 클린한 폼 중심 레이아웃
- 소셜 로그인 버튼은 공급자 브랜드 색 유지
- 모달, OTP 입력, 비밀번호 재설정까지 동일 스타일 언어 유지

랜딩이 감성 중심이라면, 인증 화면은 "브랜드를 유지한 채 서비스형 폼 UI로 전환"하는 역할을 한다.

### 5.2 Tier 1: 메인 제품 경험

#### 홈/탐색

파일

- `apps/mohang-app/src/app/pages/HomePage.tsx`
- `apps/mohang-app/src/app/pages/DiscoverPage.tsx`
- `libs/ui/src/lib/TravelCard.tsx`
- `libs/ui/src/lib/CourseSection.tsx`
- `libs/ui/src/lib/BlogList.tsx`
- `libs/ui/src/lib/FeedGrid.tsx`
- `libs/ui/src/lib/DestinationList.tsx`

핵심 디자인 형식

- 흰색 기반 콘텐츠 레이아웃
- 시안 포인트로 선택 상태와 CTA 표현
- 카드, 리스트, 필터 칩의 반복
- 여행 사진이 핵심 시각 자산
- 피드/블로그/추천 코스가 모듈 단위로 조립됨

이 영역은 랜딩보다 보수적이며, 실제 제품의 기본 디자인 언어를 가장 잘 보여준다.

#### 여행 성향 설문

파일

- `apps/mohang-app/src/app/pages/SurveyPage/index.tsx`
- `apps/mohang-app/src/app/pages/PeopleCountPage.tsx`
- `apps/mohang-app/src/app/pages/CompanionPage.tsx`
- `apps/mohang-app/src/app/pages/TravelConceptPage.tsx`
- `apps/mohang-app/src/app/pages/TravelStylePage.tsx`
- `apps/mohang-app/src/app/pages/TravelRequirementPage.tsx`

핵심 디자인 형식

- 단일 컬럼 wizard
- 진행 상태 인디케이터
- 카드형 선택지
- 선택 상태는 `primary.50` 배경 + `primary.500` border
- CTA는 항상 강한 시안 버튼

이 플로우는 현재 서비스의 추천 경험을 시각적으로 구조화하는 핵심 패턴이다. "질문 제목 + 보조 설명 + 선택 카드 + 하단 CTA"가 반복 규칙이다.

#### 여행지 선택

파일

- `apps/mohang-app/src/app/pages/TravelSelectionPage/index.tsx`
- `apps/mohang-app/src/app/pages/TravelSelectionPage/TravelHeroSlider.tsx`
- `apps/mohang-app/src/app/pages/TravelSelectionPage/TravelInfo.tsx`
- `apps/mohang-app/src/app/pages/TravelSelectionPage/TravelSearchBar.tsx`
- `apps/mohang-app/src/app/pages/TravelSelectionPage/TravelIndicator.tsx`
- `apps/mohang-app/src/app/pages/TravelSelectionPage/RecentSearchList.tsx`

핵심 디자인 형식

- large hero image carousel
- 좌우 미리보기 카드
- 검색창 + 제안 리스트
- 최근 검색 칩
- 국가/도시 탐색을 시각적으로 전면 배치

설문이 구조적이고 폼 중심이라면, 여행지 선택은 더 이미지 중심이고 탐색적인 레이아웃이다.

### 5.3 Tier 1: 일정 소비와 편집

#### 일정 상세 / 여행 상세

파일

- `apps/mohang-app/src/app/pages/PlanDetailPage/index.tsx`
- `apps/mohang-app/src/app/pages/PlanDetailPage/components/ScheduleSidebar.tsx`
- `apps/mohang-app/src/app/pages/PlanDetailPage/components/MapSection.tsx`
- `apps/mohang-app/src/app/pages/PlanDetailPage/components/ChatSidebar.tsx`
- `apps/mohang-app/src/app/pages/PlanDetailPage/components/PlanInfo.tsx`
- `apps/mohang-app/src/app/pages/TripDetailPage.tsx`

핵심 디자인 형식

- 지도 + 일정 + 채팅 사이드바의 복합 레이아웃
- 시간순 스케줄 타임라인
- 시안 그라디언트 CTA
- 선택된 일정 항목 하이라이트
- AI 편집 경험과 일정 소비 경험이 한 화면에 결합

이 영역은 가장 복잡한 제품 화면이며, 기능과 정보 밀도가 가장 높다.

#### 캘린더

파일

- `apps/mohang-app/src/app/pages/CalendarPage/index.tsx`
- `apps/mohang-app/src/app/pages/CalendarPage/CalendarSidebar.tsx`
- `apps/mohang-app/src/app/pages/CalendarPage/CalendarGrid.tsx`
- `apps/mohang-app/src/app/pages/CalendarPage/CalendarHeader.tsx`
- `apps/mohang-app/src/app/pages/CalendarPage/CalendarFooter.tsx`

핵심 디자인 형식

- 좌측 목적지 리스트 + 중앙 캘린더 그리드
- 날짜 상태 색상으로 선택 범위 표시
- 푸터 CTA로 다음 액션 유도
- 타이포와 컬러 토큰 사용 비중이 높음

이 화면은 현재 코드베이스에서 토큰 사용이 비교적 잘 드러나는 편이다.

### 5.4 Tier 2: 보조 제품 경험

#### 마이페이지 / 블로그 / 피드백

파일

- `apps/mohang-app/src/app/pages/MyPage.tsx`
- `apps/mohang-app/src/app/pages/BlogWritePage.tsx`
- `apps/mohang-app/src/app/pages/BlogDetailPage.tsx`
- `apps/mohang-app/src/app/pages/FeedbackPage.tsx`

역할

- 사용자 프로필/설정
- 콘텐츠 작성/소비
- 사용자 의견 수집

이 영역은 메인 추천 플로우보다 후순위지만, 전체 브랜드 완성도에는 영향을 준다.

## 6. 현재 디자인 시스템의 문제점

### 6.1 타이포그래피 기준이 분산되어 있음

현재는 한 프로젝트 안에 다음이 동시에 존재한다.

- `Pretendard` 토큰 시스템
- `GMarketSans` 전역 body
- `Paperozi` 브랜드 강조

이 구조에서는 다음 문제가 생긴다.

- 화면별 폰트 결이 달라짐
- 컴포넌트 재사용 시 의도치 않은 인상 차이 발생
- 디자이너/개발자 기준 문서화가 어려움

### 6.2 Tailwind theme와 토큰이 연결되지 않음

`apps/mohang-app/tailwind.config.js`의 `theme.extend`는 비어 있다.

즉 현재는 다음 방식이 혼재한다.

- `text-gray-400`
- `style={{ color: colors.gray[400] }}`
- `bg-[#00CCFF]`

이는 유지보수 비용을 높인다.

### 6.3 색상과 그라디언트가 반복 하드코딩됨

현재 프로젝트의 대표 CTA 그라디언트는 여러 파일에 직접 문자열로 반복된다.

- `Alert`
- `PlanDetailPage`
- `ScheduleSidebar`
- `TripDetailPage`

이 패턴은 추후 브랜드 컬러 변경 시 수정 비용을 키운다.

### 6.4 토큰 범위가 좁음

현재 토큰은 색상과 타이포만 있고, 다음은 없다.

- spacing scale
- radius scale
- shadow scale
- layout width scale
- animation preset

그래서 비슷한 컴포넌트라도 그림자, radius, padding 값이 화면마다 조금씩 달라질 수 있다.

### 6.5 공용 primitive 레벨이 약함

현재는 공용 컴포넌트가 있긴 하지만 다음 primitive는 아직 시스템화가 덜 됐다.

- Button
- Chip / Pill
- Card base
- Modal base
- Empty state
- Section title block

실제로 같은 역할의 버튼이 여러 화면에서 각자 구현되어 있다.

## 7. 지금 기준으로 가장 중요한 디자인 자산

이 프로젝트에서 실무적으로 가장 중요한 자료는 아래 순서다.

1. `libs/ui/src/tokens/colors.ts`
2. `libs/ui/src/tokens/typography.ts`
3. `apps/mohang-app/src/styles.css`
4. `libs/ui/src/lib/Header.tsx`
5. `libs/ui/src/lib/Input.tsx`
6. `libs/ui/src/lib/TravelCard.tsx`
7. `apps/mohang-app/src/app/pages/LandingPage.tsx`
8. `apps/mohang-app/src/app/pages/LoginPage.tsx`
9. `apps/mohang-app/src/app/pages/HomePage.tsx`
10. `apps/mohang-app/src/app/pages/SurveyPage/index.tsx`
11. `apps/mohang-app/src/app/pages/TravelSelectionPage/index.tsx`
12. `apps/mohang-app/src/app/pages/PlanDetailPage/index.tsx`
13. `apps/mohang-app/src/app/pages/CalendarPage/index.tsx`

이 목록이 사실상 "현재 MoHaeng 디자인 시스템의 살아있는 소스"다.

## 8. 다음 단계 제안

문서를 기준으로 바로 정리한다면 우선순위는 아래가 적절하다.

1. 폰트 전략을 하나의 체계로 통합한다.
2. 색상/타입 토큰을 CSS 변수 또는 Tailwind theme로 연결한다.
3. Button, Chip, Card, Modal primitive를 공용 컴포넌트로 승격한다.
4. 자주 쓰는 그라디언트와 그림자를 토큰화한다.
5. 핵심 화면 6개를 기준으로 Figma 또는 Storybook 문서를 만든다.

현재 상태를 한 줄로 요약하면 이렇다.

"브랜드 색과 제품 톤은 이미 분명하지만, 시스템 레벨에서는 아직 코드 중심의 반정형 디자인 시스템 단계다."
