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
  onFeedLikeChange?: () => void | Promise<void>;
  showMoreButton?: boolean;
  desktopColumns?: 3 | 4;
  compact?: boolean;
}

export function FeedGrid({
  feeds,
  onFeedLikeChange,
  showMoreButton = true,
  desktopColumns = 3,
  compact = false,
}: FeedGridProps) {
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
      <div
        className={`grid max-w-7xl grid-cols-1 mx-auto md:grid-cols-2 ${
          compact ? 'gap-x-5 gap-y-8' : 'gap-x-6 gap-y-10'
        } ${
          desktopColumns === 4 ? 'xl:grid-cols-4 lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
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
              <div className={compact ? 'mb-3' : 'mb-4'}>
                <div
                  className={`aspect-[4/3] overflow-hidden bg-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 ${
                    compact ? 'rounded-[20px]' : 'rounded-[24px]'
                  }`}
                >
                  <img
                    src={feed.imageUrl}
                    alt={feed.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className={`flex items-start justify-between ${compact ? '' : 'px-1'}`}>
                <div className="flex-1">
                  <div
                    className={`flex items-center gap-1 text-gray-500 ${compact ? 'mb-1.5' : 'mb-2'}`}
                    style={{
                      ...typography.body.BodyM,
                      fontSize: compact ? '13px' : typography.body.BodyM.fontSize,
                    }}
                  >
                    <span>{feed.author}</span>
                    <span>|</span>
                    <span>{feed.date}</span>
                  </div>

                  <h3
                    className={`line-clamp-1 text-gray-900 transition-colors group-hover:text-blue-600 ${
                      compact ? 'mb-2' : 'mb-3'
                    }`}
                    style={{
                      ...typography.title.sTitleM,
                      fontSize: compact ? '20px' : typography.title.sTitleM.fontSize,
                    }}
                  >
                    {feed.title}
                  </h3>

                  <div className={compact ? 'w-full' : 'w-2/3'}>
                    <p
                      className={`line-clamp-2 text-gray-400 ${compact ? 'leading-snug' : 'leading-snug'}`}
                      style={{
                        ...typography.body.BodyM,
                        fontSize: compact ? '14px' : typography.body.BodyM.fontSize,
                      }}
                    >
                      {feed.content}
                    </p>
                  </div>
                </div>

                <div className={`${compact ? 'ml-3' : 'ml-4'} flex flex-col items-center`}>
                  <button
                    className={`rounded-full transition-colors hover:bg-gray-50 ${
                      compact ? 'p-1.5' : 'p-2'
                    }`}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await handleHeartClick(feed.id);
                      await onFeedLikeChange?.();
                    }}
                    aria-label={hearts[feed.id] ? '\uC88B\uC544\uC694 \uCDE8\uC18C' : '\uC88B\uC544\uC694'}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full border border-gray-200 ${
                        compact ? 'h-10 w-10' : 'h-12 w-12'
                      }`}
                    >
                      {hearts[feed.id] ? (
                        <img src={RedHeart} alt="heart" className="w-2/3" />
                      ) : (
                        <img src={Heart} alt="heart" className="w-2/3" />
                      )}
                    </div>
                  </button>
                  <span
                    className={`font-bold text-gray-400 ${compact ? 'mt-[-2px] text-[10px]' : 'mt-[-4px] text-[11px]'}`}
                  >
                    {(likeCounts[feed.id] ?? feed.likes).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showMoreButton ? (
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
      ) : null}

      {showMoreButton && showComingSoon ? (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-[#111827] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.25)]">{'\uC544\uC9C1 \uAC1C\uBC1C\uC911\uC778 \uAE30\uB2A5\uC785\uB2C8\uB2E4.'}</div>
      ) : null}
    </>
  );
}





