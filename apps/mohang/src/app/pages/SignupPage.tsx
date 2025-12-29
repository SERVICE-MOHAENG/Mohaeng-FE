import { SignupForm, SignupData } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';

export function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = (data: SignupData) => {
    console.log('회원가입 시도:', data);
    // TODO: 실제 회원가입 API 호출
    // 회원가입 성공 시 로그인 페이지로 이동
    navigate('/login');
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
