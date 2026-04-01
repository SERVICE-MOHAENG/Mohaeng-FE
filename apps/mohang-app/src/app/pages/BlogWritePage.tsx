import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  colors,
  typography,
  getAccessToken,
  getMyRoadmaps,
  getMyTravelLogs,
  publicApi,
} from '@mohang/ui';
import { useAlert } from '../context/AlertContext';

interface RoadmapCard {
  id: string;
  title: string;
  dateText: string;
  imageUrl: string;
  isCompleted: boolean;
  hasBlog: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';

const mapRoadmap = (item: any): RoadmapCard => {
  const data = item || {};
  const startDate = data.start_date || '';
  const endDate = data.end_date || '';

  return {
    id: data.id || '',
    title: data.title || '제목 없는 로드맵',
    dateText: startDate && endDate ? `${startDate} ~ ${endDate}` : '여행 일정 미정',
    imageUrl: data.imageUrl || FALLBACK_IMAGE,
    isCompleted: Boolean(data.is_completed) || data.status === 'COMPLETED',
    hasBlog: false,
  };
};

export function BlogWritePage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadmaps, setRoadmaps] = useState<RoadmapCard[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['우정여행']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      const authed = Boolean(token && token !== 'undefined');
      setIsLoggedIn(authed);

      try {
        const [roadmapsResponse, blogsResponse]: any = await Promise.all([
          getMyRoadmaps(1, 50),
          getMyTravelLogs(1, 100),
        ]);

        const rawRoadmaps =
          roadmapsResponse?.courses || roadmapsResponse?.data?.courses || [];
        const rawBlogs =
          blogsResponse?.data?.blogs ||
          blogsResponse?.blogs ||
          blogsResponse?.data?.items ||
          blogsResponse?.items ||
          [];

        const writtenRoadmapIds = new Set(
          rawBlogs
            .map((blog: any) => blog?.travelCourseId)
            .filter((courseId: string | undefined) => Boolean(courseId)),
        );

        const completedRoadmaps = rawRoadmaps
          .map(mapRoadmap)
          .filter((item: RoadmapCard) => item.isCompleted)
          .map((item: RoadmapCard) => ({
            ...item,
            hasBlog: writtenRoadmapIds.has(item.id),
          }));

        setRoadmaps(completedRoadmaps);

        const firstWritableRoadmap = completedRoadmaps.find(
          (item: RoadmapCard) => !item.hasBlog,
        );
        setSelectedRoadmapId(firstWritableRoadmap?.id || '');
      } catch (error) {
        console.error('BLOG WRITE ROADMAPS ERROR:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const selectedRoadmap = useMemo(
    () => roadmaps.find((item) => item.id === selectedRoadmapId) || null,
    [roadmaps, selectedRoadmapId],
  );

  const addTag = () => {
    const normalized = tagInput.trim().replace(/^#/, '');
    if (!normalized) return;
    if (tags.includes(normalized)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, normalized]);
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      return;
    }

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const nextUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...nextUrls].slice(0, 6));
    event.target.value = '';
  };

  const handleSubmit = async () => {
    if (!selectedRoadmapId) {
      showAlert('로드맵을 선택해주세요.', 'warning');
      return;
    }

    if (!title.trim()) {
      showAlert('제목을 입력해주세요.', 'warning');
      return;
    }

    if (!content.trim()) {
      showAlert('내용을 입력해주세요.', 'warning');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await publicApi.post(
        '/api/v1/blogs',
        {
          travelCourseId: selectedRoadmapId,
          title: title.trim(),
          content: content.trim(),
          imageUrls: photos.filter((photo) => /^https?:\/\//i.test(photo)),
          tags,
          isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      showAlert('블로그가 작성되었습니다.', 'success');
      navigate(-1);
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || error.message || '블로그 작성에 실패했습니다.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f8f8f8]">
      <Header isLoggedIn={isLoggedIn} />

      <main className="h-[calc(100vh)] overflow-hidden px-4 py-4 md:px-6">
        <div className="grid h-[calc(100%-52px)] grid-cols-[260px_minmax(0,1fr)] gap-4">
          <aside className="h-full overflow-hidden">
            <div className="flex h-full flex-col gap-3 overflow-y-auto pr-2">
              {isLoading ? (
                <div className="rounded-[18px] border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
                  <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#00BFFF]/20 border-t-[#00BFFF]" />
                  <p className="text-sm font-medium text-gray-500">
                    완료된 로드맵을 불러오는 중입니다.
                  </p>
                </div>
              ) : roadmaps.length > 0 ? (
                roadmaps.map((roadmap) => {
                  const active = selectedRoadmapId === roadmap.id;

                  return (
                    <button
                      key={roadmap.id}
                      type="button"
                      onClick={() => {
                        if (roadmap.hasBlog) return;
                        setSelectedRoadmapId(roadmap.id);
                      }}
                      disabled={roadmap.hasBlog}
                      className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition ${
                        roadmap.hasBlog
                          ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-70'
                          : active
                            ? 'border-[#8edfff] bg-white'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-gray-900">
                          {roadmap.title}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          {roadmap.dateText}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          roadmap.hasBlog
                            ? 'border border-gray-300 text-gray-500'
                            : 'border border-[#62d1ff] text-[#00bfff]'
                        }`}
                      >
                        {roadmap.hasBlog ? '이미 작성됨' : active ? '선택됨' : '선택하기'}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[14px] border border-dashed border-gray-200 bg-white px-3 py-6 text-center text-xs text-gray-400">
                  완료된 로드맵이 없습니다.
                </div>
              )}
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col rounded-[24px] border border-[#f0f0f0] bg-white px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(selectedRoadmap)}
                readOnly
                className="h-3.5 w-3.5 rounded border-gray-300 accent-[#00C2FF]"
              />
              <span className="rounded-full bg-[#00C2FF] px-3 py-1 text-[10px] font-bold text-white">
                {selectedRoadmap ? selectedRoadmap.title : '로드맵을 선택하세요'}
              </span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요."
              style={{
                ...typography.body.LBodyB,
                color: colors.gray[800],
                fontFamily: 'Paperozi',
              }}
              className="w-full border-b border-[#7ed8ff] pb-3 text-[18px] font-bold text-gray-700 outline-none placeholder:text-gray-300 md:text-[20px]"
            />

            <div className="mt-4 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_220px] gap-4">
              <div className="flex min-h-0 flex-col rounded-[20px] bg-[#fcfcfc] px-3 py-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력해주세요."
                  style={{
                    ...typography.body.BodyB,
                    color: colors.gray[800],
                    fontFamily: 'Paperozi',
                  }}
                  className="h-full min-h-0 w-full resize-none bg-transparent text-sm leading-7 text-gray-700 outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="flex min-h-0 flex-col gap-3">
                <div className="rounded-[18px] border border-gray-100 bg-[#fcfcfc] p-3">
                  <p className="mb-2 text-xs font-bold text-gray-700">사진 첨부</p>
                  <label className="flex h-[112px] cursor-pointer items-center justify-center rounded-[16px] border border-dashed border-[#7ed8ff] bg-white text-xs font-bold text-[#00bfff]">
                    사진 추가
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {photos.map((photo, index) => (
                      <img
                        key={`${photo}-${index}`}
                        src={photo}
                        alt={`upload-${index}`}
                        className="h-20 w-full rounded-[12px] object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[18px] border border-gray-100 bg-[#fcfcfc] p-3">
                  <p className="mb-2 text-xs font-bold text-gray-700">태그</p>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                    placeholder="태그 입력 후 엔터"
                    className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-300"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full border border-[#bfefff] bg-white px-3 py-1 text-[11px] font-bold text-[#00bfff]"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold text-gray-700">공개 설정</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                          isPublic
                            ? 'border-[#62d1ff] bg-white text-[#00bfff]'
                            : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        공개
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                          !isPublic
                            ? 'border-[#62d1ff] bg-white text-[#00bfff]'
                            : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        비공개
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-[8px] bg-[#00C2FF] px-6 py-2 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                작성하기
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default BlogWritePage;
