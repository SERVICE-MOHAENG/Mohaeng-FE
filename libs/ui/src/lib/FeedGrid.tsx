import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { typography } from '@mohang/ui';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts } from '../hooks/useLikeCounts';

export interface FeedItem {
  id: string;
  author: string;
  date: string;
  title: string;
  content: string;
  imageUrl: string;
  avatarUrl?: string;
  likes: number;
  isLiked?: boolean;
}

export interface FeedGridProps {
  feeds: FeedItem[];
}

export function FeedGrid({ feeds }: FeedGridProps) {
  const navigate = useNavigate();
  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({ feeds });
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (!showComingSoon) return;

    const timeout = window.setTimeout(() => {
      setShowComingSoon(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [showComingSoon]);

  return (
    <>
      <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-10 mx-auto md:grid-cols-2 lg:grid-cols-3">
        {feeds.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-20 text-gray-400">
            ?쒖떆???ы뻾 湲곕줉???놁뒿?덈떎
          </div>
        ) : (
          feeds.map((feed) => (
            <div
              key={feed.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/blog/${feed.id}`)}
            >
              <div className="relative mb-4">
                <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                  <img
                    src={feed.imageUrl}
                    alt={feed.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-5 right-8 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white">
                  <div className="h-2/3 w-2/3 rounded-full">
                    {feed.avatarUrl ? (
                      <img
                        src={feed.avatarUrl}
                        alt={feed.author}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-[#5D2B26]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between px-1">
                <div className="flex-1">
                  <div
                    className="mb-2 flex items-center gap-1 text-gray-500"
                    style={{
                      ...typography.body.BodyM,
                    }}
                  >
                    <span>{feed.author}</span>
                    <span>|</span>
                    <span>{feed.date}</span>
                  </div>

                  <h3
                    className="mb-3 line-clamp-1 text-gray-900 transition-colors group-hover:text-blue-600"
                    style={{
                      ...typography.title.sTitleM,
                    }}
                  >
                    {feed.title}
                  </h3>

                  <div className="w-2/3">
                    <p
                      className="line-clamp-2 leading-snug text-gray-400"
                      style={{
                        ...typography.body.BodyM,
                      }}
                    >
                      {feed.content}
                    </p>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-center">
                  <button
                    className="rounded-full p-2 transition-colors hover:bg-gray-50"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleHeartClick(feed.id);
                    }}
                    aria-label={hearts[feed.id] ? '\uC88B\uC544\uC694 \uCDE8\uC18C' : '\uC88B\uC544\uC694'}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200">
                      {hearts[feed.id] ? (
                        <img src={RedHeart} alt="heart" className="w-2/3" />
                      ) : (
                        <img src={Heart} alt="heart" className="w-2/3" />
                      )}
                    </div>
                  </button>
                  <span className="mt-[-4px] text-[11px] font-bold text-gray-400">
                    {(likeCounts[feed.id] ?? feed.likes).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setShowComingSoon(true)}
          className="rounded-full border-2 border-[#00c7f2] px-7 py-2.5 text-[#00c7f2] transition-all hover:bg-[#00c7f2] hover:text-white"
          style={{
            ...typography.body.BodyM,
          }}
        >{'\uB354\uBCF4\uB7EC\uAC00\uAE30'}</button>
      </div>

      {showComingSoon ? (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-[#111827] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.25)]">{'\uC544\uC9C1 \uAC1C\uBC1C\uC911\uC778 \uAE30\uB2A5\uC785\uB2C8\uB2E4.'}</div>
      ) : null}
    </>
  );
}





