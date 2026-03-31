import { useEffect, useState } from 'react';
import { addBlogLike, removeBlogLike } from '../api/blogs';

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

interface UseLikeCountsProps {
  feeds?: FeedItem[];
  onLike?: (id: string) => Promise<any>;
  onUnlike?: (id: string) => Promise<any>;
  persistKey?: string;
}

const getPersistedLikes = (persistKey?: string): Record<string, boolean> => {
  if (!persistKey || typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(persistKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setPersistedLike = (
  persistKey: string | undefined,
  id: string,
  value: boolean,
) => {
  if (!persistKey || typeof window === 'undefined') return;

  try {
    const prev = getPersistedLikes(persistKey);
    const next = { ...prev, [id]: value };
    window.localStorage.setItem(persistKey, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
};

export function useLikeCounts({
  feeds,
  onLike,
  onUnlike,
  persistKey,
}: UseLikeCountsProps) {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState<Record<string, boolean>>({});
  const [pendingById, setPendingById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!feeds?.length) return;
    const persistedLikes = getPersistedLikes(persistKey);

    setLikeCounts((prev) => {
      const next = { ...prev };
      for (const feed of feeds) {
        if (pendingById[feed.id]) continue;
        next[feed.id] = feed.likes;
      }
      return next;
    });

    setHearts((prev) => {
      const next = { ...prev };
      for (const feed of feeds) {
        if (pendingById[feed.id]) continue;
        next[feed.id] = persistedLikes[feed.id] ?? !!feed.isLiked;
      }
      return next;
    });
  }, [feeds, pendingById, persistKey]);

  const handleHeartClick = async (
    id: string,
    overrides?: {
      onLike?: (id: string) => Promise<any>;
      onUnlike?: (id: string) => Promise<any>;
    },
  ) => {
    if (pendingById[id]) return;
    
    setPendingById((prev) => ({
      ...prev,
      [id]: true,
    }));

    const feed = feeds?.find((f) => f.id === id);
    const initialIsLiked = feed?.isLiked ?? false;
    const isCurrentlyLiked = hearts[id] ?? initialIsLiked;
    const initialCount = feed?.likes ?? 0;
    const currentCount = likeCounts[id] ?? initialCount;

    // Optimistic UI update
    setHearts((prev) => ({
      ...prev,
      [id]: !isCurrentlyLiked,
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
    }));

    // API call
    try {
      if (isCurrentlyLiked) {
        const unlikeFn = overrides?.onUnlike || onUnlike || removeBlogLike;
        await unlikeFn(id);
        setPersistedLike(persistKey, id, false);
      } else {
        const likeFn = overrides?.onLike || onLike || addBlogLike;
        await likeFn(id);
        setPersistedLike(persistKey, id, true);
      }
    } catch (error: any) {
      if (error?.errorCode === 'TRIP_CORE_HE_CRS_V003') {
        setHearts((prev) => ({
          ...prev,
          [id]: true,
        }));
        setPersistedLike(persistKey, id, true);
        return;
      }

      console.error('Failed to toggle like:', error);
      // Revert on failure
      setHearts((prev) => ({
        ...prev,
        [id]: isCurrentlyLiked,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [id]: currentCount,
      }));
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setPendingById((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  return {
    likeCounts,
    hearts,
    pendingById,
    handleHeartClick,
  };
}
