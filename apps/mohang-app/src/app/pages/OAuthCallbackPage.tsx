import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  exchangeOAuthCode,
  ApiError,
  LoadingScreen,
  setAccessToken,
  setRefreshToken,
} from '@mohang/ui';
import { colors, typography } from '@mohang/ui';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      try {
        // URL에서 인증 관련 파라미터 추출
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const errorCode = searchParams.get('errorCode');
        const messageParam = searchParams.get('message');
        const errorParam = searchParams.get('error');
        const code = searchParams.get('code');

        console.log('OAuth Callback Params:', {
          accessToken: accessToken ? 'EXISTS' : 'NONE',
          refreshToken: refreshToken ? 'EXISTS' : 'NONE',
          errorCode,
          messageParam,
          errorParam,
          code: code ? 'EXISTS' : 'NONE',
        });

        // 백엔드에서 인증 완료 후 토큰을 직접 넘겨준 경우 (Backend-driven success)
        if (accessToken && refreshToken) {
          console.log('OAuth Success: Direct tokens received from backend');
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate('/', { replace: true });
          return;
        }

        // 백엔드에서 자체 에러 코드로 리다이렉트한 경우 (Backend-driven error)
        if (errorCode) {
          const exactMessage = messageParam || errorCode;
          console.error('OAuth backend error:', errorCode, exactMessage);
          setError(exactMessage);
          setIsProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 표준 OAuth 에러가 발생한 경우
        if (errorParam) {
          const exactMessage = messageParam || errorParam;
          console.error('OAuth standard error:', exactMessage);
          setError('OAuth 인증이 취소되었습니다.');
          setIsProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 인증 코드(code)가 있는 경우 토큰 교환 (Frontend-intermediary flow)
        if (code) {
          console.log('OAuth Flow: Exchanging code for tokens');
          const result = await exchangeOAuthCode(code);
          if (!result.success) {
            console.error('OAuth Exchange Failure:', result);
            setError('OAuth 인증에 실패했습니다.');
            setIsProcessing(false);
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          console.log('OAuth Success: Code exchanged successfully');
          navigate('/', { replace: true });
          return;
        }

        // 아무 정보가 없는 경우
        console.error('OAuth callback error: 유효한 인증 정보가 없습니다.');
        setError('인증 정보가 없습니다.');
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'OAuth 인증에 실패했습니다.');
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    if (!hasProcessed.current) {
      processOAuthCallback();
    }
  }, [searchParams, navigate, location]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {isProcessing && (
          <LoadingScreen
            message="로그인 처리 중"
            description="잠시만 기다려주세요"
          />
        )}
        {error ? (
          <>
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#FEE',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke={colors.system[500]}
                    strokeWidth="2"
                  />
                  <path
                    d="M16 10V18M16 22H16.01"
                    stroke={colors.system[500]}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <h1
              className="mb-2"
              style={{
                ...typography.headline.lHeadlineB,
                color: colors.gray[800],
              }}
            >
              로그인 실패
            </h1>
            <p
              className="mb-4"
              style={{
                ...typography.body.BodyM,
                color: colors.system[500],
              }}
            >
              {error}
            </p>
            <p
              style={{
                ...typography.label.labelM,
                color: colors.gray[500],
              }}
            >
              3초 후 로그인 페이지로 이동합니다...
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
