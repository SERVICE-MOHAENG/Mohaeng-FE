import { useState } from 'react';
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
}

interface UseLikeCountsProps {
  feeds?: FeedItem[];
  onLike?: (id: string) => Promise<any>;
  onUnlike?: (id: string) => Promise<any>;
}

export function useLikeCounts({ feeds, onLike, onUnlike }: UseLikeCountsProps) {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState<Record<string, boolean>>({});
  const [pendingById, setPendingById] = useState<Record<string, boolean>>({});

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

    const isCurrentlyLiked = hearts[id] ?? false;
    const feed = feeds?.find((f) => f.id === id);
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
      } else {
        const likeFn = overrides?.onLike || onLike || addBlogLike;
        await likeFn(id);
      }
    } catch (error) {
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
