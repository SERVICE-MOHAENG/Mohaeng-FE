import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { colors, typography } from '@mohang/ui';

export interface Destination {
  id: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface DestinationListProps {
  destinations: Destination[];
}

export function DestinationList({ destinations }: DestinationListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 애니메이션 상태 관리를 위한 투명도(Opacity) 스테이트
  const [isFading, setIsFading] = useState(false);
  // 실제로 화면에 보여줄 데이터 스테이트 (애니메이션 중간에 교체하기 위함)
  const [displayDest, setDisplayDest] = useState(destinations[0]);

  // 슬라이드 전환 로직 (핵심: 옅어짐 -> 데이터 교체 -> 나타남)
  const handleSlideChange = (nextIdx: number) => {
    setIsFading(true); // 1. 투명도를 낮춤

    setTimeout(() => {
      setCurrentIndex(nextIdx); // 2. 인덱스 변경
      setDisplayDest(destinations[nextIdx]); // 3. 표시 데이터 교체
      setIsFading(false); // 4. 다시 나타남
    }, 200); // 0.2초(애니메이션 속도) 후에 교체
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
          className={`flex w-full max-w-3xl bg-white rounded-[40px] p-8 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.08)] border border-gray-50 items-center transition-all duration-300 ease-in-out 
            ${isFading ? 'opacity-50 ' : 'opacity-100 '}`}
        >
          {/* 이미지 공간 */}
          <div className="w-40 h-40 shrink-0 rounded-[32px] overflow-hidden shadow-inner">
            <img
              src={displayDest.imageUrl}
              alt={displayDest.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 정보 섹션 */}
          <div className="ml-8 flex-grow">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {displayDest.title}
              </h2>
              <span className="text-sm font-medium text-gray-400">
                {displayDest.duration}
              </span>
            </div>

            <p className="text-gray-500 text-base mb-8">
              {displayDest.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {displayDest.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full border shadow-[0_15px_50px_-3px_rgba(0,0,0,0.2)] transition-all"
                    style={{
                      ...typography.body.BodyM,
                      color: colors.primary[500],
                      borderColor: colors.gray[200],
                      fontFamily: 'Paperozi',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/trip/${displayDest.id}`}
                className="px-7 py-2.5 border-2 border-[#00c7f2] text-[#00c7f2] rounded-full text-sm font-bold hover:bg-[#00c7f2] hover:text-white transition-all"
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

      {/* 하단 페이지네이션 바 */}
      <div className="flex gap-2.5">
        {destinations.map((_, index) => (
          <div
            key={index}
            className={`w-10 h-1 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <button
        className="mt-4 px-6 py-2 border rounded-full border-[#00c7f2] text-[#00c7f2] hover:bg-[#00c7f2] hover:text-white transition-all"
        style={{
          ...typography.body.BodyM,
          fontFamily: 'Paperozi',
        }}
      >
        로드 맵 보러가기
      </button>
    </div>
  );
}
