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
  const [pendingById, setPendingById] = useState<Record<string, boolean>>({});

  const handleHeartClick = async (id: string) => {
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
        await removeBlogLike(id);
      } else {
        await addBlogLike(id);
      }
    } catch (error) {
      console.error('Failed to toggle blog like:', error);
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
