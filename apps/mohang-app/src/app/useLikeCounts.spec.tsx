import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  type FeedItem,
  useLikeCounts,
} from '../../../../libs/ui/src/hooks/useLikeCounts';

const baseFeed: FeedItem = {
  id: 'blog-1',
  author: 'tester',
  date: '2026-05-04',
  title: 'Blog title',
  content: 'Blog content',
  imageUrl: 'https://example.com/image.jpg',
  likes: 10,
  isLiked: false,
};

function LikeHarness({
  feeds,
  onLike,
  onUnlike,
  persistKey,
}: {
  feeds: FeedItem[];
  onLike?: (id: string) => Promise<unknown>;
  onUnlike?: (id: string) => Promise<unknown>;
  persistKey?: string;
}) {
  const { hearts, likeCounts, handleHeartClick } = useLikeCounts({
    feeds,
    onLike,
    onUnlike,
    persistKey,
  });

  const feed = feeds[0];

  return (
    <div>
      <div data-testid="liked">{String(hearts[feed.id] ?? feed.isLiked ?? false)}</div>
      <div data-testid="count">{String(likeCounts[feed.id] ?? feed.likes)}</div>
      <button type="button" onClick={() => void handleHeartClick(feed.id)}>
        toggle
      </button>
    </div>
  );
}

describe('useLikeCounts', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('keeps the optimistic state until incoming feed data catches up', async () => {
    const onLike = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <LikeHarness feeds={[baseFeed]} onLike={onLike} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    await waitFor(() => expect(onLike).toHaveBeenCalledWith(baseFeed.id));
    await waitFor(() =>
      expect(screen.getByTestId('liked').textContent).toBe('true'),
    );
    expect(screen.getByTestId('count').textContent).toBe('11');

    rerender(<LikeHarness feeds={[baseFeed]} onLike={onLike} />);

    await waitFor(() =>
      expect(screen.getByTestId('liked').textContent).toBe('true'),
    );
    expect(screen.getByTestId('count').textContent).toBe('11');

    rerender(
      <LikeHarness
        feeds={[{ ...baseFeed, likes: 11, isLiked: true }]}
        onLike={onLike}
      />,
    );

    await waitFor(() =>
      expect(screen.getByTestId('count').textContent).toBe('11'),
    );

    rerender(
      <LikeHarness
        feeds={[{ ...baseFeed, likes: 12, isLiked: true }]}
        onLike={onLike}
      />,
    );

    await waitFor(() =>
      expect(screen.getByTestId('count').textContent).toBe('12'),
    );
  });

  it('restores the optimistic state from storage across remounts', async () => {
    const onLike = vi.fn().mockResolvedValue(undefined);
    const persistKey = 'blog-like-overrides';
    const { unmount } = render(
      <LikeHarness
        feeds={[baseFeed]}
        onLike={onLike}
        persistKey={persistKey}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    await waitFor(() => expect(onLike).toHaveBeenCalledWith(baseFeed.id));
    await waitFor(() =>
      expect(screen.getByTestId('liked').textContent).toBe('true'),
    );
    expect(screen.getByTestId('count').textContent).toBe('11');

    unmount();

    render(
      <LikeHarness
        feeds={[baseFeed]}
        onLike={onLike}
        persistKey={persistKey}
      />,
    );

    await waitFor(() =>
      expect(screen.getByTestId('liked').textContent).toBe('true'),
    );
    expect(screen.getByTestId('count').textContent).toBe('11');
  });
});
