import { useState, useEffect } from 'react';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
} from '@mohang/ui';
import { Link } from 'react-router-dom';
import save from '../../assets/images/save.png';
import basic from '../../assets/images/basic.png';
import premium from '../../assets/images/premium.png';
import luxury from '../../assets/images/luxury.png';

const styles = [
  { id: 'LOW', name: '가성비', icon: save },
  { id: 'MID', name: '기본', icon: basic },
  { id: 'HIGH', name: '프리미엄', icon: premium },
  { id: 'LUXURY', name: '럭셔리', icon: luxury },
];

const budgetMap: Record<string, string> = {
  LOW: 'LOW',
  MID: 'MID',
  HIGH: 'HIGH',
  LUXURY: 'LUXURY',
};

export default function TravelSetupPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const selectedBudget = surveyData.budget_range;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const toggleSelect = (id: string) => {
    const serverKey = budgetMap[id];
    updateSurveyData({
      budget_range: selectedBudget === serverKey ? '' : serverKey,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-28">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: colors.gray[800] }}
          >
            여행 범위 선택
          </h1>
          <p className="text-base text-gray-400 leading-relaxed">
            어느 정도의 예산으로 여행을 준비하고 계신가요?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 max-w-md px-6 w-full">
          {styles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleSelect(item.id)}
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-[20px] border px-5 py-4 transition-all"
              style={{
                borderColor:
                  selectedBudget === budgetMap[item.id]
                    ? colors.primary[500]
                    : colors.gray[200],
                backgroundColor:
                  selectedBudget === budgetMap[item.id]
                    ? colors.primary[50]
                    : colors.white.white100,
              }}
            >
              <div className="flex h-[92px] w-full items-center justify-center overflow-hidden">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                style={{
                  color:
                    selectedBudget === budgetMap[item.id]
                      ? colors.primary[500]
                      : colors.gray[700],
                  ...typography.body.BodyB,
                }}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-10 left-0 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/travel-style"
          className="px-6 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto bg-gray-400 hover:bg-gray-500 shadow-sm"
          style={{
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/travel-requirement"
          className="px-8 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto shadow-sm disabled:opacity-40"
          style={{
            pointerEvents: selectedBudget ? 'auto' : 'none',
            backgroundColor: selectedBudget
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
