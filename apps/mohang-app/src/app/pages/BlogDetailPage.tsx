import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  addLike,
  getAccessToken,
  getBlogDetail,
  getCourseDetail,
  Header,
  removeLike,
} from '@mohang/ui';
import Heart from '../../../../../libs/ui/src/assets/heart.svg';
import RedHeart from '../../../../../libs/ui/src/assets/redHeart.svg';
import { useAlert } from '../context/AlertContext';

const COURSE_LIKE_PERSIST_KEY = 'course-like-overrides';

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

const getPersistedCourseLikes = (): Record<string, boolean> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(COURSE_LIKE_PERSIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setPersistedCourseLike = (id: string, value: boolean) => {
  if (typeof window === 'undefined') return;

  try {
    const prev = getPersistedCourseLikes();
    const next = { ...prev, [id]: value };
    window.localStorage.setItem(COURSE_LIKE_PERSIST_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
};

const getCourseTitle = (course: any) =>
  course?.title || course?.course_title || course?.name || '연결된 로드맵';

const getCourseDateText = (course: any) => {
  const startDate =
    course?.start_date || course?.startDate || course?.departure_date;
  const endDate = course?.end_date || course?.endDate || course?.arrival_date;

  if (startDate && endDate) {
    return `${startDate} ~ ${endDate}`;
  }

  return '일정 정보 없음';
};

const getCourseLikeCount = (course: any) =>
  Number(course?.likeCount ?? course?.like_count ?? 0);

const getCourseIsLiked = (course: any) =>
  Boolean(course?.isLiked ?? course?.is_liked);

export function BlogDetailPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { showAlert } = useAlert();
  const isLoggedIn = Boolean(getAccessToken());
  const [courseLikeCount, setCourseLikeCount] = useState(0);
  const [courseIsLiked, setCourseIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-detail', id],
    queryFn: () => getBlogDetail(id),
    enabled: Boolean(id),
    retry: false,
  });

  const blog = (data?.data ?? null) as any;

  const { data: courseData } = useQuery({
    queryKey: ['blog-course-detail', blog?.travelCourseId],
    queryFn: () => getCourseDetail(String(blog?.travelCourseId)),
    enabled: Boolean(blog?.travelCourseId),
    retry: false,
  });

  const course = (courseData?.data ?? null) as any;

  const imageUrls = useMemo(() => {
    if (!blog) return [];

    return Array.from(
      new Set(
        [blog.imageUrl, ...(blog.imageUrls || [])].filter(Boolean) as string[],
      ),
    );
  }, [blog]);

  useEffect(() => {
    if (!isError) return;

    showAlert('블로그 상세 정보를 불러오지 못했습니다.', 'error');
    navigate(-1);
  }, [isError, navigate, showAlert]);

  useEffect(() => {
    if (!blog?.travelCourseId) {
      setCourseLikeCount(getCourseLikeCount(course));
      setCourseIsLiked(getCourseIsLiked(course));
      return;
    }

    const persistedLikes = getPersistedCourseLikes();
    setCourseLikeCount(getCourseLikeCount(course));
    setCourseIsLiked(
      persistedLikes[blog.travelCourseId] ?? getCourseIsLiked(course),
    );
  }, [blog?.travelCourseId, course]);

  const handleCourseLike = async () => {
    if (!blog?.travelCourseId || isLiking) return;

    try {
      setIsLiking(true);

      if (courseIsLiked) {
        await removeLike(blog.travelCourseId);
        setCourseIsLiked(false);
        setCourseLikeCount((prev) => Math.max(0, prev - 1));
        setPersistedCourseLike(blog.travelCourseId, false);
      } else {
        await addLike(blog.travelCourseId);
        setCourseIsLiked(true);
        setCourseLikeCount((prev) => prev + 1);
        setPersistedCourseLike(blog.travelCourseId, true);
      }
    } catch (error: any) {
      showAlert(error?.message || '좋아요 처리에 실패했습니다.', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      <Header isLoggedIn={isLoggedIn} />

      <main className="h-[calc(100vh-72px)] overflow-hidden px-4 pb-4 pt-6 md:px-6">
        <section className="mx-auto flex h-full max-w-3xl flex-col overflow-hidden bg-white">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00BFFF]/20 border-t-[#00BFFF]" />
            </div>
          ) : blog ? (
            <div className="flex h-full min-h-0 flex-col">
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
                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                  {blog.createdAt ? (
                    <span>{formatDate(blog.createdAt)}</span>
                  ) : null}
                  {blog.userName ? <span>{blog.userName}</span> : null}
                  <span>조회수 {blog.viewCount ?? 0}</span>
                  <span>좋아요 {blog.likeCount ?? 0}</span>
                </div>
              </div>

              <h1 className="break-keep text-[24px] font-bold leading-tight text-[#1f2937] md:text-[30px]">
                {blog.title}
              </h1>

              <div className="mt-4 h-px w-full bg-[#7ed8ff]" />

              <div className="mt-6 flex-1 min-h-0 overflow-hidden whitespace-pre-wrap break-keep text-[16px] leading-8 text-gray-700">
                {blog.content}
              </div>

              {imageUrls.length > 0 ? (
                <div className="mt-6 flex flex-col items-center gap-3">
                  {imageUrls.map((imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`${blog.title}-${index + 1}`}
                      className="max-h-[260px] w-full max-w-[420px] rounded-[20px] object-cover"
                    />
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex flex-col gap-2 pt-6">
                {blog.travelCourseId ? (
                  <div className="bg-white rounded-xl flex items-center justify-between relative transition-colors">
                    <div className="flex-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-sm truncate">
                          {course
                            ? getCourseTitle(course)
                            : '로드맵 정보를 불러오는 중입니다.'}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {course
                          ? getCourseDateText(course)
                          : '잠시만 기다려주세요.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 items-center justify-center">
                        <div className="w-1/5 flex flex-col items-center">
                          <button
                            type="button"
                            className="p-1 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
                            onClick={handleCourseLike}
                            disabled={isLiking}
                          >
                            <div className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-100">
                              <img
                                src={courseIsLiked ? RedHeart : Heart}
                                alt="heart"
                                className="w-1/2"
                              />
                            </div>
                          </button>
                          <span className="text-[10px] font-bold text-gray-400 mt-1">
                            {courseLikeCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/plan-detail/${blog.travelCourseId}`, {
                            state: {
                              isCourseView: true,
                              isMyPlan: false,
                              authorName:
                                course?.userName ||
                                course?.authorName ||
                                course?.author_name ||
                                blog?.userName,
                            },
                          })
                        }
                        className="bg-[#00BFFF] text-white text-[10px] px-4 py-2 rounded-lg font-bold hover:bg-[#0096cc] transition-colors whitespace-nowrap"
                      >
                        바로가기
                      </button>
                    </div>
                  </div>
                ) : null}

                {blog.tags?.length ? (
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-400 pb-0">
                    {blog.tags.map((tag: string) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
              블로그를 찾을 수 없습니다.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BlogDetailPage;

