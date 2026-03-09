import React, { useState, useEffect } from 'react';
import { typography, colors } from '@mohang/ui';

interface LoadingOverlayProps {
  message?: string;
  description?: string;
}

const TIPS = [
  'AI가 딱 맞는 여행 일정을 고민하고 있어요...',
  '최적의 동선을 위해 이동 거리를 분석 중입니다',
  '여행지의 숨겨진 명소들을 탐색하고 있어요',
  '일정 생성에는 보통 1~3분 정도 소요됩니다',
  '나만의 완벽한 여행 계획이 곧 완성됩니다!',
];

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = '일정을 생성하고 있습니다',
  description = '잠시만 기다려주세요',
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000); // Change tip every 4 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-400 rounded-full animate-spin mb-4"></div>
      <div className="text-center flex flex-col gap-5">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{message}</h2>
        {/* <p className="text-gray-500 text-sm">{description}</p> */}
        <div className="flex items-center justify-center">
          {TIPS.map((tip, idx) => (
            <p
              key={idx}
              className={`absolute w-full px-4 text-sm font-medium transition-all duration-700 w-full text-center 
                ${
                  idx === tipIndex
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }
              `}
            >
              <span
                className="inline-block px-4 py-2 rounded-full whitespace-nowrap"
                style={{ ...typography.body.BodyB, color: colors.gray[500] }}
              >
                {tip}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
