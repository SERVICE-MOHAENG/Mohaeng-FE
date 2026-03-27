import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { colors, typography, addLike, removeLike } from '@mohang/ui';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts } from '../hooks/useLikeCounts';

export interface Destination {
  id: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
  imageUrl: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface FeedItem {
  id: string;
  author: string;
  date: string;
  title: string;
  content: string;
  imageUrl: string;
  avatarUrl?: string;
  likes: number;
}

interface DestinationListProps {
  destinations: Destination[];
  feeds?: FeedItem[];
  onAddLike?: (courseId: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onActiveIdChange?: (id: string) => void;
  isLoading?: boolean;
}

export function DestinationList({
  destinations,
  feeds,
  onAddLike,
  page = 1,
  totalPages = 0,
  onPageChange,
  onActiveIdChange,
  isLoading = false,
}: DestinationListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 애니메이션 상태 관리를 위한 투명도(Opacity) 스테이트
  const [isFading, setIsFading] = useState(false);
  const [displayDest, setDisplayDest] = useState<Destination | undefined>(
    destinations[0],
  );
  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({
    feeds,
    onLike: (id) => addLike(id),
    onUnlike: (id) => removeLike(id),
  });

  // destinations가 변경될 때 초기화 (MUST be before any early return)
  useEffect(() => {
    if (destinations.length > 0) {
      setCurrentIndex(0);
      setDisplayDest(destinations[0]);
      if (destinations[0]?.id) {
        onActiveIdChange?.(destinations[0].id);
      }
    }
  }, [destinations, onActiveIdChange]);

  // displayDest가 아직 설정되지 않았거나 초기값일 때를 대비해 안전하게 합칩니다.
  const currentDest = displayDest || destinations[currentIndex];
  const currentFeed = feeds?.find((feed) => feed.id === currentDest?.id);

  if (!destinations || destinations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center text-gray-400">표시할 여행지가 없습니다.</div>
        <div className="flex justify-center">
          <Link
            to="/discover"
            className="px-7 py-2.5 border-2 border-[#00c7f2] text-[#00c7f2] rounded-full hover:bg-[#00c7f2] hover:text-white transition-all"
            style={{ ...typography.body.BodyM }}
          >
            로드맵 보러가기
          </Link>
        </div>
      </div>
    );
  }

  // 슬라이드 전환 로직 (핵심: 옅어짐 -> 데이터 교체 -> 나타남)
  const handleSlideChange = (nextIdx: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      const nextDest = destinations[nextIdx];
      setDisplayDest(nextDest);
      setIsFading(false);
      if (nextDest?.id) {
        onActiveIdChange?.(nextDest.id);
      }
    }, 200);
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % destinations.length;
    handleSlideChange(nextIdx);
  };

  const prevSlide = () => {
    const nextIdx =
      currentIndex === 0 ? destinations.length - 1 : currentIndex - 1;
    handleSlideChange(nextIdx);
  };

  // const handleLoadMapClick = () => {
  //   //로드맵 보러가기
  // };

  const handleAddLike = (courseId: string) => {
    handleHeartClick(courseId);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-12">
      <div className="relative flex items-center justify-center w-full max-w-5xl px-16">
        {/* 왼쪽 화살표 */}
        <button
          className="absolute left-0 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-400 hover:text-gray-800 transition-all active:scale-90"
          onClick={prevSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* 카드 본체: isFading 값에 따라 opacity 조절 */}
        <div
          className={`relative flex w-full max-w-3xl bg-white rounded-[40px] p-10 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.06)] border border-gray-50 flex-col transition-all duration-300 ease-in-out 
            ${isFading ? 'opacity-50 ' : 'opacity-100 '}`}
        >
          {/* 하단 좋아요 섹션이 우측 상단으로 이동 */}
          {currentFeed && (
            <div className="absolute top-8 right-8 flex flex-col items-center">
              <button
                className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => handleAddLike(currentFeed.id)}
                aria-label={
                  hearts[currentFeed.id] ? '좋아요 취소' : '좋아요'
                }
              >
                <div className="w-14 h-14 flex justify-center items-center rounded-full border border-gray-100 shadow-sm bg-white">
                  {hearts[currentFeed.id] ? (
                    <img src={RedHeart} alt="heart" className="w-[22px] h-[22px]" />
                  ) : (
                    <img src={Heart} alt="heart" className="w-[22px] h-[22px]" />
                  )}
                </div>
              </button>
              <span className="text-xs font-bold text-gray-400 mt-1">
                {(
                  likeCounts[currentFeed.id] ?? currentFeed.likes
                ).toLocaleString()}
              </span>
            </div>
          )}

          {/* 정보 섹션 */}
          <div className="w-full">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-[28px] font-black text-gray-900 leading-tight">
                {currentDest?.title}
              </h2>
              <span className="text-lg font-medium text-gray-400">
                {currentDest?.duration}
              </span>
            </div>

            <p className="text-gray-400 text-lg font-medium mb-12">
              {currentDest?.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-2.5">
                {currentDest?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-5 py-2 rounded-full shadow-sm bg-white border border-gray-100 transition-all font-bold text-sm"
                    style={{
                      color: colors.primary[400],
                      fontFamily: 'Paperozi',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/trip/${currentDest?.id}`}
                className="px-8 py-3.5 border border-[#00c7f2] text-[#00c7f2] rounded-full text-base font-black hover:bg-[#00c7f2] hover:text-white transition-all shadow-sm"
              >
                바로가기
              </Link>
            </div>
          </div>
        </div>

        {/* 오른쪽 화살표 */}
        <button
          className="absolute right-0 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-400 hover:text-gray-800 transition-all active:scale-90"
          onClick={nextSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* 하단 페이지네이션 바 - 중앙 정렬 */}
      <div className="flex justify-center gap-3">
        {destinations.map((_, index) => (
          <div
            key={index}
            className={`w-10 h-[3px] rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-gray-600 w-12' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
        >
          이전
        </button>
        <span style={{ ...typography.label.labelM, color: colors.gray[600] }}>
          {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
        >
          다음
        </button>
      </div>

      {/* 로드맵 보러가기 */}
      <div className="flex justify-center mt-10 mb-4">
        <Link
          to={`/trip/${currentDest?.id}`}
          className="px-7 py-2.5 border-2 border-[#00c7f2] text-[#00c7f2] rounded-full hover:bg-[#00c7f2] hover:text-white transition-all"
          style={{ ...typography.body.BodyM }}
        >
          로드맵 보러가기
        </Link>
      </div>
    </div>
  );
}
