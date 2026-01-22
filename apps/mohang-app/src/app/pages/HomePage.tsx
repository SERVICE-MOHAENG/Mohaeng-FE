import { useNavigate } from 'react-router-dom';
import { colors, typography } from '@mohang/ui';
import { useState, useEffect } from 'react';
import {
  Header,
  TravelCard,
  CourseSection,
  DestinationList,
  Destination,
  Globe,
  FloatingActionButton,
  BlogList,
  FeedGrid,
  FeedItem,
} from '@mohang/ui';

// 샘플 이미지 URL
const JAPAN_IMAGE =
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800';
const PARIS_IMAGE =
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800';
const NEWYORK_IMAGE =
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800';
const LONDON_IMAGE =
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800';
const BALI_IMAGE =
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800';
const OSAKA_CASTLE =
  'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800';

const destinations: Destination[] = [
  {
    id: '1',
    title: '일본 오사카',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    description: '병현이와 함께하는...',
    imageUrl: OSAKA_CASTLE,
  },
  {
    id: '2',
    title: '일본 도쿄',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    description: '병현이와 함께하는...',
    imageUrl: OSAKA_CASTLE,
  },
  {
    id: '3',
    title: '중국 홍콩',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    description: '병현이와 함께하는...',
    imageUrl: OSAKA_CASTLE,
  },
];

const sampleFeeds: FeedItem[] = [
  {
    id: '1',
    author: '손희찬',
    date: '2025.5.5',
    title: '일본 여행중 레전드 사건 발생',
    content:
      '제가 친구랑 일본 여행을 갔었는데요.. 진짜 대박적인 일이 발생해서 공유해봅니다. 도쿄 시부야 한복판에서...',
    imageUrl:
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000', // 시부야 거리
    likes: 1002,
    // avatarUrl이 없으면 컴포넌트에서 기본 갈색 배경이 나오도록 설정 가능
  },
  {
    id: '2',
    author: '김민수',
    date: '2025.5.10',
    title: '오사카 먹방 리스트 대공개',
    content:
      '이번 오사카 여행에서 먹었던 것 중 베스트 5를 뽑아봤습니다. 도톤보리 구석에 숨겨진 라멘집은 정말...',
    imageUrl:
      'https://images.unsplash.com/photo-1590233641133-3610067e8f4c?q=80&w=1000', // 음식/시장
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minsu', // 랜덤 아바타 예시
    likes: 854,
  },
  {
    id: '3',
    author: '이지원',
    date: '2025.5.15',
    title: '교토 감성 숙소 내돈내산 후기',
    content:
      '조용하고 고즈넉한 분위기를 원하신다면 이 숙소를 강력 추천드려요. 아침에 눈 떴을 때 창밖 정원 뷰가...',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000', // 교토 풍경
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiwon',
    likes: 1205,
  },
  {
    id: '4',
    author: '이지원',
    date: '2025.5.15',
    title: '교토 감성 숙소 내돈내산 후기',
    content:
      '조용하고 고즈넉한 분위기를 원하신다면 이 숙소를 강력 추천드려요. 아침에 눈 떴을 때 창밖 정원 뷰가...',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000', // 교토 풍경
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiwon',
    likes: 1205,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token && token !== 'undefined') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <section className="w-full">
          <Globe />
        </section>

        <div className="max-w-7xl mx-auto px-8">
          <section className="mt-8 mb-4">
            <div className="mb-4">
              <h1
                style={{
                  ...typography.headline.LHeadlineM,
                  color: colors.gray[800],
                }}
              >
                안녕하세요 김풍풍님
                <br />
                지금까지{' '}
                <span
                  style={{
                    ...typography.headline.LHeadlineM,
                    color: colors.primary[500],
                  }}
                >
                  14개국
                </span>
                을 여행했어요
              </h1>
            </div>
            <div className="w-1/4 h-[2px] bg-gray-200 mt-8 mb-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <h2
                className="mb-2"
                style={{ ...typography.title.TitleM, fontFamily: 'Paperozi' }}
              >
                모행 AI가 사용자에게 <br />
                <span
                  style={{
                    ...typography.title.TitleB,
                    color: colors.primary[500],
                  }}
                >
                  딱!
                </span>{' '}
                맞는 여행지를 찾았어요!
              </h2>
              <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
                모행의 AI가 사용자님의 정보를 기반으로
                <br />
                추천하는 해외 여행지입니다!
              </p>
            </div>
          </section>

          <section className="my-8 overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <TravelCard
                imageUrl={JAPAN_IMAGE}
                title="일본 도쿄"
                description="전통과 현대가 공존하는 일본의 수도. 시부야, 신주쿠, 아키하바라 등 다채로운 명소와 맛있는 스시, 라멘을 즐길 수 있는 도시"
              />
              <TravelCard
                imageUrl={PARIS_IMAGE}
                title="프랑스 파리"
                description="낭만의 도시 파리. 에펠탑, 루브르 박물관, 개선문 등 유명한 랜드마크와 세느강을 따라 펼쳐진 아름다운 풍경이 매력적인 곳"
              />
              <TravelCard
                imageUrl={NEWYORK_IMAGE}
                title="미국 뉴욕"
                description="잠들지 않는 도시. 자유의 여신상, 타임스퀘어, 센트럴파크 등 상징적인 명소와 브로드웨이 뮤지컬, 다양한 문화가 공존하는 대도시"
              />
              <TravelCard
                imageUrl={LONDON_IMAGE}
                title="영국 런던"
                description="역사와 전통이 살아있는 도시. 빅벤, 런던아이, 버킹엄 궁전 등 유서 깊은 건축물과 세계적인 박물관들이 가득한 문화의 중심지"
              />
              <TravelCard
                imageUrl={BALI_IMAGE}
                title="인도네시아 발리"
                description="신들의 섬 발리. 아름다운 해변과 계단식 논, 힌두 사원들이 어우러진 열대 낙원. 서핑과 요가, 스파를 즐기기에 완벽한 휴양지"
              />
            </div>
          </section>

          <section className="mt-20">
            <CourseSection />
            <DestinationList destinations={destinations} feeds={sampleFeeds} />
          </section>

          <section className="pb-16">
            <BlogList />
            <FeedGrid feeds={sampleFeeds} />
          </section>
        </div>
      </main>
      <FloatingActionButton onClick={() => navigate('/create-trip')} />
    </div>
  );
}

export default HomePage;
