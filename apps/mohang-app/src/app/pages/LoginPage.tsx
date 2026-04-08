import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ApiError,
  Input,
  LoadingScreen,
  colors,
  login,
  publicApi,
  signupAuthCode,
  signupAuthCodeCheck,
  typography,
} from '@mohang/ui';
import loginBgImage from '../../assets/images/login-bg.jpg';
import mohaengLogo from '../../assets/images/mohaeng-logo.svg';

const BASE_URL = (
  import.meta.env.VITE_PROD_BASE_URL || 'https://api.mohaeng.kr'
).replace(/\/$/, '');

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;

const travelDestinations = [
  { title: '1박 2일 추천 여행지.', location: '일본, 오사카' },
  { title: '주말 여행 추천지.', location: '제주도' },
  { title: '3박 4일 추천 여행지.', location: '베트남, 다낭' },
];

type ForgotPasswordStep = 'EMAIL' | 'OTP' | 'PASSWORD';
const OTP_EXPIRE_SECONDS = 5 * 60;

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const requestPasswordReset = async (data: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    await publicApi.post('/api/v1/auth/password/reset', data);
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '비밀번호 재설정에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    }

    throw {
      message: '비밀번호 재설정 요청 중 오류가 발생했습니다.',
      statusCode: 0,
    } as ApiError;
  }
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>('EMAIL');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(OTP_EXPIRE_SECONDS);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % travelDestinations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const oauthError = searchParams.get('oauthError');
    if (!oauthError) return;

    setError(oauthError);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('oauthError');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (forgotPasswordStep !== 'OTP' || isOtpExpired) return;

    const timer = window.setInterval(() => {
      setOtpRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsOtpExpired(true);
          setOtp('');
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [forgotPasswordStep, isOtpExpired]);

  const resetForgotPasswordState = (nextEmail = email) => {
    setForgotPasswordStep('EMAIL');
    setResetEmail(nextEmail);
    setOtp('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setResetError('');
    setOtpRemainingSeconds(OTP_EXPIRE_SECONDS);
    setIsOtpExpired(false);
  };

  const openForgotPassword = () => {
    setError('');
    setIsForgotPasswordMode(true);
    resetForgotPasswordState(email);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordMode(false);
    setResetError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      if (
        !response.success ||
        !response.data?.accessToken ||
        !response.data?.refreshToken
      ) {
        setError('로그인에 실패했습니다.');
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      navigate('/home');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setResetError('');

    if (!validateEmail(resetEmail)) {
      setResetError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupAuthCode({
        email: resetEmail,
        purpose: 'PASSWORD_RESET',
      });
      setForgotPasswordStep('OTP');
      setOtp('');
      setOtpRemainingSeconds(OTP_EXPIRE_SECONDS);
      setIsOtpExpired(false);
      setResetSuccessMessage(
        response.message || '입력한 이메일로 인증코드를 발송했습니다.',
      );
    } catch (err) {
      const apiError = err as ApiError;
      setResetError(apiError.message || '인증코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setResetError('');

    if (isOtpExpired) {
      setResetError('인증코드 유효시간이 지났습니다.');
      return;
    }

    if (otp.length !== 6) {
      setResetError('인증코드 6자리를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupAuthCodeCheck({ email: resetEmail, otp });
      setForgotPasswordStep('PASSWORD');
      setResetSuccessMessage(response.message || '이메일 인증이 완료되었습니다.');
    } catch (err) {
      const apiError = err as ApiError;
      setResetError(apiError.message || '인증코드 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetError('');

    if (!newPassword || !newPasswordConfirm) {
      setResetError('새 비밀번호와 비밀번호 확인을 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setResetError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setResetError(
        '비밀번호는 8~30자의 영문, 숫자, 특수문자(@$!%*#?&)를 모두 포함해야 합니다.',
      );
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset({
        email: resetEmail,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      });

      setIsCompletionOpen(true);
    } catch (err) {
      const apiError = err as ApiError;
      setResetError(apiError.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletionClose = () => {
    setIsCompletionOpen(false);
    setIsForgotPasswordMode(false);
    setPassword('');
    setEmail(resetEmail);
    resetForgotPasswordState(resetEmail);
  };

  const formatOtpRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;
    return `${minutes}:${remainSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, nextChar: string) => {
    if (!/^\d?$/.test(nextChar)) return;

    const nextOtp = otp.split('');
    nextOtp[index] = nextChar;
    setOtp(nextOtp.join(''));

    if (nextChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pasted) return;

    setOtp(pasted);

    const nextFocusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextFocusIndex]?.focus();
  };

  const startOAuthLogin = (provider: 'google' | 'kakao' | 'naver') => {
    const redirectUri = `${window.location.origin}/oauth/callback/${provider}`;
    const loginUrl = new URL(`${BASE_URL}/api/v1/auth/${provider}/login`);
    loginUrl.searchParams.set('redirect_uri', redirectUri);
    window.location.href = loginUrl.toString();
  };

  const handleGoogleLogin = () => {
    startOAuthLogin('google');
  };

  const handleKakaoLogin = () => {
    startOAuthLogin('kakao');
  };

  const handleNaverLogin = () => {
    startOAuthLogin('naver');
  };

  const renderForgotPasswordContent = () => {
    if (forgotPasswordStep === 'EMAIL') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <h2
              style={{
                ...typography.title.sTitleB,
                color: colors.gray[800],
              }}
            >
              비밀번호 찾기
            </h2>
            <p
              style={{
                ...typography.body.BodyM,
                color: colors.gray[500],
              }}
            >
              가입한 이메일을 입력하면 인증코드를 보내드립니다.
            </p>
          </div>

          <Input
            type="email"
            label="이메일"
            placeholder="example@email.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isLoading}
            className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primary[500],
              ...typography.body.BodyM,
            }}
          >
            인증코드 보내기
          </button>
        </>
      );
    }

    if (forgotPasswordStep === 'OTP') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <h2
              style={{
                ...typography.headline.HeadlineB,
                color: colors.gray[800],
              }}
            >
              이메일로 전송된
              <br />
              인증번호를 작성해주세요!
            </h2>
          </div>

          {isOtpExpired ? (
            <div
              className="w-full p-4 rounded-lg text-center"
              style={{
                backgroundColor: '#FEE',
                color: colors.system[500],
                ...typography.label.labelM,
              }}
            >
              인증코드 유효시간이 지났습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p
                  style={{
                    ...typography.body.LBodyB,
                    color: colors.primary[500],
                  }}
                >
                  {formatOtpRemainingTime(otpRemainingSeconds)}분내로 이메일로 전송된
                </p>
                <p
                  style={{
                    ...typography.body.LBodyB,
                    color: colors.gray[400],
                  }}
                >
                  인증 번호 6자리를 정확히 입력해주세요!
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] ?? ''}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    className="h-[52px] w-[52px] rounded-xl border text-center outline-none transition-colors sm:h-[60px] sm:w-[60px]"
                    style={{
                      ...typography.body.BodyB,
                      borderColor: colors.gray[200],
                      backgroundColor: colors.gray[50],
                      color: colors.gray[800],
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading || isOtpExpired}
              className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.primary[500],
                ...typography.body.BodyM,
              }}
            >
              다음
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span
              style={{
                ...typography.body.BodyB,
                color: colors.gray[700],
              }}
            >
              인증 코드가 오지 않았을 경우
            </span>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                ...typography.body.BodyB,
                color: colors.primary[500],
              }}
            >
              재전송
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-2">
          <h2
            style={{
              ...typography.title.sTitleB,
              color: colors.gray[800],
            }}
          >
            새 비밀번호 설정
          </h2>
          <p
            style={{
              ...typography.body.BodyM,
              color: colors.gray[500],
            }}
          >
            새 비밀번호를 입력하고 다시 로그인해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Input
            type="password"
            label="새 비밀번호"
            placeholder="새 비밀번호를 입력해주세요."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPasswordToggle
            required
          />
          <Input
            type="password"
            label="새 비밀번호 확인"
            placeholder="새 비밀번호를 다시 입력해주세요."
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            showPasswordToggle
            required
          />
        </div>

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={isLoading}
          className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.primary[500],
            ...typography.body.BodyM,
          }}
        >
          비밀번호 재설정
        </button>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white flex relative">
      {isLoading && (
        <LoadingScreen
          message={
            isForgotPasswordMode ? '처리 중입니다.' : '로그인 중입니다.'
          }
          description="잠시만 기다려주세요."
        />
      )}

      {isCompletionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2
                style={{
                  ...typography.title.sTitleB,
                  color: colors.gray[800],
                }}
              >
                비밀번호 재설정 완료
              </h2>
              <p
                style={{
                  ...typography.body.BodyM,
                  color: colors.gray[500],
                }}
              >
                새 비밀번호가 저장되었습니다. 로그인 화면으로 이동합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompletionClose}
              className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: colors.primary[500],
                ...typography.body.BodyM,
              }}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      )}

      <div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `url(${loginBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 37.87%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        <div
          className="absolute left-[40px] bottom-[150px] text-white transition-opacity duration-500"
          style={{
            ...typography.headline.mHeadlineB,
          }}
        >
          <p className="mb-0">{travelDestinations[currentSlide].title}</p>
          <p>
            {travelDestinations[currentSlide].location.split(', ')[0]},{' '}
            <span className="relative inline-block">
              {travelDestinations[currentSlide].location.split(', ')[1] ||
                travelDestinations[currentSlide].location}
              <span
                className="absolute left-0 -bottom-1 w-full h-[8px]"
                style={{ backgroundColor: '#3ADD0D' }}
              ></span>
            </span>
            .
          </p>
        </div>

        <div className="absolute left-[40px] bottom-[72px] flex gap-1 items-center">
          {travelDestinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentSlide === index ? '34px' : '20px',
                height: '12px',
                backgroundColor:
                  currentSlide === index
                    ? colors.primary[500]
                    : colors.gray[300],
              }}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-[461px] flex flex-col gap-8">
          <div className="flex items-center gap-6 justify-center">
            <div
              className="flex-shrink-0"
              style={{ width: '48px', height: '30px' }}
            >
              <img
                src={mohaengLogo}
                alt="모행 로고"
                className="w-full h-full"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div
              style={{
                ...typography.headline.lHeadlineB,
                color: colors.primary[500],
              }}
            >
              MoHaeng
            </div>
          </div>

          {isForgotPasswordMode ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setResetError('');

                    if (forgotPasswordStep === 'EMAIL') {
                      closeForgotPassword();
                      return;
                    }

                    if (forgotPasswordStep === 'OTP') {
                      setForgotPasswordStep('EMAIL');
                      return;
                    }

                    setForgotPasswordStep('OTP');
                  }}
                  className="text-sm hover:underline"
                  style={{
                    ...typography.label.labelM,
                    color: colors.gray[500],
                  }}
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="text-sm hover:underline"
                  style={{
                    ...typography.label.labelM,
                    color: colors.gray[500],
                  }}
                >
                  로그인으로 돌아가기
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {renderForgotPasswordContent()}

                {resetSuccessMessage && forgotPasswordStep !== 'PASSWORD' && (
                  <div
                    className="w-full p-3 rounded-lg text-center"
                    style={{
                      backgroundColor: colors.primary[50],
                      color: colors.primary[600],
                      ...typography.label.labelM,
                    }}
                  >
                    {resetSuccessMessage}
                  </div>
                )}

                {resetError && (
                  <div
                    className="w-full p-3 rounded-lg text-center"
                    style={{
                      backgroundColor: '#FEE',
                      color: colors.system[500],
                      ...typography.label.labelM,
                    }}
                  >
                    {resetError}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                  <Input
                    type="email"
                    label="이메일"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    label="비밀번호"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPasswordToggle
                    required
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border rounded"
                        style={{
                          borderColor: colors.gray[300],
                          accentColor: colors.primary[500],
                        }}
                      />
                      <span
                        style={{
                          ...typography.label.labelM,
                          color: colors.gray[500],
                        }}
                      >
                        로그인 유지
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="text-xs hover:underline"
                      style={{
                        ...typography.label.labelM,
                        color: colors.gray[500],
                      }}
                    >
                      비밀번호 찾기
                    </button>
                  </div>

                  {error && (
                    <div
                      className="w-full p-3 rounded-lg text-center"
                      style={{
                        backgroundColor: '#FEE',
                        color: colors.system[500],
                        ...typography.label.labelM,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colors.primary[500],
                      ...typography.body.BodyM,
                    }}
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-6 items-center">
                <div
                  className="flex items-center gap-3 text-center"
                  style={{
                    ...typography.body.BodyM,
                  }}
                >
                  <span style={{ color: colors.gray[600] }}>
                    아직 계정이 없으신가요?
                  </span>
                  <Link
                    to="/signup"
                    className="underline"
                    style={{
                      color: colors.primary[500],
                      textDecorationColor: colors.primary[500],
                    }}
                  >
                    회원가입
                  </Link>
                </div>

                <div className="w-full flex items-center gap-[14px]">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: colors.gray[200] }}
                  />
                  <span
                    style={{
                      ...typography.label.labelM,
                      color: colors.gray[300],
                    }}
                  >
                    SNS로 로그인하기
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: colors.gray[200] }}
                  />
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full h-[50px] flex items-center justify-center gap-3 rounded border transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: colors.gray[200],
                      borderWidth: '0.4px',
                      ...typography.body.BodyM,
                      color: colors.black.black100,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M15.68 8.184c0-.656-.06-1.136-.2-1.64H8v2.976h4.4c-.12.768-.592 1.848-1.632 2.576v2.056h2.528c1.512-1.384 2.384-3.432 2.384-5.968z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.768 12.104c-.664.472-1.568.8-2.768.8-2.112 0-3.904-1.392-4.544-3.32H.848v2.016C2.176 14.2 4.872 16 8 16c2.16 0 3.968-.712 5.296-1.936l-2.528-1.96z"
                        fill="#34A853"
                      />
                      <path
                        d="M3.192 8c0-.552.096-1.08.256-1.576V4.408H.848A7.978 7.978 0 000 8c0 1.288.312 2.512.848 3.592l2.6-2.016c-.16-.496-.256-1.024-.256-1.576z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M8 3.104c1.504 0 2.504.648 3.08 1.184l2.272-2.208C11.968.792 10.16 0 8 0 4.872 0 2.176 1.8.848 4.408l2.6 2.016C4.096 4.496 5.888 3.104 8 3.104z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google로 계속하기
                  </button>

                  <button
                    type="button"
                    onClick={handleKakaoLogin}
                    className="w-full h-[50px] flex items-center justify-center gap-3 rounded transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: colors.yellowGreen.yellow100,
                      ...typography.body.BodyM,
                      color: colors.black.black100,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M8 0C3.582 0 0 2.77 0 6.182c0 2.268 1.559 4.251 3.89 5.32-.159.588-.614 2.325-.707 2.694-.118.466.17.461.357.335.148-.1 2.395-1.59 2.776-1.854.537.074 1.09.114 1.684.114 4.418 0 8-2.77 8-6.182S12.418 0 8 0z"
                        fill="#000000"
                      />
                    </svg>
                    카카오로 계속하기
                  </button>

                  <button
                    type="button"
                    onClick={handleNaverLogin}
                    className="w-full h-[50px] flex items-center justify-center gap-3 rounded transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: colors.yellowGreen.green100,
                      ...typography.body.BodyM,
                      color: colors.white.white100,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M10.667 8.533l-4.8-6.4H2v11.734h3.333V7.467l4.8 6.4H14V2.133h-3.333v6.4z"
                        fill="white"
                      />
                    </svg>
                    네이버로 계속하기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
