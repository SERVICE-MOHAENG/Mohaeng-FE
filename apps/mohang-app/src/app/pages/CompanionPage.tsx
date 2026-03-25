import { useEffect, useState } from 'react';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
} from '@mohang/ui';
import { Link } from 'react-router-dom';
import solo from '../../assets/images/solo.png';
import parents from '../../assets/images/parents.png';
import friends from '../../assets/images/friends.png';
import couple from '../../assets/images/couple.png';
import child from '../../assets/images/child.png';
import family from '../../assets/images/family.png';
import work from '../../assets/images/work.png';

const companions = [
  { id: 'SOLO', name: '혼자', emoji: solo },
  { id: 'PARENTS', name: '부모님', emoji: parents },
  { id: 'FRIENDS', name: '친구', emoji: friends },
  { id: 'COUPLE', name: '연인', emoji: couple },
  { id: 'CHILDREN', name: '아이', emoji: child },
  { id: 'FAMILY', name: '가족', emoji: family },
  { id: 'COLLEAGUES', name: '직장 동료', emoji: work },
];

const companionMap: Record<string, string> = {
  SOLO: 'SOLO',
  PARENTS: 'PARENTS',
  FRIENDS: 'FRIENDS',
  COUPLE: 'COUPLE',
  CHILDREN: 'CHILDREN',
  FAMILY: 'FAMILY',
  COLLEAGUES: 'COLLEAGUES',
};

export default function CompanionPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const selectedCompanions = surveyData.companion_type || [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSelect = (id: string) => {
    const serverKey = companionMap[id];
    const newSelected = selectedCompanions.includes(serverKey)
      ? selectedCompanions.filter((c) => c !== serverKey)
      : [...selectedCompanions, serverKey];
    updateSurveyData({ companion_type: newSelected });
  };

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-28">
        <div className="text-center mb-8">
          <h1 className="mb-3 text-3xl font-bold" style={{ color: colors.gray[800] }}>
            동행자 선택
          </h1>
          <p
            className="leading-relaxed text-base"
            style={{ color: colors.gray[400] }}
          >
            여행을 함께 할 예정인
            <br />
            동행자를 선택해주세요.
          </p>
        </div>
        <div className="flex flex-col items-center gap-5 max-w-5xl px-4">
          <div className="grid grid-cols-4 gap-5">
            {companions.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`w-44 h-48 flex flex-col items-center justify-center rounded-[24px] border-2 cursor-pointer transition-all duration-300 gap-3
                  ${
                    selectedCompanions.includes(companionMap[item.id])
                      ? 'border-cyan-400 bg-cyan-50/10 shadow-[0_12px_24px_rgba(34,211,238,0.1)]'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
              >
                <div className="h-28 flex items-center justify-center">
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="max-h-full object-contain transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <span
                  style={{
                    color: selectedCompanions.includes(companionMap[item.id])
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
          <div className="grid grid-cols-3 gap-5">
            {companions.slice(4).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`w-44 h-48 flex flex-col items-center justify-center rounded-[24px] border-2 cursor-pointer transition-all duration-300 gap-3
                  ${
                    selectedCompanions.includes(companionMap[item.id])
                      ? 'border-cyan-400 bg-cyan-50/10 shadow-[0_12px_24px_rgba(34,211,238,0.1)]'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
              >
                <div className="h-28 flex items-center justify-center">
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="max-h-full object-contain transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <span
                  style={{
                    color: selectedCompanions.includes(companionMap[item.id])
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
        </div>
      </main>
      <footer className="fixed bottom-10 left-0 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/people-count"
          className="px-6 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto bg-gray-400 hover:bg-gray-500 shadow-sm"
          style={{
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/travel-concept"
          className="px-8 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto shadow-sm disabled:opacity-40"
          style={{
            backgroundColor:
              selectedCompanions.length > 0
                ? colors.primary[500]
                : colors.primary[200],
            ...typography.body.BodyM,
            pointerEvents: selectedCompanions.length > 0 ? 'auto' : 'none',
          }}
        >
          다음
        </Link>
      </footer>
    </div>
  );
}
