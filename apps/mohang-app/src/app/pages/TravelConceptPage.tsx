import { useState, useEffect } from 'react';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
} from '@mohang/ui';
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
  { id: 'SIGHTSEEING', name: '관광', icon: tour },
  { id: 'FOOD_TOUR', name: '먹방', icon: food },
  { id: 'FAMILY_TRIP', name: '가족 여행', icon: family },
  { id: 'HEALING', name: '힐링', icon: healing },
  { id: 'NATURE', name: '자연', icon: nature },
  { id: 'SHOPPING', name: '쇼핑', icon: shopping },
  { id: 'CITY_TRIP', name: '도시 여행', icon: city },
  { id: 'PHOTO_SPOTS', name: '사진 인생샷', icon: photo },
  { id: 'UNIQUE_TRIP', name: '이색 여행', icon: unique },
  { id: 'HONEYMOON', name: '신혼 여행', icon: honeymoon },
  { id: 'CULTURE_ART', name: '문화, 예술', icon: culture },
  { id: 'ACTIVITY', name: '액티비티', icon: activity },
];

const conceptMap: Record<string, string> = {
  SIGHTSEEING: 'SIGHTSEEING',
  FOOD_TOUR: 'FOOD_TOUR',
  FAMILY_TRIP: 'FAMILY_TRIP',
  HEALING: 'HEALING',
  NATURE: 'NATURE',
  SHOPPING: 'SHOPPING',
  CITY_TRIP: 'CITY_TRIP',
  PHOTO_SPOTS: 'PHOTO_SPOTS',
  UNIQUE_TRIP: 'UNIQUE_TRIP',
  HONEYMOON: 'HONEYMOON',
  CULTURE_ART: 'CULTURE_ART',
  ACTIVITY: 'ACTIVITY',
};

export default function TravelConceptPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const selectedThemes = surveyData.travel_themes || [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const toggleSelect = (id: string) => {
    const serverKey = conceptMap[id];
    const newSelected = selectedThemes.includes(serverKey)
      ? selectedThemes.filter((item) => item !== serverKey)
      : [...selectedThemes, serverKey];
    updateSurveyData({ travel_themes: newSelected });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-28">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: colors.gray[800] }}>
            여행 컨셉 선택
          </h1>
          <p className="text-base text-gray-400 leading-relaxed">
            가고 싶은 여행 컨셉을 <br /> 선택해주세요!
          </p>
        </div>

        <div className="grid grid-cols-6 gap-5 max-w-6xl px-6 w-full">
          {concepts.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`flex flex-col items-center justify-center p-5 rounded-[22px] border-2 cursor-pointer transition-all duration-300 gap-3
                ${
                  selectedThemes.includes(conceptMap[item.id])
                    ? 'border-cyan-400 bg-cyan-50/10 shadow-[0_12px_24px_rgba(34,211,238,0.1)]'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                }`}
            >
              <div className="h-20 flex items-center justify-center mb-1">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="max-h-full object-contain transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <span
                style={{
                  color: selectedThemes.includes(conceptMap[item.id])
                    ? colors.primary[500]
                    : colors.gray[700],
                  ...typography.body.BodyB,
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-10 left-0 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/companion"
          className="px-6 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto bg-gray-400 hover:bg-gray-500 shadow-sm"
          style={{
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/travel-style"
          className="px-8 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto shadow-sm disabled:opacity-40"
          style={{
            pointerEvents: selectedThemes.length > 0 ? 'auto' : 'none',
            backgroundColor:
              selectedThemes.length > 0
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
