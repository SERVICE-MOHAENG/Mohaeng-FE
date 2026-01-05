import { useNavigate } from 'react-router-dom';
import { Header, TravelCard, CourseSection, DestinationList, Destination, Globe, FloatingActionButton } from '@mohang/ui';

// 샘플 이미지 URL
const JAPAN_IMAGE = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800';
const PARIS_IMAGE = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800';
const NEWYORK_IMAGE = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800';
const LONDON_IMAGE = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800';
const BALI_IMAGE = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800';
const OSAKA_CASTLE = 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800';

const destinations: Destination[] = [
  {
    id: '1',
    title: '일본 오사카',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    imageUrl: OSAKA_CASTLE,
  },
  {
    id: '2',
    title: '일본 오사카',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    imageUrl: OSAKA_CASTLE,
  },
  {
    id: '3',
    title: '일본 오사카',
    duration: '3일 일정',
    tags: ['금요일 저녁 출발', '가족여행'],
    imageUrl: OSAKA_CASTLE,
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header notificationCount={3} />
      <main>
        <section className="w-full">
          <Globe />
        </section>

        <div className="max-w-7xl mx-auto px-8">
          <section className="mt-8 mb-4">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-800 leading-snug">
                안녕하세요 김풍풍님<br />
                지금까지 <span className="text-blue-600">14개국</span>을 여행했어요
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Paperozi' }}>AI가 추천하는 여행지</h2>
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

          <section className="mt-12 pb-16">
            <CourseSection />
            <DestinationList destinations={destinations} />
          </section>
        </div>
      </main>
      <FloatingActionButton onClick={() => navigate('/create-trip')} />
    </div>
  );
}

export default HomePage;
