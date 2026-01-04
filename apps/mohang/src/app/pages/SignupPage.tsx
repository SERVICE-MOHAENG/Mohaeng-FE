import { SignupForm, SignupData } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import { signup, ApiError } from '../../api/auth';

export function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = async (data: SignupData) => {
    try {
      const response = await signup(data);
      console.log('회원가입 성공:', response);
      alert(`회원가입이 완료되었습니다! ${response.name}님 환영합니다.`);
      navigate('/login');
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google 회원가입');
    // TODO: Google OAuth 처리
  };

  const handleKakaoSignup = () => {
    console.log('카카오 회원가입');
    // TODO: 카카오 OAuth 처리
  };

  return (
    <SignupForm
      onSignup={handleSignup}
      onGoogleSignup={handleGoogleSignup}
      onKakaoSignup={handleKakaoSignup}
    />
  );
}

export default SignupPage;
