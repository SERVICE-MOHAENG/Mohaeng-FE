import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, getRefreshToken, refreshToken } from '@mohang/ui';
import LoadingOverlay from './LoadingOverlay';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loadingMessage, setLoadingMessage] =
    useState('로그인 정보를 확인하고 있습니다');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      const refresh = getRefreshToken();

      console.log('[AuthGuard] Checking tokens...');

      if (!token || token === 'undefined') {
        if (refresh && refresh !== 'undefined') {
          try {
            console.log(
              '[AuthGuard] Access token missing, attempting refresh...',
            );
            setLoadingMessage('로그인 세션을 연장하고 있습니다');
            await refreshToken(refresh);
            console.log('[AuthGuard] Token refreshed successfully');
            setIsAuthChecking(false);
          } catch (error) {
            console.error('[AuthGuard] Token refresh failed:', error);
            setLoadingMessage(
              '로그인이 필요합니다. 로그인 페이지로 이동합니다',
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
            navigate('/login');
          }
        } else {
          console.log(
            '[AuthGuard] No valid tokens found, redirecting in 3s...',
          );
          setLoadingMessage(
            '로그인 정보가 없습니다. 로그인 페이지로 이동합니다',
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          navigate('/login');
        }
      } else {
        console.log('[AuthGuard] Token valid');
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthChecking) {
    return <LoadingOverlay message={loadingMessage} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
