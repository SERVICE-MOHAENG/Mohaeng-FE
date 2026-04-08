import { useEffect, useState } from 'react';
import {
  ApiError,
  login,
  signup,
  signupAuthCode,
  signupAuthCodeCheck,
} from '@mohang/ui';

type Step = 'NAME' | 'PASSWORD' | 'EMAIL' | 'AUTH_CODE' | 'DONE';
type SignupField = 'name' | 'email' | 'password' | 'authCode';

interface SignupFlowParams {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  authCode: string;
  setFieldError: (field: SignupField, message: string) => void;
  clearFieldErrors: () => void;
  setIsLoading: (v: boolean) => void;
}

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;

export function useSignupFlow({
  name,
  email,
  password,
  passwordConfirm,
  authCode,
  setFieldError,
  clearFieldErrors,
  setIsLoading,
}: SignupFlowParams) {
  const [step, setStep] = useState<Step>('NAME');

  useEffect(() => {
    clearFieldErrors();
  }, [step, clearFieldErrors]);

  const validateEmailStep = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    try {
      setIsLoading(true);
      await signupAuthCode({ email });
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      setFieldError('email', apiError.message || '인증번호 전송에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordStep = () => {
    if (!password || !passwordConfirm) {
      setFieldError('password', '비밀번호를 입력해주세요.');
      return false;
    }

    if (password !== passwordConfirm) {
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setFieldError(
        'password',
        '비밀번호는 8~30자의 영문, 숫자, 특수문자(@$!%*#?&)를 모두 포함해야 합니다.',
      );
      return false;
    }

    return true;
  };

  const validateNameStep = () => {
    if (!name) {
      setFieldError('name', '이름을 입력해주세요.');
      return false;
    }

    return true;
  };

  const validateAuthCodeStep = async () => {
    if (!authCode) {
      setFieldError('authCode', '인증번호를 입력해주세요.');
      return false;
    }

    try {
      setIsLoading(true);
      await signupAuthCodeCheck({ email, otp: authCode, purpose: 'SIGNUP' });
      await signup({
        name,
        email,
        password,
        passwordConfirm,
      });

      try {
        await login({ email, password });
      } catch {
        // 회원가입 성공 후 자동 로그인 실패는 플로우를 막지 않음
      }

      setStep('DONE');
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      setFieldError('authCode', apiError.message || '인증번호 확인에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onClickNext = async () => {
    clearFieldErrors();

    if (step === 'NAME' && validateNameStep()) setStep('PASSWORD');
    else if (step === 'PASSWORD' && validatePasswordStep()) setStep('EMAIL');
    else if (step === 'EMAIL' && (await validateEmailStep()))
      setStep('AUTH_CODE');
    else if (step === 'AUTH_CODE' && (await validateAuthCodeStep()))
      setStep('DONE');
  };

  const onclickBack = () => {
    clearFieldErrors();

    if (step === 'NAME') return;
    if (step === 'PASSWORD') setStep('NAME');
    else if (step === 'EMAIL') setStep('PASSWORD');
    else if (step === 'AUTH_CODE') setStep('EMAIL');
    else if (step === 'DONE') setStep('AUTH_CODE');
  };

  return {
    step,
    onClickNext,
    onclickBack,
  };
}
