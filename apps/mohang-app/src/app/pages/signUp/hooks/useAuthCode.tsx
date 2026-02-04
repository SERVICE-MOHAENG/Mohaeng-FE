'use client';

import { colors, typography } from '@mohang/ui';
import { signupAuthCode } from '@mohang/ui';

export const useAuthCode = ({ email }: { email: string }) => {
  const onClickResend = () => {
    signupAuthCode({ email });
  };

  return {
    onClickResend,
  };
};

export const LoginLink = ({ email }: { email: string }) => (
  <div className="flex items-center justify-center">
    <div
      className="flex items-center gap-3 text-center"
      style={{
        ...typography.body.BodyM,
      }}
    >
      <span style={{ color: colors.gray[600] }}>
        인증 코드가 오지 않았을 경우
      </span>
      <button
        onClick={() => signupAuthCode({ email })}
        className="underline"
        style={{
          color: colors.primary[500],
          textDecorationColor: colors.primary[500],
        }}
      >
        재전송
      </button>
    </div>
  </div>
);
