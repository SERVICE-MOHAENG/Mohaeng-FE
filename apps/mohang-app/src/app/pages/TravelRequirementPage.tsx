import { useState, useEffect } from 'react';
import {
  Header,
  colors,
  typography,
  useSurvey,
  createItinerarySurvey,
  createItinerary,
  getCookie,
  LoadingScreen,
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
      console.log('Survey Response (Full):', response);

      const data = response.data || response;
      // survey 객체가 data.data.survey에 있을 가능성 (409 에러 구조 참고)
      const survey = data.survey || data.data?.survey || data;

      // 가능한 모든 경로에서 ID 추출시도
      const sid =
        survey.surveyId ||
        survey.id ||
        survey.survey_id ||
        data.surveyId ||
        data.id ||
        response.surveyId ||
        response.id;

      if (!sid) {
        throw new Error('응답에서 surveyId를 찾을 수 없습니다.');
      }

      // Itinerary 생성 요청 (여기서 jobId가 반환될 것으로 예상)
      const itineraryResult = await createItinerary({ surveyId: sid });
      console.log('Itinerary Result (Full):', itineraryResult);

      const iData = itineraryResult.data || itineraryResult;
      const jid =
        iData.itinerary?.jobId ||
        iData.jobId ||
        iData.job_id ||
        iData.id ||
        survey.jobId ||
        data.jobId ||
        survey.job_id ||
        data.job_id;

      console.log('Final Extracted IDs:', { sid, jid });

      if (!jid) {
        throw new Error('응답에서 jobId를 찾을 수 없습니다.');
      }

      setJobId(jid);
      resetSurvey();
      navigate(`/plan-detail/${jid}`);
    } catch (error: any) {
      console.error('Submission failed:', error);

      // 409 Conflict: 이미 생성된 프로젝트가 있는 경우
      if (error.statusCode === 409) {
        // 에러 데이터에서 추출 시도하거나, 위에서 받아온 jid 사용
        const finalJid =
          error.data?.data?.survey?.jobId ||
          error.data?.survey?.jobId ||
          error.data?.jobId ||
          ''; // jobId가 없으면 에러로 처리됨

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
      {isLoading && (
        <LoadingScreen
          message="일정을 생성하고 있습니다"
          tips={[
            'AI가 딱 맞는 여행 일정을 고민하고 있어요...',
            '최적의 동선을 위해 이동 거리를 분석 중입니다',
            '여행지의 숨겨진 명소들을 탐색하고 있어요',
            '일정 생성에는 보통 1~3분 정도 소요됩니다',
            '나만의 완벽한 여행 계획이 곧 완성됩니다!',
          ]}
        />
      )}

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
