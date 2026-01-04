import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@mohang/ui';
import { colors, typography } from '@mohang/ui';
import mohaengLogo from '../../assets/images/mohaeng-logo.svg';
import { signup, ApiError } from '../../api/auth';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 에러 초기화
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
      return;
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // API 호출
    setIsLoading(true);

    try {
      const response = await signup({
        name,
        email,
        password,
        passwordConfirm,
      });

      console.log('회원가입 성공:', response);
      alert(`회원가입이 완료되었습니다! ${response.name}님 환영합니다.`);
      navigate('/login');
    } catch (error) {
      const apiError = error as ApiError;

      // 상태 코드에 따라 다른 에러 처리
      if (apiError.statusCode === 400) {
        setGeneralError(apiError.message || '이미 가입된 이메일이거나 잘못된 요청입니다.');
      } else {
        setGeneralError(apiError.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 sm:px-6 py-10">
      {/* Signup Form Container */}
      <div
        className="w-full max-w-[621px] rounded-xl px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-[60px]"
        style={{ backgroundColor: colors.gray[50] }}
      >
        <div className="w-full max-w-[461px] mx-auto flex flex-col gap-8">
          {/* Logo & Title */}
          <div className="flex items-center gap-6 justify-center">
            <div className="w-12 h-12">
              <img src={mohaengLogo} alt="모행 로고" className="w-full h-full object-contain" />
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* General Error Message */}
            {generalError && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: colors.error?.[50] || '#FEE2E2', border: `1px solid ${colors.error?.[200] || '#FECACA'}` }}>
                <p style={{ ...typography.body.bodyS, color: colors.error?.[600] || '#DC2626' }}>
                  {generalError}
                </p>
              </div>
            )}

            {/* Input Fields */}
            <div className="flex flex-col gap-6">
              <Input
                type="text"
                label="이름"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                label="이메일"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                error={emailError}
                required
              />
              <Input
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                showPasswordToggle
                required
              />
              <Input
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력해주세요."
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setPasswordError('');
                }}
                error={passwordError}
                showPasswordToggle
                required
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.primary[500],
                ...typography.body.bodyM,
              }}
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>

          {/* Login Link */}
          <div className="flex items-center justify-center">
            <div
              className="flex items-center gap-3 text-center"
              style={{
                ...typography.body.bodyM,
              }}
            >
              <span style={{ color: colors.gray[600] }}>
                이미 계정이 있으신가요?
              </span>
              <Link
                to="/login"
                className="underline"
                style={{
                  color: colors.primary[500],
                  textDecorationColor: colors.primary[500],
                }}
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
