import { useState, useMemo, useEffect } from 'react';
import { Header } from '@mohang/ui';
import { useJsApiLoader } from '@react-google-maps/api';
import { DropResult } from '@hello-pangea/dnd';
import MapSection from './components/MapSection';
import PlanInfo from './components/PlanInfo';
import ScheduleSidebar from './components/ScheduleSidebar';
import ChatSidebar from './components/ChatSidebar';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  getItineraryStatus,
  getItineraryResult,
  chatItineraryEdit,
  chatItineraryEditStatus,
  getAccessToken,
  LoadingScreen,
  getCourseDetail,
} from '@mohang/ui';
import { useSurvey } from '@mohang/ui';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: 16.4855, lng: 97.6216 };

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isPending?: boolean;
}

const PlanDetailPage = () => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [zoom, setZoom] = useState(14);
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(defaultCenter);
  const { jobId: contextJobId } = useSurvey();
  const { jobId: paramJobId } = useParams();
  const jobId = paramJobId || contextJobId;
  const [inputValue, setInputValue] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const isCourseView = location.state?.isCourseView === true;
  const navigate = useNavigate();
  const [travelCourseId, setTravelCourseId] = useState<string>('');
  const [tabPageIndex, setTabPageIndex] = useState(0);
  const [isScheduleSidebarOpen, setIsScheduleSidebarOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] =
    useState('일정을 불러오고 있습니다');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '안녕하세요! 어떤 일정 수정을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const isAuthed = Boolean(token && token !== 'undefined');
    setIsLoggedIn(isAuthed);
  }, []);

  interface ItineraryInfo {
    itinerary: any[] | null;
    title: string;
    startDate: string;
    endDate: string;
    nights: number;
    tripDays: number;
    peopleCount: number;
    tags: string[];
    isMyPlan: boolean;
    tasteMatch?: string;
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
    isMyPlan: true,
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
        description: place.description,
      }));
    });

    setScheduleData(formattedData);

    // 데이터가 들어왔으므로 첫 번째 날짜를 활성화
    if (Object.keys(formattedData).length > 0) {
      setActiveDay(1);
      if (formattedData[1]?.[0]?.position) {
        setMapCenter(formattedData[1][0].position);
      }
    }
  }, [itineraryData.itinerary]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (!jobId) return;

    if (isCourseView) {
      // It's an existing course, skip status polling and fetch result directly
      const fetchCourseResult = async () => {
        try {
          if (paramJobId) setTravelCourseId(paramJobId);
          setIsLoading(true);
          setLoadingMessage('일정을 구성하고 있습니다');

          const resultRes = (await getCourseDetail(jobId)) as any;
          console.log(resultRes, 'resultRes');
          const data = resultRes.data?.data || resultRes.data || resultRes;
          
          if (data && (data.places || data.itinerary)) {
            const places = data.places || (data.itinerary ? data.itinerary.flatMap((d: any) => d.places) : []);
            
            // Construct itinerary array from places
            const itineraryByDay: Record<number, any> = {};
            places.forEach((p: any) => {
              const dayNum = p.dayNumber !== undefined ? p.dayNumber : 1;
              if (!itineraryByDay[dayNum]) {
                itineraryByDay[dayNum] = {
                  day_number: dayNum,
                  places: [],
                };
              }
              itineraryByDay[dayNum].places.push({
                place_id: p.placeId || p.id,
                place_name: p.placeName,
                latitude: p.latitude,
                longitude: p.longitude,
                visit_time:
                  p.visitOrder !== undefined
                    ? `${p.visitOrder}번째 방문` // visitOrder is also 1-indexed in the payload
                    : '시간 미지정',
                address: p.address || '',
                description: p.placeDescription || p.memo || '',
                visitOrder: p.visitOrder !== undefined ? p.visitOrder : 999,
              });
            });

            Object.values(itineraryByDay).forEach((day: any) => {
              day.places.sort((a: any, b: any) => a.visitOrder - b.visitOrder);
            });

            const itinerary = Object.values(itineraryByDay).sort(
              (a: any, b: any) => a.day_number - b.day_number,
            );

            setItineraryData({
              itinerary,
              title: data.title || '나의 여행 일정',
              startDate:
                data.startDate ||
                data.start_date ||
                data.createdAt?.split('T')[0] ||
                '',
              endDate:
                data.endDate ||
                data.end_date ||
                data.updatedAt?.split('T')[0] ||
                '',
              nights: data.nights || 0,
              tripDays: data.days || data.tripDays || data.trip_days || 0,
              peopleCount: data.peopleCount || data.people_count || 1, // API 응답에 없으면 기본값 1
              tags: data.hashTags || data.tags || [],
              isMyPlan: data.isMine ?? data.isOwner ?? false,
              tasteMatch: data.userName
                ? `${data.userName}님의 추천 코스`
                : undefined,
            });
          } else {
            console.warn('Course data structure not recognized:', resultRes);
          }
          setTimeout(() => setIsLoading(false), 1000);
        } catch (error) {
          console.error('Error fetching course detail:', error);
          setIsLoading(false);
          alert('일정을 불러오는 데 실패했습니다.');
        }
      };

      fetchCourseResult();
      return;
    }

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
              setLoadingMessage('일정을 구성하고 있습니다');
              setItineraryData({
                itinerary: data.itinerary,
                title: data.title || '나의 여행 일정',
                startDate: data.start_date || '',
                endDate: data.end_date || '',
                nights: data.nights || 0,
                tripDays: data.trip_days || 0,
                peopleCount: data.people_count || 0,
                tags: data.tags || [],
                isMyPlan: data.isMine ?? data.isOwner ?? true,
              });
              // 데이터 로딩 완료 시점에 소량의 지연을 주어 매끄럽게 전환
              setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            } else {
              console.warn(
                'Itinerary data structure not recognized:',
                resultRes,
              );
              setIsLoading(false);
            }
          }
          clearInterval(pollInterval);
        } else if (status === 'FAILED') {
          alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error fetching itinerary status:', error);
        // 일정 수준 이상의 실패가 발생하면 로딩 종료 (예: 404 등)
        setIsLoading(false);
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

    // SUCCESS 오기 전까지 표시할 펜딩 메시지
    const pendingMsgId = `pending-${Date.now()}`;
    const pendingMessage: Message = {
      id: pendingMsgId,
      sender: 'ai',
      text: '...',
      timestamp: new Date(),
      isPending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);

    try {
      // 수정 요청 (POST)
      // chatItineraryEdit은 이미 response.data를 반환하므로 바로 jobId 추출
      const responseRes = (await chatItineraryEdit(
        travelCourseId,
        originalInput,
      )) as any;
      const response = responseRes.data.chat || responseRes;
      console.log('Chat Edit Response jobId:', response.jobId);

      // 응답으로 받은 jobId를 사용하여 즉시 폴링 시작
      let lastStatusMessage = '';
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = (await chatItineraryEditStatus(
            response.jobId,
          )) as any;

          console.log(
            'Chat Edit Status Response:',
            statusRes.data.status.status,
          );
          const statusData = statusRes.data || statusRes;
          const status = statusData.status || statusData;

          // 메시지가 있고 이전과 다르면 출력
          const currentMessage = status.message;
          if (
            currentMessage &&
            currentMessage !== lastStatusMessage &&
            currentMessage !== '...'
          ) {
            lastStatusMessage = currentMessage;
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== pendingMsgId),
              {
                id: Date.now().toString(),
                sender: 'ai',
                text: currentMessage,
                timestamp: new Date(),
              },
            ]);
          }

          if (
            status.status === 'COMPLETED' ||
            status.status === 'SUCCESS' ||
            status === 'COMPLETED' ||
            status === 'SUCCESS'
          ) {
            clearInterval(pollInterval);
            setIsTyping(false);

            // 완료 시 일정 데이터 갱신 및 로드맵 재구성
            try {
              // 수정된 일정을 가져오기 위해 modification jobId 사용
              const res = (await getItineraryResult(response.jobId)) as any;
              console.log('Updated Itinerary Result:', res);

              const resultData = res.data || res;
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
                  isMyPlan: data.isMine ?? data.isOwner ?? true,
                });
              }
            } catch (resultError) {
              console.error('Error fetching updated itinerary:', resultError);
            }

            // 펜딩 메시지가 남아있거나, 마지막 상태 메시지가 없었던 경우에만 기본 완료 메시지 추가
            const finalMsg =
              '요청하신 대로 일정을 수정했습니다! 확인해 보세요.';
            setMessages((prev) => {
              const hasSuccessMsg = prev.some(
                (m) => m.sender === 'ai' && m.text === lastStatusMessage,
              );
              if (hasSuccessMsg) {
                return prev.filter((m) => m.id !== pendingMsgId);
              }
              return [
                ...prev.filter((m) => m.id !== pendingMsgId),
                {
                  id: Date.now().toString(),
                  sender: 'ai',
                  text: finalMsg,
                  timestamp: new Date(),
                },
              ];
            });
          } else if (status === 'FAILED' || status.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsTyping(false);
            const failMsg =
              status.message || '죄송합니다. 일정 수정에 실패했습니다.';
            // 펜딩 메시지 제거 후 실패 메시지 추가
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== pendingMsgId),
              {
                id: Date.now().toString(),
                sender: 'ai',
                text: failMsg,
                timestamp: new Date(),
              },
            ]);
            alert('일정 수정에 실패했습니다.');
          }
        } catch (pollError) {
          console.error('Polling Error:', pollError);
          clearInterval(pollInterval);
          setIsTyping(false);
          // 에러 시 펜딩 메시지 제거
          setMessages((prev) => prev.filter((m) => m.id !== pendingMsgId));
        }
      }, 3000);
    } catch (error: any) {
      console.error('Chat Edit Error:', error);
      setIsTyping(false);
      // 에러 시 펜딩 메시지를 에러 메시지로 교체
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingMsgId),
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: error.message || '일정 수정 요청 중 오류가 발생했습니다.',
          timestamp: new Date(),
        },
      ]);
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

  const handleFocusLocation = (position: google.maps.LatLngLiteral) => {
    setMapCenter(position);
    setZoom(16); // 자세히 보기 위해 줌 인
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-gray-900">
      {/* 로딩 오버레이 (데이터 로딩 중일 때 표시) */}
      {isLoading && (
        <LoadingScreen
          message={loadingMessage}
          tips={[
            'AI가 딱 맞는 여행 일정을 고민하고 있어요...',
            '최적의 동선을 위해 이동 거리를 분석 중입니다',
            '여행지의 숨겨진 명소들을 탐색하고 있어요',
            '일정 생성에는 보통 1~3분 정도 소요됩니다',
            '나만의 완벽한 여행 계획이 곧 완성됩니다!',
          ]}
        />
      )}

      {/* GNB */}
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex flex-1 relative overflow-hidden bg-[#0e1626]">
        {/* 1. 지도 영역 */}
        <MapSection
          isLoaded={isLoaded}
          center={mapCenter}
          zoom={zoom}
          onLoad={() => {}}
          path={path}
          scheduleItems={scheduleData[activeDay] || []}
          activeDay={activeDay}
          onZoomIn={() => setZoom((prev) => prev + 1)}
          onZoomOut={() => setZoom((prev) => prev - 1)}
          onMarkerClick={handleFocusLocation}
        />

        {/* 상단 정보바 */}
        <PlanInfo
          onBack={onBack}
          title={itineraryData.title}
          dateRange={`${itineraryData.startDate} - ${itineraryData.endDate}`}
          details={`${itineraryData.nights}박 ${itineraryData.tripDays}일 · ${itineraryData.peopleCount}명`}
          hashtags={itineraryData.tags}
          tasteMatch={
            itineraryData.isMyPlan
              ? undefined
              : itineraryData.tasteMatch || '백남수님의 취향, 라오스 여행!'
          }
        />

        {/* 중앙 하단 Input (사이드바가 닫혔을 때만) */}
        {!isChatSidebarOpen && (
          <div
            className={`absolute bottom-32 left-1/2 w-full max-w-[540px] z-10 px-5 animate-in fade-in zoom-in-95 transition-all duration-300 ${
              isScheduleSidebarOpen ? '-translate-x-2/3' : '-translate-x-1/2'
            }`}
          >
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="원하는 일정 수정 내용을 입력해주세요"
                className="w-full px-6 py-3.5 rounded-2xl shadow-2xl outline-none border-none text-sm bg-white focus:ring-2 focus:ring-sky-400 transition-all"
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
          className={`absolute bottom-8 z-10 w-full flex justify-center px-5 transition-all duration-300 ${
            !isChatSidebarOpen
              ? isScheduleSidebarOpen
                ? 'left-1/2 -translate-x-[56%]'
                : 'left-1/2 -translate-x-1/2'
              : '-translate-x-[20%]'
          }`}
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
                      onClick={() => {
                        setActiveDay(idx + 1);
                        if (scheduleData[idx + 1]?.[0]?.position) {
                          setMapCenter(scheduleData[idx + 1][0].position);
                          setZoom(14); // 날짜 변경 시 기본 줌으로 초기화
                        }
                      }}
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
        <div
          className={`flex transition-all duration-300 ease-in-out ${isScheduleSidebarOpen ? 'w-[320px]' : 'w-0 overflow-hidden'}`}
        >
          <ScheduleSidebar
            activeDay={activeDay}
            scheduleItems={scheduleData[activeDay] || []}
            onDragEnd={onDragEnd}
            onAddToMyPlan={() => {}}
            onItemClick={handleFocusLocation}
            isMyPlan={itineraryData.isMyPlan}
          />
        </div>

        {/* 사이드바 토글 버튼 */}
        <button
          onClick={() => setIsScheduleSidebarOpen(!isScheduleSidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 w-10 h-20 bg-white border-y border-l rounded-l-2xl shadow-[-5px_0_15px_rgba(0,0,0,0.05)] hover:bg-gray-50 flex items-center justify-center transition-all duration-300 ${
            isScheduleSidebarOpen ? 'right-[320px]' : 'right-0'
          }`}
        >
          <div
            className={`text-gray-400 transform transition-transform duration-300 ${isScheduleSidebarOpen ? 'rotate-180' : ''}`}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>
      </main>
    </div>
  );
};

export default PlanDetailPage;

