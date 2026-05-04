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

interface LikeOverride {
  isLiked: boolean;
  likeCount: number;
}

interface UseLikeCountsProps {
  feeds?: FeedItem[];
  onLike?: (id: string) => Promise<any>;
  onUnlike?: (id: string) => Promise<any>;
  persistKey?: string;
}

const getPersistedLikeCountKey = (persistKey: string) => `${persistKey}:counts`;

const getPersistedLikes = (persistKey?: string): Record<string, boolean> => {
  if (!persistKey || typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(persistKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const getPersistedLikeCounts = (persistKey?: string): Record<string, number> => {
  if (!persistKey || typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(getPersistedLikeCountKey(persistKey));
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

const setPersistedLikeCount = (
  persistKey: string | undefined,
  id: string,
  value: number,
) => {
  if (!persistKey || typeof window === 'undefined') return;

  try {
    const prev = getPersistedLikeCounts(persistKey);
    const next = { ...prev, [id]: value };
    window.localStorage.setItem(
      getPersistedLikeCountKey(persistKey),
      JSON.stringify(next),
    );
  } catch {
    // ignore storage failures
  }
};

const clearPersistedLike = (persistKey: string | undefined, id: string) => {
  if (!persistKey || typeof window === 'undefined') return;

  try {
    const prev = getPersistedLikes(persistKey);
    if (!(id in prev)) return;
    const next = { ...prev };
    delete next[id];
    window.localStorage.setItem(persistKey, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
};

const clearPersistedLikeCount = (
  persistKey: string | undefined,
  id: string,
) => {
  if (!persistKey || typeof window === 'undefined') return;

  try {
    const prev = getPersistedLikeCounts(persistKey);
    if (!(id in prev)) return;
    const next = { ...prev };
    delete next[id];
    window.localStorage.setItem(
      getPersistedLikeCountKey(persistKey),
      JSON.stringify(next),
    );
  } catch {
    // ignore storage failures
  }
};

const getPersistedOverride = (
  feed: FeedItem,
  persistedLikes: Record<string, boolean>,
  persistedLikeCounts: Record<string, number>,
): LikeOverride | undefined => {
  const hasPersistedLike = Object.prototype.hasOwnProperty.call(
    persistedLikes,
    feed.id,
  );
  const hasPersistedLikeCount = Object.prototype.hasOwnProperty.call(
    persistedLikeCounts,
    feed.id,
  );

  if (!hasPersistedLike && !hasPersistedLikeCount) {
    return undefined;
  }

  const isLiked = hasPersistedLike
    ? Boolean(persistedLikes[feed.id])
    : Boolean(feed.isLiked);
  const likeCount = hasPersistedLikeCount
    ? persistedLikeCounts[feed.id]
    : isLiked === Boolean(feed.isLiked)
      ? feed.likes
      : isLiked
        ? feed.likes + 1
        : Math.max(0, feed.likes - 1);

  if (isLiked === Boolean(feed.isLiked) && likeCount === feed.likes) {
    return undefined;
  }

  return { isLiked, likeCount };
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
  const [overridesById, setOverridesById] = useState<
    Record<string, LikeOverride>
  >({});

  useEffect(() => {
    if (!feeds?.length) return;

    const persistedLikes = getPersistedLikes(persistKey);
    const persistedLikeCounts = getPersistedLikeCounts(persistKey);
    let nextOverrides = overridesById;
    let overridesChanged = false;

    for (const feed of feeds) {
      const override = nextOverrides[feed.id];

      if (
        override &&
        override.isLiked === Boolean(feed.isLiked) &&
        override.likeCount === feed.likes
      ) {
        if (!overridesChanged) {
          nextOverrides = { ...nextOverrides };
        }
        delete nextOverrides[feed.id];
        overridesChanged = true;
        clearPersistedLike(persistKey, feed.id);
        clearPersistedLikeCount(persistKey, feed.id);
        continue;
      }

      const persistedOverride = getPersistedOverride(
        feed,
        persistedLikes,
        persistedLikeCounts,
      );

      if (
        persistedOverride &&
        persistedOverride.isLiked === Boolean(feed.isLiked) &&
        persistedOverride.likeCount === feed.likes
      ) {
        clearPersistedLike(persistKey, feed.id);
        clearPersistedLikeCount(persistKey, feed.id);
      }
    }

    if (overridesChanged) {
      setOverridesById(nextOverrides);
    }

    setLikeCounts((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const feed of feeds) {
        const override =
          nextOverrides[feed.id] ??
          getPersistedOverride(feed, persistedLikes, persistedLikeCounts);
        const nextValue = override?.likeCount ?? feed.likes;

        if (next[feed.id] !== nextValue) {
          next[feed.id] = nextValue;
          changed = true;
        }
      }

      return changed ? next : prev;
    });

    setHearts((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const feed of feeds) {
        const override =
          nextOverrides[feed.id] ??
          getPersistedOverride(feed, persistedLikes, persistedLikeCounts);
        const nextValue = override?.isLiked ?? Boolean(feed.isLiked);

        if (next[feed.id] !== nextValue) {
          next[feed.id] = nextValue;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [feeds, overridesById, persistKey]);

  const handleHeartClick = async (
    id: string,
    overrides?: {
      onLike?: (id: string) => Promise<any>;
      onUnlike?: (id: string) => Promise<any>;
    },
  ) => {
    if (pendingById[id]) return;

    const feed = feeds?.find((item) => item.id === id);
    const initialIsLiked = feed?.isLiked ?? false;
    const isCurrentlyLiked = hearts[id] ?? initialIsLiked;
    const initialCount = feed?.likes ?? 0;
    const currentCount = likeCounts[id] ?? initialCount;
    const nextState: LikeOverride = {
      isLiked: !isCurrentlyLiked,
      likeCount: isCurrentlyLiked
        ? Math.max(0, currentCount - 1)
        : currentCount + 1,
    };

    setPendingById((prev) => ({
      ...prev,
      [id]: true,
    }));

    setOverridesById((prev) => ({
      ...prev,
      [id]: nextState,
    }));

    setHearts((prev) => ({
      ...prev,
      [id]: nextState.isLiked,
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: nextState.likeCount,
    }));

    try {
      if (isCurrentlyLiked) {
        const unlikeFn = overrides?.onUnlike || onUnlike || removeBlogLike;
        await unlikeFn(id);
        setPersistedLike(persistKey, id, false);
        setPersistedLikeCount(persistKey, id, nextState.likeCount);
      } else {
        const likeFn = overrides?.onLike || onLike || addBlogLike;
        await likeFn(id);
        setPersistedLike(persistKey, id, true);
        setPersistedLikeCount(persistKey, id, nextState.likeCount);
      }
    } catch (error: any) {
      if (error?.errorCode === 'TRIP_CORE_HE_CRS_V003') {
        setPersistedLike(persistKey, id, true);
        setPersistedLikeCount(persistKey, id, nextState.likeCount);
        return;
      }

      console.error('Failed to toggle like:', error);

      setHearts((prev) => ({
        ...prev,
        [id]: isCurrentlyLiked,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [id]: currentCount,
      }));
      setOverridesById((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
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
