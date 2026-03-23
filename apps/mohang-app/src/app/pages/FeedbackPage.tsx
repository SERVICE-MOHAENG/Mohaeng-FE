import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  LoadingScreen,
  colors,
  typography,
  getAccessToken,
  getMainPageUser,
  submitFeedback,
  FEEDBACK_KEYWORDS,
  FEEDBACK_PLATFORMS,
  FeedbackKeyword,
  FeedbackPlatform,
} from '@mohang/ui';

interface ValidationErrors {
  keywords?: string;
  platform?: string;
  title?: string;
  content?: string;
  submit?: string;
}

export function FeedbackPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [keywords, setKeywords] = useState<FeedbackKeyword[]>([]);
  const [platform, setPlatform] = useState<FeedbackPlatform | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const contentLength = useMemo(() => content.trim().length, [content]);

  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      const authed = Boolean(token && token !== 'undefined');

      if (!authed) {
        navigate('/login', { replace: true });
        return;
      }

      setIsLoggedIn(true);

      try {
        const response: any = await getMainPageUser();
        const userData = response?.data?.profile || response?.data || response;

        setUserName(userData?.name || '');
        setUserEmail(userData?.email || '');
      } catch (error) {
        setErrors({ submit: '페이지를 불러올 수 없습니다' });
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [navigate]);

  const toggleKeyword = (keyword: FeedbackKeyword) => {
    setSuccessMessage('');
    setErrors((prev) => ({ ...prev, keywords: undefined, submit: undefined }));
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((item) => item !== keyword)
        : [...prev, keyword],
    );
  };

  const validate = () => {
    const nextErrors: ValidationErrors = {};

    if (keywords.length === 0) {
      nextErrors.keywords = '피드백 유형을 선택해주세요';
    }

    if (!platform) {
      nextErrors.platform = '사용 중인 플랫폼을 선택해주세요';
    }

    if (!title.trim()) {
      nextErrors.title = '제목을 입력해주세요';
    }

    if (!content.trim()) {
      nextErrors.content = '피드백 내용을 입력해주세요';
    } else if (content.trim().length < 10) {
      nextErrors.content = '내용을 조금 더 자세히 작성해주세요';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    try {
      const message = await submitFeedback({
        keywords,
        platform,
        title: title.trim(),
        content: content.trim(),
        userName,
        userEmail,
      });

      setSuccessMessage(message || '피드백이 정상적으로 접수되었습니다');
      setKeywords([]);
      setPlatform('');
      setTitle('');
      setContent('');
      setErrors({});
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 2000);
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.statusCode === 0
            ? '네트워크 연결을 확인해주세요'
            : '피드백 제출에 실패했습니다. 다시 시도해주세요',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRedirecting) {
    return (
      <LoadingScreen
        message="피드백이 접수되었습니다. 메인페이지로 이동합니다."
        description="잠시만 기다려주세요"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <Header isLoggedIn={isLoggedIn} />
        <div className="w-full px-10 md:px-16 xl:px-24 py-24">
          <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
            페이지를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header isLoggedIn={isLoggedIn} />

      <main className="w-full px-16 md:px-24 xl:px-32 py-10 md:py-12">
        <section className="w-full px-2 md:px-4 xl:px-6 py-6 md:py-8">
          <div className="text-center mb-14">
            <h1
              className="mb-4"
              style={{
                ...typography.headline.LHeadlineB,
                color: colors.gray[800],
              }}
            >
              피드백하기
            </h1>
            <p
              className="w-full leading-7"
              style={{ ...typography.body.BodyM, color: colors.gray[400] }}
            >
              모행을 사용하시면서 불편하신 점을 자유롭게 작성해주세요.
              <br />
              말씀해주시는 피드백은 내부 검토 후 추후적으로 수정할 수 있습니다.
            </p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5 md:gap-8 items-start">
              <label
                className="pt-3 font-semibold"
                style={{ ...typography.body.BodyB, color: colors.gray[700] }}
              >
                피드백 유형
              </label>
              <div>
                <div className="flex flex-wrap gap-3">
                  {FEEDBACK_KEYWORDS.map((keyword) => {
                    const active = keywords.includes(keyword);
                    return (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => toggleKeyword(keyword)}
                        style={{
                          ...typography.body.BodyB,
                        }}
                        className={`rounded-full px-5 py-3 text-sm transition-colors ${
                          active
                            ? 'bg-[#00C2FF] text-white shadow-lg'
                            : 'bg-gray-50 text-black border border-gray-200 hover:border-[#00C2FF] hover:text-[#00C2FF]'
                        }`}
                      >
                        {keyword}
                      </button>
                    );
                  })}
                </div>
                {errors.keywords && (
                  <p className="mt-3 text-sm text-red-500">{errors.keywords}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5 md:gap-8 items-start">
              <label
                className="pt-3 font-semibold"
                style={{ ...typography.body.BodyB, color: colors.gray[700] }}
              >
                플랫폼
              </label>
              <div className="flex flex-wrap gap-3">
                {FEEDBACK_PLATFORMS.map((item) => {
                  const active = platform === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setPlatform(item);
                        setErrors((prev) => ({
                          ...prev,
                          platform: undefined,
                          submit: undefined,
                        }));
                        setSuccessMessage('');
                      }}
                      className={`min-w-[108px] rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                        active
                          ? 'bg-[#0f172a] text-white'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#0f172a]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
                {errors.platform && (
                  <p className="w-full mt-1 text-sm text-red-500">
                    {errors.platform}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5 md:gap-8 items-start">
              <label
                htmlFor="feedback-title"
                className="pt-3 font-semibold"
                style={{ ...typography.body.BodyB, color: colors.gray[700] }}
              >
                피드백 제목
              </label>
              <div>
                <input
                  id="feedback-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      title: undefined,
                      submit: undefined,
                    }));
                    setSuccessMessage('');
                  }}
                  placeholder="문의 주실 내용의 제목을 작성해주세요."
                  className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-6 py-4 outline-none transition focus:border-[#00C2FF] focus:bg-white"
                />
                {errors.title && (
                  <p className="mt-3 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5 md:gap-8 items-start">
              <label
                htmlFor="feedback-content"
                className="pt-3 font-semibold"
                style={{ ...typography.body.BodyB, color: colors.gray[700] }}
              >
                피드백 내용
              </label>
              <div>
                <textarea
                  id="feedback-content"
                  value={content}
                  onChange={(event) => {
                    if (event.target.value.length > 1000) return;
                    setContent(event.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      content: undefined,
                      submit: undefined,
                    }));
                    setSuccessMessage('');
                  }}
                  placeholder="문의 주실 내용을 입력해주세요."
                  className="min-h-[280px] w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-6 py-5 outline-none transition focus:border-[#00C2FF] focus:bg-white resize-y"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    {errors.content && (
                      <p className="text-sm text-red-500">{errors.content}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{contentLength}/1000</p>
                </div>
              </div>
            </div>

            {(errors.submit || successMessage) && (
              <div className="rounded-2xl border px-5 py-4">
                {errors.submit && (
                  <p className="text-sm font-semibold text-red-500">
                    {errors.submit}
                  </p>
                )}
                {successMessage && (
                  <p className="text-sm font-semibold text-[#00A3D9]">
                    {successMessage}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...typography.body.BodyB,
                  backgroundColor: colors.primary[500],
                  color: colors.white.white100,
                }}
                className="min-w-[140px] rounded-xl px-8 py-3 font-bold shadow-lg transition hover:bg-[#00addf] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isSubmitting ? '제출 중...' : '제출'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default FeedbackPage;
