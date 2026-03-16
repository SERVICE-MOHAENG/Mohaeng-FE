import React, { useState, useEffect } from 'react';
import { typography, colors } from '@mohang/ui';

interface LoadingScreenProps {
  message?: string;
  description?: string;
  tips?: string[];
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = '잠시만 기다려주세요',
  description = '데이터를 불러오고 있습니다',
  tips = [],
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (tips.length > 1) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
      }, 4000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [tips]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Original Spinner Style */}
        <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-400 rounded-full animate-spin mb-8"></div>

        <h2
          className="text-xl font-bold text-gray-800"
          style={{ ...typography.body.BodyB }}
        >
          {message}
        </h2>

        {/* 메시지 바로 아래 한 줄 영역 */}
        <div className="mt-3 w-full max-w-md">
          {tips && tips.length > 0 ? (
            <div className="flex items-center justify-center">
              <span
                className="inline-block px-4 py-1.5 text-sm font-bold text-center leading-relaxed"
                style={{ ...typography.body.BodyM, color: colors.gray[700] }}
              >
                {tips[tipIndex]}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span
                className="inline-block px-4 py-1.5 text-sm font-bold text-center leading-relaxed"
                style={{ ...typography.body.BodyM, color: colors.gray[700] }}
              >
                {description}
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
