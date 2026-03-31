import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { colors, typography, addLike, removeLike } from '@mohang/ui';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts, type FeedItem } from '../hooks/useLikeCounts';
export type { FeedItem };

export interface Destination {
  id: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
  imageUrl: string;
  isLiked?: boolean;
  is_liked?: boolean;
  isBookmarked?: boolean;
  likeCount?: number;
  isMyPlan?: boolean;
  userName?: string;
  authorName?: string;
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
  variant?: 'carousel' | 'list';
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
  variant = 'carousel',
}: DestinationListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 애니메이션 상태 관리를 위한 투명도(Opacity) 스테이트
  const [isFading, setIsFading] = useState(false);
  const visibleDestinations = useMemo(() => destinations.slice(0, 5), [destinations]);
  const touchStartX = useRef<number | null>(null);
  const [displayDest, setDisplayDest] = useState<Destination | undefined>(
    visibleDestinations[0],
  );

  const combinedFeeds = useMemo(() => {
    const baseFeeds = feeds || [];
    const destFeeds: FeedItem[] = visibleDestinations.map((d) => ({
      id: d.id,
      author: '',
      date: '',
      title: d.title,
      content: d.description,
      imageUrl: d.imageUrl,
      likes: d.likeCount || 0,
      isLiked: d.isLiked || d.is_liked,
    }));
    return [...baseFeeds, ...destFeeds];
  }, [feeds, visibleDestinations]);

  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({
    feeds: combinedFeeds,
    onLike: (id) => addLike(id),
    onUnlike: (id) => removeLike(id),
  });

  // destinations가 변경될 때 초기화 (MUST be before any early return)
  useEffect(() => {
    if (visibleDestinations.length > 0) {
      setCurrentIndex(0);
      setDisplayDest(visibleDestinations[0]);
      if (visibleDestinations[0]?.id) {
        onActiveIdChange?.(visibleDestinations[0].id);
      }
    }
  }, [visibleDestinations, onActiveIdChange]);

  // displayDest가 아직 설정되지 않았거나 초기값일 때를 대비해 안전하게 합칩니다.
  const currentDest = displayDest || visibleDestinations[currentIndex];
  const currentFeed = feeds?.find((feed) => feed.id === currentDest?.id);

  if (!visibleDestinations || visibleDestinations.length === 0) {
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
      const nextDest = visibleDestinations[nextIdx];
      setDisplayDest(nextDest);
      setIsFading(false);
      if (nextDest?.id) {
        onActiveIdChange?.(nextDest.id);
      }
    }, 200);
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % visibleDestinations.length;
    handleSlideChange(nextIdx);
  };

  const prevSlide = () => {
    const nextIdx =
      currentIndex === 0 ? visibleDestinations.length - 1 : currentIndex - 1;
    handleSlideChange(nextIdx);
  };

  // const handleLoadMapClick = () => {
  //   //로드맵 보러가기
  // };

  const handleAddLike = (courseId: string) => {
    onAddLike?.(courseId);
    handleHeartClick(courseId);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || totalPages <= 1) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 50) return;

    if (deltaX < 0 && page < totalPages) {
      onPageChange?.(page + 1);
    }

    if (deltaX > 0 && page > 1) {
      onPageChange?.(page - 1);
    }
  };

  if (variant === 'list') {
    return (
      <div
        className="flex flex-col gap-5 py-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {visibleDestinations.map((destination) => {
          const destinationFeed = feeds?.find((feed) => feed.id === destination.id);
          const isLiked = hearts[destination.id] ?? destination.is_liked ?? destination.isLiked;
          const likeCount =
            likeCounts[destination.id] ?? destination.likeCount ?? destinationFeed?.likes ?? 0;

          return (
            <div
              key={destination.id}
              className="flex items-center gap-8 rounded-[28px] border border-gray-100 bg-white px-8 py-7 shadow-[0_12px_35px_-20px_rgba(15,23,42,0.35)]"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="truncate text-[28px] font-black text-gray-900">
                    {destination.title}
                  </h3>
                  <span className="shrink-0 text-sm font-semibold text-gray-400">
                    {destination.duration}
                  </span>
                </div>

                <p className="mb-5 line-clamp-2 text-base font-medium text-gray-400">
                  {destination.description}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {destination.tags.map((tag, index) => (
                    <span
                      key={`${destination.id}-${tag}-${index}`}
                      className="rounded-full border border-[#dff5ff] bg-white px-4 py-1.5 text-sm font-bold text-[#4fcfff] shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-4 self-stretch justify-center">
                <button
                  className="flex flex-col items-center gap-1 rounded-full p-1 transition-colors hover:bg-gray-50"
                  onClick={() => handleAddLike(destination.id)}
                  aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                    <img
                      src={isLiked ? RedHeart : Heart}
                      alt="heart"
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">
                    {likeCount.toLocaleString()}
                  </span>
                </button>

                <Link
                  to={`/plan-detail/${destination.id}`}
                  state={{
                    isCourseView: true,
                    isMyPlan: destination?.isMyPlan,
                    authorName: destination?.userName || (destination as any)?.authorName,
                  }}
                  className="rounded-full border border-[#00c7f2] px-6 py-2.5 text-sm font-black text-[#00c7f2] transition-all hover:bg-[#00c7f2] hover:text-white"
                >
                  바로가기
                </Link>
              </div>
            </div>
          );
        })}

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-400 shadow-sm transition-all hover:border-gray-300 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous page"
            >
              <span className="-mt-0.5">‹</span>
            </button>

            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === page;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => onPageChange?.(pageNumber)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    isActive ? 'bg-[#00c7f2] scale-110' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Page ${pageNumber}`}
                />
              );
              })}
            </div>

            <button
              type="button"
              onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-400 shadow-sm transition-all hover:border-gray-300 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Next page"
            >
              <span className="-mt-0.5">›</span>
            </button>
          </div>
        )}
      </div>
    );
  }

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
          <div className="absolute top-8 right-8 flex flex-col items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => handleAddLike(currentDest.id)}
              aria-label={
                (hearts[currentDest.id] ?? currentDest.is_liked ?? currentDest.isLiked) 
                  ? '좋아요 취소' : '좋아요'
              }
            >
              <div className="w-14 h-14 flex justify-center items-center rounded-full border border-gray-100 shadow-sm bg-white">
                {(hearts[currentDest.id] ?? currentDest.is_liked ?? currentDest.isLiked) ? (
                  <img src={RedHeart} alt="heart" className="w-[22px] h-[22px]" />
                ) : (
                  <img src={Heart} alt="heart" className="w-[22px] h-[22px]" />
                )}
              </div>
            </button>
            <span className="text-xs font-bold text-gray-400 mt-1">
              {(
                likeCounts[currentDest.id] ?? currentDest.likeCount ?? (currentFeed ? currentFeed.likes : 0)
              ).toLocaleString()}
            </span>
          </div>

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
                to={`/plan-detail/${currentDest?.id}`}
                state={{ 
                  isCourseView: true,
                  isMyPlan: currentDest?.isMyPlan,
                  authorName: currentDest?.userName || (currentDest as any)?.authorName
                }}
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
        {visibleDestinations.map((_, index) => (
          <div
            key={index}
            className={`w-10 h-[3px] rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-gray-600 w-12' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
