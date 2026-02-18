import React, { useState, useEffect } from 'react';
import { Header, colors, typography } from '@mohang/ui';
import { Link, useNavigate } from 'react-router-dom';

export default function TravelRequirementPage() {
  const [request, setRequest] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  // 글자 수 제한 (최대 1000자)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setRequest(e.target.value);
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
                // 포커스 시 border 색상 변경은 하단 inline style이나 CSS 클래스로 처리
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = colors.primary[200])
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = colors.gray[50])
              }
            />

            {/* 글자 수 표시 */}
            <div
              className="absolute bottom-4 right-6 text-xs"
              style={{ color: colors.gray[400] }}
            >
              {request.length} / 1000
            </div>
          </div>
        </div>
      </main>

      {/* 하단 푸터 버튼 */}
      <footer className="fixed bottom-6 w-full px-10 flex justify-between pointer-events-none">
        <Link
          to="/travel-setup" // 이전 단계 (예산 범위 선택)
          className="px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto"
          style={{
            backgroundColor: colors.gray[400],
            ...typography.body.BodyM,
          }}
        >
          이전
        </Link>
        <button
          onClick={() => {
            navigate('/plan-detail'); //로드맵으로 넘어가는 로딩 페이지로 이동
          }}
          className="px-6 py-2 rounded-lg text-white text-lg transition-all active:scale-95 pointer-events-auto shadow-lg"
          style={{
            backgroundColor: colors.primary[500],
            ...typography.body.BodyM,
          }}
        >
          다음
        </button>
      </footer>
    </div>
  );
}
