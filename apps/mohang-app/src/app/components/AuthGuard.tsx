import React, { useEffect, useState } from 'react';
import {
  getAccessToken,
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

  useEffect(() => {
    const token = getAccessToken();

    if (token && token !== 'undefined') {
      setIsAuthChecking(false);
      return;
    }

    clearTokens();
    window.location.replace('/login');
  }, []);

  if (isAuthChecking) {
    return (
      <LoadingScreen
        message="로그인 정보를 확인하고 있습니다"
        description="잠시만 기다려주세요"
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
