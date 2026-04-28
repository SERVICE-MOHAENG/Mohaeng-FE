import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  colors,
  FeedGrid,
  getAccessToken,
  getMainBlogs,
  Header,
  type GridFeedItem,
  typography,
} from '@mohang/ui';

const PAGE_SIZE = 12;
const FALLBACK_BLOG_IMAGE =
  'https://images.pexels.com/photos/9782676/pexels-photo-9782676.jpeg';

const getSafeSort = (value: string | null): 'latest' | 'popular' =>
  value === 'popular' ? 'popular' : 'latest';

const getSafePage = (value: string | null) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
};

const createPageRange = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
};

export function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoggedIn = Boolean(getAccessToken());

  const sortBy = getSafeSort(searchParams.get('sortBy'));
  const currentPage = getSafePage(searchParams.get('page'));

  useEffect(() => {
    const currentSort = searchParams.get('sortBy');
    const currentPageParam = searchParams.get('page');

    if (currentSort === sortBy && currentPageParam === String(currentPage)) {
      return;
    }

    setSearchParams(
      {
        sortBy,
        page: String(currentPage),
      },
      { replace: true },
    );
  }, [currentPage, searchParams, setSearchParams, sortBy]);

  const blogsQuery = useQuery({
    queryKey: ['blog-list-page', sortBy, currentPage],
    queryFn: () =>
      getMainBlogs({
        sortBy,
        page: currentPage,
        limit: PAGE_SIZE,
      }),
  });

  const blogItems = useMemo(() => {
    const data = blogsQuery.data as any;

    return Array.isArray(data)
      ? data
      : data?.data?.blogs || data?.blogs || data?.data?.items || data?.items || [];
  }, [blogsQuery.data]);

  const feeds = useMemo<GridFeedItem[]>(
    () =>
      blogItems.map((blog: any) => ({
        id: blog.id,
        author: blog.userName || '',
        date: blog.createdAt?.split('T')?.[0] || '',
        title: blog.title || '',
        content: blog.content || '',
        imageUrl:
          blog.imageUrl || blog.imageUrls?.[0] || FALLBACK_BLOG_IMAGE,
        likes: Number(blog.likeCount ?? 0),
        isLiked: Boolean(blog.isLiked),
      })),
    [blogItems],
  );

  const totalPages = Math.max(
    1,
    Number((blogsQuery.data as any)?.totalPages ?? 1),
  );
  const visiblePages = createPageRange(currentPage, totalPages);

  useEffect(() => {
    if (currentPage <= totalPages) return;

    setSearchParams(
      {
        sortBy,
        page: String(totalPages),
      },
      { replace: true },
    );
  }, [currentPage, setSearchParams, sortBy, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, sortBy]);

  const updateParams = (next: {
    page?: number;
    sortBy?: 'latest' | 'popular';
  }) => {
    setSearchParams({
      sortBy: next.sortBy ?? sortBy,
      page: String(next.page ?? currentPage),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/50 via-white to-white">
      <Header isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'latest', label: '최신순' },
              { key: 'popular', label: '인기순' },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() =>
                  updateParams({
                    sortBy: option.key as 'latest' | 'popular',
                    page: 1,
                  })
                }
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  sortBy === option.key
                    ? 'bg-[#00CCFF] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {blogsQuery.isLoading ? (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="aspect-[4/3] animate-pulse rounded-[20px] bg-gray-100" />
                <div className="mt-6 h-4 w-28 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-4 h-6 w-4/5 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-gray-100" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </section>
        ) : blogsQuery.isError ? (
          <section className="rounded-[28px] border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
            <p
              style={{
                ...typography.title.sTitleB,
                color: colors.gray[800],
              }}
            >
              블로그 목록을 불러오지 못했습니다.
            </p>
            <p
              className="mt-3"
              style={{
                ...typography.body.BodyM,
                color: colors.gray[400],
              }}
            >
              잠시 후 다시 시도해주세요.
            </p>
            <button
              type="button"
              onClick={() => blogsQuery.refetch()}
              className="mt-6 rounded-full bg-[#00CCFF] px-6 py-3 font-bold text-white transition-colors hover:bg-[#00B6E4]"
            >
              다시 불러오기
            </button>
          </section>
        ) : feeds.length > 0 ? (
          <>
            <FeedGrid
              feeds={feeds}
              showMoreButton={false}
              desktopColumns={4}
              compact
            />

            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => updateParams({ page: currentPage - 1 })}
                  disabled={currentPage <= 1}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:border-cyan-200 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  이전
                </button>

                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updateParams({ page: pageNumber })}
                    className={`h-11 min-w-[44px] rounded-full px-4 text-sm font-bold transition-all ${
                      currentPage === pageNumber
                        ? 'bg-[#00CCFF] text-white shadow-[0_10px_24px_rgba(0,204,255,0.2)]'
                        : 'border border-gray-200 bg-white text-gray-500 hover:border-cyan-200 hover:text-cyan-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => updateParams({ page: currentPage + 1 })}
                  disabled={currentPage >= totalPages}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:border-cyan-200 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  다음
                </button>
              </div>

              <p
                style={{
                  ...typography.label.labelM,
                  color: colors.gray[400],
                }}
              >
                {currentPage} / {totalPages} 페이지
              </p>
            </div>
          </>
        ) : (
          <section className="rounded-[28px] border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <p
              style={{
                ...typography.title.sTitleB,
                color: colors.gray[800],
              }}
            >
              아직 공개된 블로그가 없습니다.
            </p>
            <p
              className="mt-3"
              style={{
                ...typography.body.BodyM,
                color: colors.gray[400],
              }}
            >
              첫 번째 여행 기록이 등록되면 이곳에서 바로 확인할 수 있습니다.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default BlogListPage;
