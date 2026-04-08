import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, LoadingScreen, typography } from '@mohang/ui';
import { AuthCodeInput } from './components/authCode';
import { EmailInput } from './components/email';
import { NameInput } from './components/name';
import { PasswordInput } from './components/password';
import { ProgressBar } from './components/ProgressBar';
import { LoginLink } from './hooks/useAuthCode';
import { useSignupFlow } from './hooks/useSignupFlow';
import { useTime } from './hooks/useTime';

type SignupField = 'name' | 'email' | 'password' | 'authCode';

type FieldErrors = Record<SignupField, string>;

const EMPTY_ERRORS: FieldErrors = {
  name: '',
  email: '',
  password: '',
  authCode: '',
};

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const clearFieldErrors = useCallback(() => {
    setFieldErrors(EMPTY_ERRORS);
  }, []);

  const setFieldError = useCallback((field: SignupField, message: string) => {
    setFieldErrors((prev) => ({
      ...EMPTY_ERRORS,
      ...prev,
      [field]: message,
    }));
  }, []);

  const { step, onClickNext } = useSignupFlow({
    name,
    email,
    password,
    passwordConfirm,
    authCode,
    setFieldError,
    clearFieldErrors,
    setIsLoading,
  });

  const { formattedTime, remainingTime } = useTime({ step });
  const nav = useNavigate();

  const handleNameChange = (nextValue: string) => {
    setName(nextValue);
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (nextValue: string) => {
    setEmail(nextValue);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleAuthCodeChange = (nextValue: string) => {
    setAuthCode(nextValue);
    if (fieldErrors.authCode) {
      setFieldErrors((prev) => ({ ...prev, authCode: '' }));
    }
  };

  const handlePasswordChange = (nextValue: string) => {
    setPassword(nextValue);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handlePasswordConfirmChange = (nextValue: string) => {
    setPasswordConfirm(nextValue);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onClickNext();
  };

  useEffect(() => {
    if (step === 'DONE') {
      nav('/survey');
    }
  }, [nav, step]);

  const titleStyle = {
    ...typography.headline.LHeadlineM,
    color: colors.black.black100,
  };

  const subtitleStyle = {
    ...typography.body.BodyM,
    color: colors.gray[400],
  };

  const title = {
    NAME: '이름을 알려주세요',
    EMAIL: '이메일을 알려주세요',
    AUTH_CODE: (
      <>
        이메일로 전송된
        <br />
        인증번호를 작성해주세요!
      </>
    ),
    PASSWORD: '비밀번호를 입력해주세요!',
  } as const;

  const subtitle = {
    NAME: '회원가입을 위해 이름을 알려주세요',
    EMAIL: '회원가입을 위해 이메일을 알려주세요',
    AUTH_CODE: (
      <>
        {formattedTime}분내로 이메일로 전송된
        <br />
        인증 번호 6자리를 정확히 입력해주세요!
      </>
    ),
    PASSWORD: '다른 사용자가 유추하기 어렵게 설정해주세요!',
  } as const;

  return (
    <>
      {isLoading && (
        <LoadingScreen
          message="처리 중입니다."
          description="잠시만 기다려주세요"
        />
      )}

      <ProgressBar currentStep={step} />

      <form className="flex flex-col gap-7" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-4">
          <div>
            {step === 'NAME' && <p style={titleStyle}>{title.NAME}</p>}
            {step === 'EMAIL' && <p style={titleStyle}>{title.EMAIL}</p>}
            {step === 'AUTH_CODE' && <p style={titleStyle}>{title.AUTH_CODE}</p>}
            {step === 'PASSWORD' && <p style={titleStyle}>{title.PASSWORD}</p>}
          </div>

          <div>
            {step === 'NAME' && <p style={subtitleStyle}>{subtitle.NAME}</p>}
            {step === 'EMAIL' && <p style={subtitleStyle}>{subtitle.EMAIL}</p>}
            {step === 'AUTH_CODE' && remainingTime > 0 && (
              <p style={subtitleStyle}>{subtitle.AUTH_CODE}</p>
            )}
            {step === 'PASSWORD' && (
              <p style={subtitleStyle}>{subtitle.PASSWORD}</p>
            )}
          </div>
        </div>

        {step === 'NAME' && (
          <NameInput
            value={name}
            onChange={handleNameChange}
            onEnter={() => void onClickNext()}
            error={fieldErrors.name}
          />
        )}

        {step === 'EMAIL' && (
          <EmailInput
            value={email}
            onChange={handleEmailChange}
            onEnter={() => void onClickNext()}
            error={fieldErrors.email}
          />
        )}

        {step === 'AUTH_CODE' && (
          <>
            {remainingTime > 0 ? (
              <AuthCodeInput
                value={authCode}
                onChange={handleAuthCodeChange}
                onEnter={() => void onClickNext()}
                error={fieldErrors.authCode}
              />
            ) : (
              <div
                className="flex justify-center"
                style={{
                  ...typography.body.BodyM,
                  color: colors.system[500],
                }}
              >
                인증번호 유효시간이 종료되었습니다.
              </div>
            )}
          </>
        )}

        {step === 'PASSWORD' && (
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            passwordConfirm={passwordConfirm}
            onChangePasswordConfirm={handlePasswordConfirmChange}
            onEnter={() => void onClickNext()}
            passwordError={fieldErrors.password}
          />
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primary[500],
              ...typography.body.BodyM,
            }}
          >
            {isLoading ? '처리 중...' : '다음'}
          </button>
        </div>
      </form>

      {step === 'AUTH_CODE' && <LoginLink email={email} />}
    </>
  );
}
