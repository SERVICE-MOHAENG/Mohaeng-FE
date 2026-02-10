import React, { useState, useEffect } from 'react';
import { Header } from '@mohang/ui';
import { colors, typography } from '@mohang/ui';
import { Link } from 'react-router-dom';
import tour from '../../assets/images/tour.png';
import food from '../../assets/images/food.png';
import family from '../../assets/images/family.png';
import healing from '../../assets/images/healing.png';
import nature from '../../assets/images/nature.png';
import shopping from '../../assets/images/shopping.png';
import city from '../../assets/images/city.png';
import photo from '../../assets/images/photo.png';
import unique from '../../assets/images/unique.png';
import honeymoon from '../../assets/images/honeymoon.png';
import culture from '../../assets/images/culture.png';
import activity from '../../assets/images/activity.png';

const concepts = [
  { id: 'tour', name: '관광', icon: tour },
  { id: 'food', name: '먹방', icon: food },
  { id: 'family', name: '가족 여행', icon: family },
  { id: 'healing', name: '힐링', icon: healing },
  { id: 'nature', name: '자연', icon: nature },
  { id: 'shopping', name: '쇼핑', icon: shopping },
  { id: 'city', name: '도시 여행', icon: city },
  { id: 'photo', name: '사진 인생샷', icon: photo },
  { id: 'unique', name: '이색 여행', icon: unique },
  { id: 'honeymoon', name: '신혼 여행', icon: honeymoon },
  { id: 'culture', name: '문화, 예술', icon: culture },
  { id: 'activity', name: '액티비티', icon: activity },
];

export default function TravelConceptPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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

        <div className="grid grid-cols-6 gap-4 max-w-6xl px-6">
          {concepts.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`w-36 h-40 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedIds.includes(item.id)
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
                  color: selectedIds.includes(item.id)
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
          to="/companion"
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
            pointerEvents: selectedIds.length > 0 ? 'auto' : 'none',
            backgroundColor:
              selectedIds.length > 0
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
