import { MyPage as MyPageComponent, Header } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import { Destination } from '@mohang/ui';
import { FeedItem } from '@mohang/ui';

export function MyPage() {
  const navigate = useNavigate();

  const mockUser = {
    name: '김풍풍',
    email: 'kimpoong@example.com',
    totalTrips: 8,
    totalCountries: 16,
    diaryCount: 8,
    bookmarkCount: 12,
  };

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

  const handleAction = (type: string) => {
    console.log(`${type} 실행`);
    // 각 메뉴에 맞는 로직 추가
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <MyPageComponent
        feeds={sampleFeeds}
        destinations={destinations}
        user={mockUser}
        onAction={handleAction}
      />
    </div>
  );
}

export default MyPage;
