import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { exchangeOAuthCode, ApiError } from '../../api/auth';
import { colors, typography } from '@mohang/ui';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError('OAuth 인증이 취소되었습니다.');
          setIsProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setError('인증 코드가 없습니다.');
          setIsProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // URL 경로에서 provider 추출 (/oauth/callback/google -> google)
        const pathParts = location.pathname.split('/');
        const provider = pathParts[pathParts.length - 1] as 'google' | 'naver' | 'kakao';

        // 인증 코드를 토큰으로 교환
        const response = await exchangeOAuthCode(code, provider);

        // 토큰 저장
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // 로그인 성공 - 메인 페이지로 이동
        navigate('/');
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'OAuth 인증에 실패했습니다.');
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, location]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {isProcessing ? (
          <>
            {/* Loading Spinner */}
            <div className="mb-6 flex justify-center">
              <div
                className="animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  width: '48px',
                  height: '48px',
                  borderColor: colors.primary[500],
                  borderTopColor: 'transparent',
                }}
              />
            </div>
            <h1
              className="mb-2"
              style={{
                ...typography.headline.lHeadlineB,
                color: colors.gray[800],
              }}
            >
              로그인 처리 중...
            </h1>
            <p
              style={{
                ...typography.body.bodyM,
                color: colors.gray[600],
              }}
            >
              잠시만 기다려주세요.
            </p>
          </>
        ) : error ? (
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
                  <circle cx="16" cy="16" r="12" stroke={colors.system.error500} strokeWidth="2" />
                  <path
                    d="M16 10V18M16 22H16.01"
                    stroke={colors.system.error500}
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
                ...typography.body.bodyM,
                color: colors.system.error500,
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
