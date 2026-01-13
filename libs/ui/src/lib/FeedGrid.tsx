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
  return (
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
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-1 font-medium">
                <span>{feed.author}</span>
                <span>|</span>
                <span>{feed.date}</span>
              </div>

              {/* 제목 */}
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {feed.title}
              </h3>

              {/* 본문 요약 */}
              <p className="text-gray-400 text-sm line-clamp-2 leading-snug">
                {feed.content}
              </p>
            </div>

            {/* 좋아요 버튼 섹션 */}
            <div className="ml-4 flex flex-col items-center">
              <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                {/* <Heart className="w-5 h-5 text-gray-300" /> */}
              </button>
              <span className="text-[11px] font-bold text-gray-400 mt-[-4px]">
                {feed.likes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
