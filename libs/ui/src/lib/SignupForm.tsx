import { useState } from 'react';

export interface SignupFormProps {
  onSignup?: (data: SignupData) => Promise<void>;
  onGoogleSignup?: () => void;
  onKakaoSignup?: () => void;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export function SignupForm({ onSignup, onGoogleSignup, onKakaoSignup }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2 && email) {
      setStep(3);
    } else if (step === 3 && password) {
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signupData: SignupData = {
        name,
        email,
        password,
        passwordConfirm: confirmPassword,
      };

      await onSignup?.(signupData);
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 진행 표시 - 상단 고정 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 - 중앙 배치 */}
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-full max-w-lg px-6">
        {/* Step 1: 이름 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">이름을 알려주세요</h1>
              <p className="text-gray-600">회원가입을 위해 이름이 필요해요</p>
            </div>
            <form onSubmit={handleNext}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors"
                placeholder="홍길동"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!name}
                className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </form>
          </div>
        )}

        {/* Step 2: 이메일 */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">이메일을 입력해주세요</h1>
              <p className="text-gray-600">로그인에 사용할 이메일이에요</p>
            </div>
            <form onSubmit={handleNext}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors"
                placeholder="example@email.com"
                autoFocus
                required
              />
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-24 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!email}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: 비밀번호 */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호를 설정해주세요</h1>
              <p className="text-gray-600">최소 8자 이상 입력해주세요</p>
            </div>
            <form onSubmit={handleNext}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors"
                placeholder="••••••••"
                autoFocus
                required
                minLength={8}
              />
              {password && password.length < 8 && (
                <p className="mt-2 text-sm text-red-500">비밀번호는 최소 8자 이상이어야 합니다</p>
              )}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-24 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!password || password.length < 8}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: 비밀번호 확인 및 약관 동의 */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호를 확인해주세요</h1>
              <p className="text-gray-600">위에서 입력한 비밀번호를 다시 입력해주세요</p>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors"
                placeholder="••••••••"
                autoFocus
                required
                minLength={8}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-sm text-red-500">비밀번호가 일치하지 않습니다</p>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">이용약관</a> 및{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">개인정보처리방침</a>에 동의합니다
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-24 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!confirmPassword || password !== confirmPassword || isLoading}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? '회원가입 중...' : '회원가입 완료'}
                </button>
              </div>
            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
