import { LoginForm } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    console.log('로그인 시도:', { email, password });
    // TODO: 실제 로그인 API 호출
    // 로그인 성공 시 홈으로 이동
    navigate('/');
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인');
    // TODO: Google OAuth 처리
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
    // TODO: 카카오 OAuth 처리
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onKakaoLogin={handleKakaoLogin}
    />
  );
}

export default LoginPage;
