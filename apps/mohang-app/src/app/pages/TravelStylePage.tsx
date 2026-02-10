import React, { useState, useEffect } from 'react';
import { Header } from '@mohang/ui';
import { colors, typography } from '@mohang/ui';
import { Link } from 'react-router-dom';
import busy from '../../assets/images/busy.png';
import relaxed from '../../assets/images/relaxed.png';

const styles = [
  { id: 'busy', name: '빡빡하게', icon: busy },
  { id: 'relaxed', name: '널널하게', icon: relaxed },
];

export default function TravelStylePage() {
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
          <h1 className="text-2xl font-bold mb-3">여행 컨셉 선택</h1>
          <p className="text-sm text-gray-400">
            가고 싶은 여행 컨셉을 <br /> 선택해주세요!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-6xl px-6">
          {styles.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`w-64 h-64 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedId === item.id
                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className="h-48 flex items-center justify-center mb-2">
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
