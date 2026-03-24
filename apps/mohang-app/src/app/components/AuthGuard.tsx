import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAccessToken,
  getRefreshToken,
  refreshToken,
  clearTokens,
  LoadingScreen,
} from '@mohang/ui';

interface AuthGuardProps {
  children: React.ReactNode;
}

const initialToken = getAccessToken();

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthChecking, setIsAuthChecking] = useState(
    !initialToken || initialToken === 'undefined',
  );
  const [loadingMessage, setLoadingMessage] =
    useState('로그인 정보를 확인하고 있습니다');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      const refresh = getRefreshToken();

      if (token && token !== 'undefined') {
        setIsAuthChecking(false);
        return;
      }

      if (refresh && refresh !== 'undefined') {
        try {
          setLoadingMessage('로그인 세션을 복구하고 있습니다');
          await refreshToken(refresh);
          setIsAuthChecking(false);
          return;
        } catch (error) {
          console.error('[AuthGuard] Token refresh failed:', error);
        }
      }

      clearTokens();
      navigate('/login', { replace: true });
    };

    checkAuth();
  }, [navigate]);

  if (isAuthChecking) {
    return (
      <LoadingScreen
        message={loadingMessage}
        description="잠시만 기다려주세요"
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
