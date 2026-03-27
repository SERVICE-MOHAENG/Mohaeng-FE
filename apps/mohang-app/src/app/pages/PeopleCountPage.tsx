import { useState, useEffect } from 'react';
import {
  Header,
  colors,
  typography,
  useSurvey,
  getAccessToken,
} from '@mohang/ui';
import { Link } from 'react-router-dom';

export default function PeopleCountPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const count = surveyData.people_count;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const handleDecrease = () => {
    if (count > 1) {
      updateSurveyData({ people_count: count - 1 });
    }
  };

  const handleIncrease = () => {
    if (count < 20) {
      updateSurveyData({ people_count: count + 1 });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-28">
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ ...typography.title.sTitleB }}>
            인원 선택
          </h1>
          <p
            className="leading-relaxed"
            style={{ color: colors.gray[400], ...typography.body.BodyM }}
          >
            여행 가는 예상 인원을 선택해주세요!
            <br />
            본인을 포함 인원수로 계산을 해주세요!
          </p>
        </div>
        <div
          className="flex items-center gap-10"
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
              e.preventDefault();
              handleIncrease();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
              e.preventDefault();
              handleDecrease();
            }
          }}
        >
          <button
            onClick={handleDecrease}
            className={`w-14 h-14 flex items-center justify-center rounded-xl transition-colors ${
              count > 1
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="text-white text-6xl flex items-center justify-center pb-1">
              −
            </span>
          </button>
          <div
            className="w-24 h-28 border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
            tabIndex={0}
            role="spinbutton"
            aria-valuenow={count}
            aria-valuemin={1}
            aria-valuemax={20}
            aria-label="인원 수"
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                e.preventDefault();
                handleIncrease();
              } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                e.preventDefault();
                handleDecrease();
              } else if (e.key >= '1' && e.key <= '9') {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 20) {
                  updateSurveyData({ people_count: num });
                }
              }
            }}
          >
            <span className="text-5xl font-medium text-gray-900">{count}</span>
          </div>
          <button
            onClick={handleIncrease}
            className={`w-14 h-14 flex items-center justify-center rounded-xl transition-colors ${
              count < 20
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="text-white text-6xl flex items-center justify-center pb-3">
              +
            </span>
          </button>
        </div>
      </main>
      <footer className="fixed bottom-10 left-0 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/calendar"
          className="px-6 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto bg-gray-400 hover:bg-gray-500 shadow-sm"
          style={{
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <Link
          to="/companion"
          className="px-8 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto shadow-sm"
          style={{
            backgroundColor: colors.primary[500],
            ...typography.body.BodyM,
          }}
        >
          다음
        </Link>
      </footer>
    </div>
  );
}
