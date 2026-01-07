import { useState, useEffect } from 'react';
import {
  signupAuthCode,
  signupAuthCodeCheck,
  ApiError,
  signup,
} from '../../../../api/auth';
import { useNavigate } from 'react-router-dom';

type Step = 'NAME' | 'PASSWORD' | 'EMAIL' | 'AUTH_CODE' | 'DONE';

interface SignupFlowParams {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  authCode: string;
  setGeneralError: (msg: string) => void;
  setIsLoading: (v: boolean) => void;
}

export function useSignupFlow({
  name,
  email,
  password,
  passwordConfirm,
  authCode,
  setGeneralError,
  setIsLoading,
}: SignupFlowParams) {
  const [step, setStep] = useState<Step>('NAME');
  const nav = useNavigate();

  useEffect(() => {
    setGeneralError('');
  }, [step]);

  const validateEmailStep = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setGeneralError('이메일 형식이 올바르지 않습니다.');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await signupAuthCode({ email });
      console.log('응답 데이터:', response);

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      setGeneralError(apiError.message || '인증번호 전송에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordStep = () => {
    if (!password || !passwordConfirm) {
      setGeneralError('비밀번호를 입력해주세요.');
      return false;
    }

    if (password !== passwordConfirm) {
      setGeneralError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const emailRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
    if (!emailRegex.test(password)) {
      setGeneralError(
        '비밀번호는 8~30자의 영문, 숫자, 특수문자(@$!%*#?&)를 모두 포함해야 합니다',
      );
      return false;
    }

    return true;
  };

  const validateNameStep = () => {
    if (!name) {
      setGeneralError('이름을 입력해주세요.');
      return false;
    }
    return true;
  };

  const validateAuthCodeStep = async () => {
    if (!authCode) {
      setGeneralError('인증번호를 입력해주세요.');
      return false;
    }
    try {
      setIsLoading(true);
      const response = await signupAuthCodeCheck({ email, otp: authCode });
      console.log('응답 데이터:', response);
      const loginData = await signup({
        name,
        email,
        password,
        passwordConfirm,
      });
      console.log('회원가입 응답 데이터:', loginData);
      setStep('DONE');

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      setGeneralError(apiError.message || '인증번호 확인에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onClickNext = async () => {
    console.log('next');
    if (step === 'NAME' && validateNameStep()) {
      setStep('PASSWORD');
    } else if (step === 'PASSWORD' && validatePasswordStep()) {
      setStep('EMAIL');
    } else if (step === 'EMAIL' && (await validateEmailStep())) {
      setStep('AUTH_CODE');
    } else if (step === 'AUTH_CODE' && (await validateAuthCodeStep())) {
      setStep('DONE');
    }
  };

  const onclickBack = () => {
    console.log('back');
    if (step === 'NAME') return;
    if (step === 'PASSWORD') {
      setStep('NAME');
    } else if (step === 'EMAIL') {
      setStep('PASSWORD');
    } else if (step === 'AUTH_CODE') {
      setStep('EMAIL');
    }
  };
  return {
    step,
    onClickNext,
    onclickBack,
  };
}
