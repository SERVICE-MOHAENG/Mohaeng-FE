import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken, getBlogDetail, Header } from '@mohang/ui';
import { useAlert } from '../context/AlertContext';

const formatDate = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export function BlogDetailPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { showAlert } = useAlert();
  const isLoggedIn = Boolean(getAccessToken());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-detail', id],
    queryFn: () => getBlogDetail(id),
    enabled: Boolean(id),
    retry: false,
  });

  const blog = (data?.data ?? null) as any;

  const imageUrls = useMemo(() => {
    if (!blog) return [];

    return Array.from(
      new Set([blog.imageUrl, ...(blog.imageUrls || [])].filter(Boolean) as string[]),
    );
  }, [blog]);

  useEffect(() => {
    if (!isError) return;

    showAlert('블로그 상세 정보를 불러오지 못했습니다.', 'error');
    navigate(-1);
  }, [isError, navigate, showAlert]);

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} />

      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-16 pt-8 md:px-6">
        <section className="min-h-[calc(100vh-180px)] rounded-[28px] bg-white px-6 py-7 md:px-10 md:py-9">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00BFFF]/20 border-t-[#00BFFF]" />
            </div>
          ) : blog ? (
            <div className="mx-auto flex min-h-[calc(100vh-252px)] max-w-3xl flex-col pb-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-full border border-[#dff5ff] bg-white px-4 py-2 text-xs font-bold text-[#00BFFF] transition hover:border-[#00BFFF]"
                  >
                    이전으로
                  </button>
                  <span className="rounded-full border border-[#bfefff] bg-[#f2fbff] px-4 py-2 text-xs font-bold text-[#00BFFF]">
                    AI 여행 블로그
                  </span>
                  {blog.isPublic === false ? (
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-400">
                      비공개
                    </span>
                  ) : null}
                </div>
                {blog.createdAt ? (
                  <span className="shrink-0 text-xs font-medium text-gray-400">
                    {formatDate(blog.createdAt)}
                  </span>
                ) : null}
              </div>

              <h1 className="break-keep text-[24px] font-bold leading-tight text-[#1f2937] md:text-[30px]">
                {blog.title}
              </h1>

              <div className="mt-4 h-px w-full bg-[#7ed8ff]" />

              <div className="mt-6 whitespace-pre-wrap break-keep text-[16px] leading-8 text-gray-700">
                {blog.content}
              </div>

              {imageUrls.length > 0 ? (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {imageUrls.map((imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`${blog.title}-${index + 1}`}
                      className="max-h-[460px] w-full max-w-[560px] rounded-[20px] object-cover shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
                    />
                  ))}
                </div>
              ) : null}

              {blog.tags?.length ? (
                <div className="mt-auto flex flex-wrap gap-2 pt-10 text-[11px] font-medium text-gray-400">
                  {blog.tags.map((tag: string) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center text-sm font-medium text-gray-400">
              블로그를 찾을 수 없습니다.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BlogDetailPage;
