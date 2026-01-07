import { Link } from 'react-router-dom';
import { colors, typography } from '@mohang/ui';
import mohaengLogo from '../../../assets/images/mohaeng-logo.svg';
import { SignupForm } from './SignupForm';

export function SignupPage() {
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
              <img
                src={mohaengLogo}
                alt="모행 로고"
                className="w-full h-full object-contain"
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
          <SignupForm />
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
