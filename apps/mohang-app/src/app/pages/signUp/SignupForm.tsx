import { useEffect, useState } from 'react';
import { EmailInput } from './components/email';
import { AuthCodeInput } from './components/authCode';
import { PasswordInput } from './components/password';
import { NameInput } from './components/name';
import { colors, typography } from '@mohang/ui';
import { useSignupFlow } from './hooks/useSignupFlow';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './components/ProgressBar';
import { useTime } from './hooks/useTime';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { step, onClickNext, onclickBack } = useSignupFlow({
    name,
    email,
    password,
    passwordConfirm,
    authCode,
    setGeneralError,
    setIsLoading,
  });
  const { formattedTime } = useTime({ step });
  const nav = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClickNext();
  };

  useEffect(() => {
    if (step === 'DONE') {
      nav('/login');
    }
  }, [step]);

  const titleStlye = {
    ...typography.headline.LHeadlineM,
    color: colors.black.black100,
  };

  const subtitleStlye = {
    ...typography.body.BodyM,
    color: colors.gray[400],
  };

  const title = {
    Name: '이름을 알려주세요',
    Email: '이메일을 알려주세요',
    AuthCode: (
      <>
        이메일로 전송된
        <br />
        인증번호를 작성해주세요!
      </>
    ),
    Password: '비밀번호를 입력해주세요!',
  };

  const subtitle = {
    Name: '회원가입을 위해 이름을 알려주세요.',
    Email: '회원가입을 위해 이메일을 알려주세요.',
    AuthCode: (
      <>
        {formattedTime}분내로 이메일로 전송된
        <br />
        인증 번호 6자리를 정확히 입력해주세요!
      </>
    ),
    Password: '다른 사용자가\n유추하기 어렵게 설정해주세요!',
  };

  return (
    <>
      {/* Signup Form */}
      <ProgressBar currentStep={step} />
      <form className="flex flex-col gap-7" onSubmit={onSubmit} noValidate>
        {/* General Error Message */}
        {generalError && (
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: colors.error?.[50] || '#FEE2E2',
              border: `1px solid ${colors.error?.[200] || '#FECACA'}`,
            }}
          >
            <p
              style={{
                ...typography.body.BodyM,
                color: colors.error?.[600] || '#DC2626',
              }}
            >
              {generalError}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* title */}
          <div>
            {step === 'NAME' && <p style={titleStlye}>{title.Name}</p>}
            {step === 'EMAIL' && <p style={titleStlye}>{title.Email}</p>}
            {step === 'AUTH_CODE' && <p style={titleStlye}>{title.AuthCode}</p>}
            {step === 'PASSWORD' && <p style={titleStlye}>{title.Password}</p>}
          </div>

          {/* Subtitle */}
          <div>
            {step === 'NAME' && <p style={subtitleStlye}>{subtitle.Name}</p>}
            {step === 'EMAIL' && <p style={subtitleStlye}>{subtitle.Email}</p>}
            {step === 'AUTH_CODE' && (
              <p style={subtitleStlye}>{subtitle.AuthCode}</p>
            )}
            {step === 'PASSWORD' && (
              <p style={subtitleStlye}>{subtitle.Password}</p>
            )}
          </div>
        </div>

        {/* Input Fields */}
        {step === 'NAME' && <NameInput value={name} onChange={setName} />}
        {step === 'EMAIL' && <EmailInput value={email} onChange={setEmail} />}
        {step === 'AUTH_CODE' && (
          <AuthCodeInput value={authCode} onChange={setAuthCode} />
        )}
        {step === 'PASSWORD' && (
          <PasswordInput
            value={password}
            onChange={setPassword}
            passwordConfirm={passwordConfirm}
            onChangePasswordConfirm={setPasswordConfirm}
          />
        )}

        {/* Signup Button */}
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
            {isLoading ? '인증번호 전송중...' : '다음'}
          </button>
        </div>
      </form>
    </>
  );
}
