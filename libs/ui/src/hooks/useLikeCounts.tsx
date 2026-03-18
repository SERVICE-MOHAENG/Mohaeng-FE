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

interface DestinationListProps {
  feeds?: FeedItem[];
}

export function useLikeCounts({ feeds }: DestinationListProps) {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState<Record<string, boolean>>({});

  const handleHeartClick = async (id: string) => {
    const isCurrentlyLiked = hearts[id] ?? false;
    const feed = feeds?.find((f) => f.id === id);
    const initialCount = feed?.likes ?? 0;
    const currentCount = likeCounts[id] ?? initialCount;

    // 1. Optimistic UI update
    setHearts((prev) => ({
      ...prev,
      [id]: !isCurrentlyLiked,
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? currentCount - 1 : currentCount + 1,
    }));

    // 2. API call
    try {
      if (isCurrentlyLiked) {
        await removeBlogLike(id);
      } else {
        await addBlogLike(id);
      }
    } catch (error) {
      console.error('Failed to toggle blog like:', error);
      // 3. Revert on failure
      setHearts((prev) => ({
        ...prev,
        [id]: isCurrentlyLiked,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [id]: currentCount,
      }));
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    likeCounts,
    hearts,
    handleHeartClick,
  };
}
