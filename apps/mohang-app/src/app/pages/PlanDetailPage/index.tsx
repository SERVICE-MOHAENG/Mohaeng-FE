import { useState, useMemo, useEffect } from 'react';
import { Header } from '@mohang/ui';
import { useJsApiLoader } from '@react-google-maps/api';
import { DropResult } from '@hello-pangea/dnd';
import MapSection from './components/MapSection';
import PlanInfo from './components/PlanInfo';
import ScheduleSidebar from './components/ScheduleSidebar';
import ChatSidebar from './components/ChatSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getItineraryStatus,
  getItineraryResult,
  chatItineraryEdit,
  chatItineraryEditStatus,
} from '@mohang/ui';
import { useSurvey } from '@mohang/ui';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: 16.4855, lng: 97.6216 };

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const PlanDetailPage = () => {
  const [activeDay, setActiveDay] = useState<number>(3);
  const [zoom, setZoom] = useState(14);
  const { jobId: contextJobId } = useSurvey();
  const { jobId: paramJobId } = useParams();
  const jobId = paramJobId || contextJobId;
  const [inputValue, setInputValue] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const [travelCourseId, setTravelCourseId] = useState<string>('');
  const [tabPageIndex, setTabPageIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '안녕하세요! 어떤 일정 수정을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);

  interface ItineraryInfo {
    itinerary: any[] | null;
    title: string;
    startDate: string;
    endDate: string;
    nights: number;
    tripDays: number;
    peopleCount: number;
    tags: string[];
  }

  const [itineraryData, setItineraryData] = useState<ItineraryInfo>({
    itinerary: null,
    title: '',
    startDate: '',
    endDate: '',
    nights: 0,
    tripDays: 0,
    peopleCount: 0,
    tags: [],
  });
  const [scheduleData, setScheduleData] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (!itineraryData.itinerary) return;

    const formattedData: Record<number, any[]> = {};

    itineraryData.itinerary.forEach((day: any) => {
      formattedData[day.day_number] = day.places.map((place: any) => ({
        id: place.place_id,
        title: place.place_name,
        position: {
          lat: Number(place.latitude),
          lng: Number(place.longitude),
        },
        time: place.visit_time,
        location: place.address,
      }));
    });

    setScheduleData(formattedData);

    // 데이터가 들어왔으므로 첫 번째 날짜를 활성화
    if (Object.keys(formattedData).length > 0) {
      setActiveDay(1);
    }
  }, [itineraryData.itinerary]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  });

  useEffect(() => {
    if (!jobId) return;

    let pollInterval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const responseData = (await getItineraryStatus(jobId)) as any;
        // API 응답 구조에 따른 안전한 데이터 추출
        const statusData = responseData.data?.status || responseData;
        const { status, travelCourseId: extractedId } = statusData;

        if (extractedId) {
          setTravelCourseId(extractedId);
        }

        if (status === 'SUCCESS' || status === 'COMPLETED') {
          if (extractedId || jobId) {
            const resultRes = (await getItineraryResult(jobId)) as any;

            // API 응답 구조에 따른 유연한 데이터 추출
            const resultData = resultRes.data || resultRes;
            const data =
              resultData.result?.data || resultData.data || resultData;

            if (data && data.itinerary) {
              setItineraryData({
                itinerary: data.itinerary,
                title: data.title || '나의 여행 일정',
                startDate: data.start_date || '',
                endDate: data.end_date || '',
                nights: data.nights || 0,
                tripDays: data.trip_days || 0,
                peopleCount: data.people_count || 0,
                tags: data.tags || [],
              });
            } else {
              console.warn(
                'Itinerary data structure not recognized:',
                resultRes,
              );
            }
          }
          clearInterval(pollInterval);
        } else if (status === 'FAILED') {
          alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error fetching itinerary status:', error);
      }
    };

    // 초기 호출
    fetchStatus();

    // 30초마다 폴링
    pollInterval = setInterval(fetchStatus, 30000);

    return () => clearInterval(pollInterval);
  }, [jobId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!travelCourseId) {
      alert('일정 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const originalInput = inputValue;
    setInputValue('');
    setIsChatSidebarOpen(true);
    setIsTyping(true);

    try {
      // 1. 수정 요청 (POST)
      const response = await chatItineraryEdit(travelCourseId, originalInput);
      console.log('Chat Edit Response:', response);

      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text:
          response.message ||
          '일정 수정을 시작합니다. 완료될 때까지 잠시만 기다려주세요...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 응답으로 받은 jobId를 사용하여 즉시 폴링 시작
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await chatItineraryEditStatus(response.jobId);
          const status = statusRes.status || statusRes;

          if (status === 'PENDING') {
            clearInterval(pollInterval);

            // 완료 시 일정 데이터 갱신
            if (travelCourseId) {
              await getItineraryResult(travelCourseId);
            }

            const completionMessage: Message = {
              id: Date.now().toString(),
              sender: 'ai',
              text: '요청하신 대로 일정을 수정했습니다! 확인해 보세요.',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, completionMessage]);
          } else if (status === 'FAILED') {
            clearInterval(pollInterval);
            alert('일정 수정에 실패했습니다.');
          }
        } catch (pollError) {
          console.error('Polling Error:', pollError);
          clearInterval(pollInterval);
        }
      }, 3000);
    } catch (error: any) {
      console.error('Chat Edit Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: error.message || '일정 수정 요청 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const onBack = () => {
    setIsChatSidebarOpen(false);
    setInputValue('');
    navigate('/travel-requirement');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !scheduleData[activeDay]) return;
    const items = Array.from(scheduleData[activeDay]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScheduleData({ ...scheduleData, [activeDay]: items });
  };

  const path = useMemo(
    () => scheduleData[activeDay]?.map((m) => m.position) || [],
    [scheduleData, activeDay],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-gray-900">
      {/* GNB */}
      <Header />

      <main className="flex flex-1 relative overflow-hidden bg-[#0e1626]">
        {/* 1. 지도 영역 */}
        <MapSection
          isLoaded={isLoaded}
          center={scheduleData[activeDay]?.[0]?.position || defaultCenter}
          zoom={zoom}
          onLoad={() => {}}
          path={path}
          scheduleItems={scheduleData[activeDay] || []}
          activeDay={activeDay}
          onZoomIn={() => setZoom((prev) => prev + 1)}
          onZoomOut={() => setZoom((prev) => prev - 1)}
        />

        {/* 상단 정보바 */}
        <PlanInfo
          onBack={onBack}
          title={itineraryData.title}
          dateRange={`${itineraryData.startDate} - ${itineraryData.endDate}`}
          details={`${itineraryData.nights}박 ${itineraryData.tripDays}일 · ${itineraryData.peopleCount}명`}
          tasteMatch="백남수님의 취향, 라오스 여행!"
          hashtags={itineraryData.tags}
        />

        {/* 중앙 하단 Input (사이드바가 닫혔을 때만) */}
        {!isChatSidebarOpen && (
          <div className="absolute bottom-32 left-1/2 -translate-x-2/3 w-full max-w-[540px] z-10 px-5 animate-in fade-in zoom-in-95">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="원하는 일정 수정 내용을 입력해주세요"
                className="w-full px-7 py-4 rounded-2xl shadow-2xl outline-none border-none text-sm bg-white focus:ring-2 focus:ring-sky-400 transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-sky-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 하단 날짜 탭 */}
        <div
          className={`absolute bottom-8 z-10 w-full flex justify-center px-5 ${!isChatSidebarOpen ? 'left-1/2 -translate-x-[56%]' : '-translate-x-[20%]'}`}
        >
          <div className="bg-[#f1f3f5] p-2 rounded-[32px] flex items-center gap-2 shadow-2xl border border-white/50 backdrop-blur-md">
            {/* 좌측 화살표 */}
            <button
              onClick={() => setTabPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={tabPageIndex === 0}
              className={`p-2 rounded-full transition-all ${tabPageIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex gap-2">
              {[...Array(itineraryData.tripDays)]
                .slice(tabPageIndex * 3, (tabPageIndex + 1) * 3)
                .map((_, sliceIdx) => {
                  const idx = tabPageIndex * 3 + sliceIdx;
                  const isActive = activeDay === idx + 1;
                  const dateObj = new Date(itineraryData.startDate);
                  dateObj.setDate(dateObj.getDate() + idx);

                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  const dayName = dayNames[dateObj.getDay()];
                  const dateString = `${dateObj.getFullYear()}.${String(
                    dateObj.getMonth() + 1,
                  ).padStart(2, '0')}.${String(dateObj.getDate()).padStart(
                    2,
                    '0',
                  )}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDay(idx + 1)}
                      className={`min-w-[140px] py-3 px-6 rounded-[22px] flex flex-col items-center transition-all duration-300 ${
                        isActive
                          ? 'text-white shadow-lg scale-[1.02]'
                          : 'bg-white text-gray-400 hover:bg-gray-50'
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)',
                            }
                          : {}
                      }
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                          isActive ? 'text-white/80' : 'text-gray-300'
                        }`}
                      >
                        Day {idx + 1}
                      </span>
                      <span className="text-[13px] font-black">
                        {dateString} ({dayName})
                      </span>
                    </button>
                  );
                })}
            </div>

            {/* 우측 화살표 */}
            <button
              onClick={() =>
                setTabPageIndex((prev) =>
                  (prev + 1) * 3 < itineraryData.tripDays ? prev + 1 : prev,
                )
              }
              disabled={(tabPageIndex + 1) * 3 >= itineraryData.tripDays}
              className={`p-2 rounded-full transition-all ${
                (tabPageIndex + 1) * 3 >= itineraryData.tripDays
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. 중앙: AI 채팅 사이드바 */}
        <ChatSidebar
          isOpen={isChatSidebarOpen}
          onClose={() => setIsChatSidebarOpen(false)}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          messages={messages}
          isTyping={isTyping}
        />

        {/* 3. 오른쪽: 일정 사이드바 (타임라인) */}
        <ScheduleSidebar
          activeDay={activeDay}
          scheduleItems={scheduleData[activeDay] || []}
          onDragEnd={onDragEnd}
          onAddToMyPlan={() => {}}
        />
      </main>
    </div>
  );
};

export default PlanDetailPage;
