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
        <div className="w-full max-w-[461px] mx-auto flex flex-col gap-3">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
