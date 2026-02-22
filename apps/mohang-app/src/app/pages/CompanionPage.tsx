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
      <main className="flex-1 flex flex-col items-center py-10">
        <div className="text-center mb-10">
          <h1 className="mb-3" style={{ ...typography.title.sTitleB }}>
            동행자 선택
          </h1>
          <p
            className="leading-relaxed"
            style={{ color: colors.gray[400], ...typography.body.BodyM }}
          >
            여행을 함께 할 예정인
            <br />
            동행자를 선택해주세요.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          <div className="grid grid-cols-4 gap-4">
            {companions.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`w-40 h-44 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                  ${
                    selectedCompanions.includes(companionMap[item.id])
                      ? 'border-cyan-400 bg-white shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-105'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="h-24 flex items-center justify-center mb-2">
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <span
                  style={{
                    color: selectedCompanions.includes(companionMap[item.id])
                      ? colors.black.black100
                      : colors.gray[400],
                    ...typography.body.LBodyB,
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {companions.slice(4).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`w-40 h-44 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all
                  ${
                    selectedCompanions.includes(companionMap[item.id])
                      ? 'border-cyan-400 bg-white shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-105'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="h-24 flex items-center justify-center mb-2">
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <span
                  style={{
                    color: selectedCompanions.includes(companionMap[item.id])
                      ? colors.black.black100
                      : colors.gray[400],
                    ...typography.body.LBodyB,
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="fixed bottom-6 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/people-count"
          className="px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto"
          style={{
            backgroundColor: colors.gray[400],
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/travel-concept"
          className={`px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto shadow-md ${
            selectedCompanions.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          style={{
            backgroundColor:
              selectedCompanions.length > 0
                ? colors.primary[500]
                : colors.gray[300],
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
