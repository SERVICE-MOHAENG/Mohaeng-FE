import { Link } from 'react-router-dom';
import { colors, typography } from '@mohang/ui';
import mohaengLogo from '../../../assets/images/mohaeng-logo.svg';
import { SignupForm } from './SignupForm';

export function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white justify-center items-center">
      {/* Logo & Title */}
      <div className="w-full flex items-center gap-6 box-border p-4 bg-white">
        <div className="w-10 h-10">
          <img
            src={mohaengLogo}
            alt="모행 로고"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          style={{
            ...typography.title.TitleB,
            color: colors.primary[500],
          }}
        >
          MoHaeng
        </div>
      </div>
      {/* Signup Form Container */}
      <div className="w-1/2 flex flex-col flex-1 items-center justify-center">
        <div
          className="flex items-center justify-center w-full max-w-[621px] rounded-xl px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-[60px]"
          style={{ backgroundColor: colors.gray[50] }}
        >
          <div className="w-full max-w-[461px] mx-auto flex flex-col gap-3">
            <SignupForm />
            {/* Login Link */}
            <div className="flex items-center justify-center">
              <div
                className="flex items-center gap-3 text-center"
                style={{
                  ...typography.body.BodyM,
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
    </div>
  );
}

export default SignupPage;
