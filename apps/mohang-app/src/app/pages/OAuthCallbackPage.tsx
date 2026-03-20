import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, LoadingScreen, colors, exchangeOAuthCode, typography } from '@mohang/ui';

const DEFAULT_ERROR_MESSAGE = 'OAuth 인증에 실패했습니다.';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  const moveToLoginWithError = (message: string) => {
    navigate(`/login?oauthError=${encodeURIComponent(message)}`, {
      replace: true,
    });
  };

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const messageParam = searchParams.get('message');

        if (errorParam) {
          const exactMessage = messageParam || errorParam;
          console.error('OAuth callback error:', exactMessage);
          setError(exactMessage);
          setIsProcessing(false);
          setTimeout(() => moveToLoginWithError(exactMessage), 2000);
          return;
        }

        if (!code) {
          console.error('OAuth callback error: 인증 코드가 없습니다.');
          setError('인증 코드가 없습니다.');
          setIsProcessing(false);
          setTimeout(() => moveToLoginWithError('인증 코드가 없습니다.'), 2000);
          return;
        }

        const result = await exchangeOAuthCode(code);
        if (!result.success) {
          console.error('OAuth callback error:', DEFAULT_ERROR_MESSAGE);
          setError(DEFAULT_ERROR_MESSAGE);
          setIsProcessing(false);
          setTimeout(() => moveToLoginWithError(DEFAULT_ERROR_MESSAGE), 2000);
          return;
        }

        navigate('/');
      } catch (err) {
        const apiError = err as ApiError;
        const exactMessage = apiError.message || DEFAULT_ERROR_MESSAGE;
        console.error('OAuth callback error:', {
          message: apiError.message,
          errorCode: apiError.errorCode,
          statusCode: apiError.statusCode,
        });
        setError(exactMessage);
        setIsProcessing(false);
        setTimeout(() => moveToLoginWithError(exactMessage), 2000);
      }
    };

    if (!hasProcessed.current) {
      processOAuthCallback();
    }
  }, [navigate, searchParams]);

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
              잠시 후 로그인 페이지로 이동합니다.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
