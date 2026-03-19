import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, LoadingScreen, colors, exchangeOAuthCode, typography } from '@mohang/ui';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  TRIP_CORE_HE_AUTH_A004:
    '이미 이메일 로그인으로 가입된 계정입니다. 이메일 로그인으로 진행해 주세요.',
};

const DEFAULT_OAUTH_ERROR_MESSAGE = '소셜 로그인에 실패했습니다.';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  const redirectToLoginWithError = (message: string) => {
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
        const errorCodeParam = searchParams.get('errorCode');
        const messageParam = searchParams.get('message');

        if (errorParam) {
          const message =
            messageParam ||
            OAUTH_ERROR_MESSAGES[errorCodeParam || ''] ||
            '소셜 로그인이 취소되었거나 실패했습니다.';
          setError(message);
          setIsProcessing(false);
          setTimeout(() => redirectToLoginWithError(message), 2000);
          return;
        }

        if (!code) {
          const message = '인증 코드가 없습니다.';
          setError(message);
          setIsProcessing(false);
          setTimeout(() => redirectToLoginWithError(message), 2000);
          return;
        }

        const result = await exchangeOAuthCode(code);
        if (!result.success) {
          const message = DEFAULT_OAUTH_ERROR_MESSAGE;
          setError(message);
          setIsProcessing(false);
          setTimeout(() => redirectToLoginWithError(message), 2000);
          return;
        }

        navigate('/');
      } catch (err) {
        const apiError = err as ApiError;
        const message =
          OAUTH_ERROR_MESSAGES[apiError.errorCode || ''] ||
          apiError.message ||
          DEFAULT_OAUTH_ERROR_MESSAGE;
        setError(message);
        setIsProcessing(false);
        setTimeout(() => redirectToLoginWithError(message), 2000);
      }
    };

    if (!hasProcessed.current) {
      processOAuthCallback();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {isProcessing && (
          <LoadingScreen
            message="로그인 처리 중"
            description="잠시만 기다려 주세요"
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
