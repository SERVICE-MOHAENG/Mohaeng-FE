import React, { useState, useEffect } from 'react';
import { Header } from '@mohang/ui';
import { colors, typography } from '@mohang/ui';
import { Link } from 'react-router-dom';
import save from '../../assets/images/save.png';
import basic from '../../assets/images/basic.png';
import premium from '../../assets/images/premium.png';
import luxury from '../../assets/images/luxury.png';

const styles = [
  { id: 'save', name: '가성비', icon: save },
  { id: 'basic', name: '기본', icon: basic },
  { id: 'premium', name: '프리미엄', icon: premium },
  { id: 'luxury', name: '럭셔리', icon: luxury },
];

export default function TravelSetupPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center py-12">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-3">여행 범위 선택</h1>
          <p className="text-sm text-gray-400">
            어느 정도의 예산으로 여행을 준비하고 계신가요?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-6xl px-6">
          {styles.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`w-44 h-44 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedId === item.id
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className="h-24 flex items-center justify-center mb-2">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="max-h-full object-contain"
                />
              </div>
              <span
                style={{
                  color:
                    selectedId === item.id
                      ? colors.black.black100
                      : colors.gray[400],
                  ...typography.body.BodyB,
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* 하단 푸터 버튼 */}
      <footer className="fixed bottom-6 w-full px-10 flex justify-between pointer-events-none">
        <Link
          to="/travel-concept"
          className="px-4 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto"
          style={{
            backgroundColor: colors.gray[400],
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/"
          className="px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto "
          style={{
            pointerEvents: selectedId ? 'auto' : 'none',
            backgroundColor: selectedId
              ? colors.primary[500]
              : colors.primary[200],
            ...typography.body.BodyM,
          }}
        >
          다음
        </Link>
      </footer>
    </div>
  );
}
