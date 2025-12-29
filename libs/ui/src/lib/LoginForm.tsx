import { useState } from 'react';
import LogoImage from '../assets/BI.svg';

export interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onKakaoLogin?: () => void;
}

export function LoginForm({ onLogin, onGoogleLogin, onKakaoLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(email, password);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/MOHAENG_BRAND_BANNER.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
        }}
      ></div>
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <img src={LogoImage} alt="모행 로고" className="h-12" />
            <span className="text-4xl font-bold text-white" style={{ fontFamily: 'Paperozi' }}>
              모행
            </span>
          </div>
          <p className="text-white text-lg font-medium">
            당신의 모든 여행을 함께
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-gray-600">로그인 유지</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                비밀번호 찾기
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              로그인
            </button>

            {/* 회원가입 링크 */}
            <div className="text-center text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                회원가입
              </a>
            </div>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
                <path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"/>
                <path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"/>
                <path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"/>
              </svg>
              Google로 계속하기
            </button>

            <button
              type="button"
              onClick={onKakaoLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium"
              style={{ backgroundColor: '#FEE500', color: '#000000' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 3.462 0 7.727c0 2.836 1.949 5.314 4.862 6.65-.198.736-.767 2.907-.884 3.368-.147.583.213.577.447.419.185-.125 2.994-1.987 3.47-2.317.671.093 1.362.143 2.105.143 5.523 0 10-3.462 10-7.727S15.523 0 10 0z" fill="#000000"/>
              </svg>
              카카오로 계속하기
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} 모행. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
