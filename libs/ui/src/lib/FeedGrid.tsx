import { Link } from 'react-router-dom';
import { colors, typography } from '@mohang/ui';
import Heart from '../assets/heart.svg';
import RedHeart from '../assets/redHeart.svg';
import { useState } from 'react';

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

export interface FeedGridProps {
  feeds: FeedItem[];
}

export function FeedGrid({ feeds }: FeedGridProps) {
  const [hearts, setHearts] = useState<Record<string, boolean>>({});

  const handleHeartClick = (id: string) => {
    setHearts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div className="flex flex-col justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {feeds.map((feed) => (
          <div key={feed.id} className="group cursor-pointer">
            {/* 이미지 섹션 */}
            <div className="relative mb-4">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <img
                  src={feed.imageUrl}
                  alt={feed.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 프로필 아바타 뱃지 (이미지 우측 하단 겹침) */}
              <div className="absolute flex items-center justify-center -bottom-5 right-8 w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                <div className="w-2/3 h-2/3 rounded-full">
                  {feed.avatarUrl ? (
                    <img
                      src={feed.avatarUrl}
                      alt={feed.author}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#5D2B26] rounded-full" /> // 이미지 속 갈색 아바타 예시
                  )}
                </div>
              </div>
            </div>

            {/* 텍스트 정보 섹션 */}
            <div className="px-1 flex justify-between items-start">
              <div className="flex-1">
                {/* 작성자 및 날짜 */}
                <div
                  className="flex items-center gap-1 text-gray-500 mb-2"
                  style={{
                    ...typography.body.BodyM,
                  }}
                >
                  <span>{feed.author}</span>
                  <span>|</span>
                  <span>{feed.date}</span>
                </div>

                {/* 제목 */}
                <h3
                  className="text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors"
                  style={{
                    ...typography.title.sTitleM,
                  }}
                >
                  {feed.title}
                </h3>

                {/* 본문 요약 */}
                <div className="w-2/3">
                  <p
                    className="text-gray-400 line-clamp-2 leading-snug"
                    style={{
                      ...typography.body.BodyM,
                    }}
                  >
                    {feed.content}
                  </p>
                </div>
              </div>

              {/* 좋아요 버튼 섹션 */}
              <div className="ml-4 flex flex-col items-center">
                <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 flex justify-center items-center rounded-full border border-gray-200"
                    onClick={() => handleHeartClick(feed.id)}
                  >
                    {hearts[feed.id] ? (
                      <img src={RedHeart} alt="heart" className="w-2/3" />
                    ) : (
                      <img src={Heart} alt="heart" className="w-2/3" />
                    )}
                  </div>
                </button>
                <span className="text-[11px] font-bold text-gray-400 mt-[-4px]">
                  {feed.likes.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          to={`/trip/`}
          className="px-7 py-2.5 border-2 border-[#00c7f2] text-[#00c7f2] rounded-full hover:bg-[#00c7f2] hover:text-white transition-all"
          style={{
            ...typography.body.BodyM,
          }}
        >
          더 보러가기
        </Link>
      </div>
    </>
  );
}
