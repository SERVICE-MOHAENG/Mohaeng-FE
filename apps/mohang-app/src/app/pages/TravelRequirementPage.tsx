import React, { useState, useEffect } from 'react';
import {
  Header,
  colors,
  typography,
  useSurvey,
  createItinerarySurvey,
  getAccessToken,
} from '@mohang/ui';
import { Link, useNavigate } from 'react-router-dom';

export default function TravelRequirementPage() {
  const { surveyData, updateSurveyData, resetSurvey } = useSurvey();
  const request = surveyData.notes || '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      updateSurveyData({ notes: e.target.value });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createItinerarySurvey(surveyData);
      resetSurvey();
      navigate('/home');
    } catch (error) {
      console.error('Survey submission failed', error);
      alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-3">추가 요청 사항</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            여행에서 중요시 생각하거나,
            <br />
            희망하시는 것을 자유롭게 작성해주세요!
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <label
            className="block mb-3"
            style={{ ...typography.body.BodyB, color: colors.gray[700] }}
          >
            요청 사항
          </label>

          <div className="relative">
            <textarea
              value={request}
              onChange={handleTextChange}
              placeholder="자유롭게 작성해주세요! (최대 1000자)"
              className="w-full h-80 p-6 rounded-xl border-2 transition-all placeholder:text-gray-300"
              style={{
                ...typography.body.BodyM,
                borderColor: colors.gray[200],
              }}
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-300">
              {request.length}/1000
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-6 w-full px-12 flex justify-between pointer-events-none">
        <Link
          to="/travel-setup"
          className="px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto"
          style={{
            backgroundColor: colors.gray[400],
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto shadow-md"
          style={{
            backgroundColor: isLoading
              ? colors.primary[200]
              : colors.primary[500],
            ...typography.body.BodyM,
          }}
        >
          {isLoading ? '생성 중...' : '일정 만들기'}
        </button>
      </footer>
    </div>
  );
}
