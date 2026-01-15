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

interface DestinationListProps {
  feeds?: FeedItem[];
}

export function useLikeCounts({ feeds }: DestinationListProps) {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState<Record<string, boolean>>({});

  const handleHeartClick = (id: string) => {
    const feed = feeds?.find((f) => f.id === id);
    const currentCount = likeCounts[id] ?? feed?.likes ?? 0;
    const isCurrentlyLiked = hearts[id] ?? false;

    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? currentCount - 1 : currentCount + 1,
    }));
    setHearts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? currentCount - 1 : currentCount + 1,
    }));
  };

  return {
    likeCounts,
    hearts,
    handleHeartClick,
  };
}
