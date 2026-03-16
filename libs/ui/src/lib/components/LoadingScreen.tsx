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

        <div className="mt-6 w-full max-w-md">
          {tips && tips.length > 0 ? (
            <div className="relative min-h-[4rem] flex items-center justify-center">
              {tips.map((tip, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 
                    ${idx === tipIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                  `}
                >
                  <span
                    className="inline-block px-6 py-2.5 rounded-2xl bg-white shadow-sm border border-gray-100 text-sm font-semibold text-center leading-relaxed"
                    style={{ ...typography.body.BodyM, color: colors.gray[500] }}
                  >
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <p
                className="text-sm font-medium"
                style={{ ...typography.body.BodyM, color: colors.gray[400] }}
              >
                {description}
              </p>
              <div className="flex gap-0.5 mt-1">
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_0ms]"></span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_200ms]"></span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_400ms]"></span>
              </div>
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
