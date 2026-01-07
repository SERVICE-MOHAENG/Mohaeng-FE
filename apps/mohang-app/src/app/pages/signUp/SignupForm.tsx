import { useEffect, useState } from 'react';
import { EmailInput } from './components/email';
import { AuthCodeInput } from './components/authCode';
import { PasswordInput } from './components/password';
import { NameInput } from './components/name';
import { colors, typography } from '@mohang/ui';
import { useSignupFlow } from './hooks/useSignupFlow';
import { useNavigate } from 'react-router-dom';

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

  return (
    <>
      {/* Signup Form */}
      <form className="flex flex-col gap-10" onSubmit={onSubmit} noValidate>
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
                ...typography.body.bodyS,
                color: colors.error?.[600] || '#DC2626',
              }}
            >
              {generalError}
            </p>
          </div>
        )}

        {/* Input Fields */}
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
        {step === 'NAME' && <NameInput value={name} onChange={setName} />}

        {/* Signup Button */}
        <div className="flex items-center gap-4">
          {step != 'NAME' && (
            <button
              type="button"
              style={{
                ...typography.body.bodyM,
                backgroundColor: colors.primary[500],
              }}
              className="w-1/3 h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onclickBack}
            >
              이전
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primary[500],
              ...typography.body.bodyM,
            }}
          >
            {isLoading
              ? '인증번호 전송중...'
              : step == 'EMAIL'
                ? '인증번호 전송'
                : '다음'}
          </button>
        </div>
      </form>
    </>
  );
}
