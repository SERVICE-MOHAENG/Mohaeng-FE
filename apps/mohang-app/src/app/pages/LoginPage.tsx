import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@mohang/ui';
import { colors, typography } from '@mohang/ui';
import loginBgImage from '../../assets/images/login-bg.jpg';
import mohaengLogo from '../../assets/images/mohaeng-logo.svg';
import { login, ApiError } from '../../api/auth';

const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://mohaeng-api-stag.dsmhs.kr';

const travelDestinations = [
  { title: '1박 2일 추천 여행지.', location: '일본, 오사카' },
  { title: '주말 여행 추천지.', location: '제주도' },
  { title: '3박 4일 추천 여행지.', location: '베트남, 다낭' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // 자동 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % travelDestinations.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      // 토큰 저장
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // 로그인 유지 옵션 저장
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // 로그인 성공 - 메인 페이지로 이동
      navigate('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // 백엔드 Google OAuth 시작 엔드포인트로 리다이렉트
    // 백엔드에서 Google 로그인 페이지로 302 리다이렉트 처리
    window.location.href = `${BASE_URL}/api/v1/auth/google/login`;
  };

  const handleKakaoLogin = () => {
    // 백엔드 Kakao OAuth 시작 엔드포인트로 리다이렉트
    window.location.href = `${BASE_URL}/api/v1/auth/kakao/login`;
  };

  const handleNaverLogin = () => {
    // 백엔드 Naver OAuth 시작 엔드포인트로 리다이렉트
    window.location.href = `${BASE_URL}/api/v1/auth/naver/login`;
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
      {/* Left Section - Image with Carousel */}
      <div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: `url(${loginBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 37.87%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* Text Content - Carousel */}
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

        {/* Carousel Indicators */}
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

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-[461px] flex flex-col gap-8">
          {/* Logo & Title */}
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Input Fields */}
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

            {/* Remember Me & Forgot Password */}
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
                <a
                  href="#"
                  className="text-xs hover:underline"
                  style={{
                    ...typography.label.labelM,
                    color: colors.gray[500],
                  }}
                >
                  비밀번호 찾기
                </a>
              </div>

              {/* Error Message */}
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

              {/* Login Button */}
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

          {/* Signup Link & SNS Login */}
          <div className="flex flex-col gap-6 items-center">
            {/* Signup Link */}
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

            {/* Divider */}
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

            {/* SNS Login Buttons */}
            <div className="w-full flex flex-col gap-3">
              {/* Google */}
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

              {/* Kakao */}
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

              {/* Naver */}
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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
