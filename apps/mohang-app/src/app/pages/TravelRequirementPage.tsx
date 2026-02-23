import { useState, useEffect } from 'react';
import {
  Header,
  colors,
  typography,
  useSurvey,
  createItinerarySurvey,
  createItinerary,
  getCookie,
  getItineraryStatus,
} from '@mohang/ui';
import { Link, useNavigate } from 'react-router-dom';

export default function TravelRequirementPage() {
  const { surveyData, updateSurveyData, resetSurvey, setJobId } = useSurvey();
  const request = surveyData.notes || '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      updateSurveyData({ notes: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    let currentJobId = 'demo-job-id';

    try {
      // 백엔드 데이터 형식에 맞춰 변환 (snake_case 및 regions 포함)
      const payload = {
        start_date: surveyData.start_date,
        end_date: surveyData.end_date,
        people_count: Number(surveyData.people_count),
        companion_type: surveyData.companion_type,
        travel_themes: surveyData.travel_themes,
        pace_preference: surveyData.pace_preference,
        planning_preference: surveyData.planning_preference,
        destination_preference: surveyData.destination_preference,
        activity_preference: surveyData.activity_preference,
        priority_preference: surveyData.priority_preference,
        budget_range: surveyData.budget_range,
        regions: surveyData.regions,
        notes: surveyData.notes,
      };

      console.log('Sending Survey Data:', payload);
      const response = await createItinerarySurvey(payload);
      console.log('Survey Response:', response);

      // API 응답 구조: { success: true, data: { survey: { surveyId, jobId, ... } } }
      const result = response.data?.survey || response.data || response;

      // 결과에서 ID 추출
      const sid = result.surveyId || result.id;
      currentJobId = result.jobId || result.id || currentJobId;

      if (!sid) {
        console.error('Survey ID not found in result:', result);
        throw new Error('surveyId is missing from response');
      }

      setJobId(currentJobId);

      // Itinerary 생성
      const itinerary = await createItinerary({ surveyId: sid });
      console.log('Itinerary Result:', itinerary);

      resetSurvey();
      navigate(`/plan-detail/${currentJobId}`);
    } catch (error: any) {
      console.error('Submission failed:', error);

      // 409 Conflict: 이미 생성된 프로젝트가 있는 경우
      if (error.statusCode === 409) {
        // 에러 데이터에서 추출 시도하거나, 위에서 받아온 jid 사용
        const finalJid =
          error.data?.data?.survey?.jobId ||
          error.data?.survey?.jobId ||
          error.data?.jobId ||
          currentJobId;

        alert('이미 생성 중인 일정이 있습니다. 해당 일정으로 이동합니다.');
        resetSurvey();
        navigate(`/plan-detail/${finalJid}`);
        return;
      }

      alert(error.message || '일정 생성 요청 중 오류가 발생했습니다.');
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
