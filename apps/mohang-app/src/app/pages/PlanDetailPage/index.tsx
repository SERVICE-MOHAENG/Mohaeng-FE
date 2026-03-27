import { useState, useMemo, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { DropResult } from '@hello-pangea/dnd';
import MapSection from './components/MapSection';
import PlanInfo from './components/PlanInfo';
import ScheduleSidebar from './components/ScheduleSidebar';
import ChatSidebar from './components/ChatSidebar';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Header,
  getItineraryStatus,
  getItineraryResult,
  chatItineraryEdit,
  chatItineraryEditStatus,
  getAccessToken,
  LoadingScreen,
  getCourseDetail,
  getMainPageUser,
  UserResponse,
  useSurvey,
  updateCourseCompletion,
  copyCourse,
} from '@mohang/ui';

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
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any | null>(
    null,
  );

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
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const isAuthed = Boolean(token && token !== 'undefined');
    setIsLoggedIn(isAuthed);

    if (isAuthed) {
      getMainPageUser()
        .then((res) => setCurrentUser(res))
        .catch((err) => console.error('Failed to fetch user:', err));
    }
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
    authorName?: string;
    isEdited?: boolean;
    tasteMatch?: string;
    summary?: any;
    llmCommentary?: any;
    isCompleted?: boolean;
    is_completed?: boolean;
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
    isMyPlan: false,
    isEdited: false,
  });

  // Sync isMyPlan when currentUser or authorName changes, unless already edited
  useEffect(() => {
    if (currentUser && itineraryData.authorName && !itineraryData.isEdited) {
      const isOwnerByName = currentUser.profile.name === itineraryData.authorName;
      
      if (!itineraryData.isMyPlan && isOwnerByName) {
        setItineraryData((prev) => ({ ...prev, isMyPlan: true }));
      }
    }
  }, [currentUser, itineraryData.authorName, itineraryData.isEdited, itineraryData.isMyPlan]);

  const [scheduleData, setScheduleData] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (!itineraryData.itinerary) return;

    const formattedData: Record<number, any[]> = {};

    itineraryData.itinerary.forEach((day: any) => {
      formattedData[day.day_number] = day.places.map((place: any, pIdx: number) => ({
        id: place.id || `${place.place_id}-${day.day_number}-${pIdx}`,
        place_id: place.place_id,
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

    if (Object.keys(formattedData).length > 0) {
      setActiveDay(1);
      setSelectedScheduleItem(null);
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
      const fetchCourseResult = async () => {
        try {
          if (paramJobId) setTravelCourseId(paramJobId);
          setIsLoading(true);
          setLoadingMessage('일정을 구성하고 있습니다');

          const resultRes = await getCourseDetail(jobId);
          const data = resultRes.data;
          
          if (data && data.itinerary) {
            setItineraryData({
              itinerary: data.itinerary,
              title: data.title || '나의 여행 일정',
              startDate: data.start_date || '',
              endDate: data.end_date || '',
              nights: data.nights || 0,
              tripDays: data.trip_days || 0,
              peopleCount: data.people_count || 1,
              tags: data.tags || [],
              isMyPlan: (data as any).is_mine ?? (data as any).is_owner ?? (data as any).isMine ?? (data as any).isOwner ?? false,
              authorName: (data as any).userName || (data as any).author_name,
              tasteMatch: (data as any).userName
                ? `${(data as any).userName}님의 추천 코스`
                : undefined,
              summary: data.summary,
              llmCommentary: data.llm_commentary,
              isCompleted: data.is_completed ?? data.isCompleted,
              is_completed: data.is_completed ?? data.isCompleted,
            });

            if (data.llm_commentary) {
              const commentaryText = typeof data.llm_commentary === 'string' 
                ? data.llm_commentary 
                : data.llm_commentary.comment || data.llm_commentary.message || data.llm_commentary.text;
              
              if (commentaryText) {
                setMessages(prev => [
                  ...prev,
                  {
                    id: `ai-commentary-${Date.now()}`,
                    sender: 'ai',
                    text: commentaryText,
                    timestamp: new Date(),
                  }
                ]);
              }
            }
          } else {
            console.warn('Course data structure not recognized:', resultRes);
          }
          setIsLoading(false);
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
        const statusData = responseData.data?.status || responseData;
        const { status, travelCourseId: extractedId } = statusData;

        if (extractedId) {
          setTravelCourseId(extractedId);
        }

        if (status === 'SUCCESS' || status === 'COMPLETED') {
          if (extractedId || jobId) {
            const resultRes = (await getItineraryResult(jobId)) as any;
            const resultData = resultRes.data || resultRes;
            const data = resultData.result?.data || resultData.data || resultData;

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
                isMyPlan: data.is_mine ?? data.is_owner ?? data.isMine ?? data.isOwner ?? true,
                authorName: data.userName,
                isCompleted: data.is_completed ?? data.isCompleted,
                is_completed: data.is_completed ?? data.isCompleted,
              });
              setIsLoading(false);
            } else {
              console.warn('Itinerary data structure not recognized:', resultRes);
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
        setIsLoading(false);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 30000);
    return () => clearInterval(pollInterval);
  }, [jobId]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputValue;
    if (!textToSend.trim()) return;
    if (!travelCourseId) {
      alert('일정 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const originalInput = textToSend;
    if (!customMessage) setInputValue('');
    setIsChatSidebarOpen(true);
    setIsTyping(true);

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
      const responseRes = (await chatItineraryEdit(travelCourseId, originalInput)) as any;
      const response = responseRes.data.chat || responseRes;
      
      let lastStatusMessage = '';
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = (await chatItineraryEditStatus(response.jobId)) as any;
          const statusData = statusRes.data || statusRes;
          const status = statusData.status || statusData;

          const currentMessage = status.message;
          if (currentMessage && currentMessage !== lastStatusMessage && currentMessage !== '...') {
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

          if (status.status === 'COMPLETED' || status.status === 'SUCCESS' || status === 'COMPLETED' || status === 'SUCCESS') {
            clearInterval(pollInterval);
            setIsTyping(false);

            try {
              const res = (await getItineraryResult(response.jobId)) as any;
              const resultData = res.data || res;
              const data = resultData.result?.data || resultData.data || resultData;

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
                  isMyPlan: false,
                  authorName: data.userName,
                  isEdited: true,
                });
              }
            } catch (resultError) {
              console.error('Error fetching updated itinerary:', resultError);
            }

            const finalMsg = '요청하신 대로 일정을 수정했습니다! 확인해 보세요.';
            setMessages((prev) => {
              const hasSuccessMsg = prev.some((m) => m.sender === 'ai' && m.text === lastStatusMessage);
              if (hasSuccessMsg) return prev.filter((m) => m.id !== pendingMsgId);
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
            const failMsg = status.message || '죄송합니다. 일정 수정에 실패했습니다.';
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
          setMessages((prev) => prev.filter((m) => m.id !== pendingMsgId));
        }
      }, 3000);
    } catch (error: any) {
      console.error('Chat Edit Error:', error);
      setIsTyping(false);
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
    navigate(-1);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !scheduleData[activeDay]) return;
    const items = Array.from(scheduleData[activeDay]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScheduleData({ ...scheduleData, [activeDay]: items });
  };

  const handleSaveToMyPlan = async () => {
    if (!travelCourseId) {
      alert('일정 정보를 저장할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const res = await copyCourse(travelCourseId);
      if (res.success) {
        alert('내 여행 일정에 성공적으로 추가되었습니다!');
        navigate('/mypage');
      }
    } catch (error: any) {
      console.error('Failed to save to my plan:', error);
      alert(error.message || '일정 저장 중 오류가 발생했습니다.');
    }
  };

  const path = useMemo(
    () => scheduleData[activeDay]?.map((m) => m.position) || [],
    [scheduleData, activeDay],
  );

  const handleFocusLocation = (item: any) => {
    const isSameItem = selectedScheduleItem?.id === item.id || selectedScheduleItem?.place_id === item.place_id;
    setSelectedScheduleItem(isSameItem ? null : item);
    setMapCenter(item.position);
    setZoom(16);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-gray-900">
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

      <Header isLoggedIn={isLoggedIn} />

      <main className="flex flex-1 relative overflow-hidden bg-[#0e1626]">
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
          onMarkerClick={(position) => {
            setMapCenter(position);
            setZoom(16);
          }}
          selectedMarkerId={selectedScheduleItem?.id ?? null}
          onSelectedMarkerChange={setSelectedScheduleItem}
        />

        <PlanInfo
          onBack={onBack}
          title={itineraryData.title}
          dateRange={`${itineraryData.startDate} - ${itineraryData.endDate}`}
          details={`${itineraryData.nights}박 ${itineraryData.tripDays}일 · ${itineraryData.peopleCount}명`}
          hashtags={itineraryData.tags}
          tasteMatch={itineraryData.isMyPlan ? undefined : itineraryData.tasteMatch}
          summary={itineraryData.summary}
          isMyPlan={itineraryData.isMyPlan}
          isCompleted={(itineraryData as any).is_completed || (itineraryData as any).isCompleted}
          onToggleCompletion={async () => {
             const courseId = travelCourseId || jobId;
             if (!courseId) return;
             try {
               const currentStatus = !!((itineraryData as any).is_completed || (itineraryData as any).isCompleted);
               const newStatus = !currentStatus;
               await updateCourseCompletion(courseId, newStatus);
               setItineraryData(prev => ({ 
                 ...prev, 
                 isCompleted: newStatus,
                 is_completed: newStatus 
               } as any));
             } catch (error: any) {
               alert(error.message || '상태 변경에 실패했습니다.');
             }
          }}
        />

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
                onClick={() => handleSendMessage()}
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
            <button
              onClick={() => setTabPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={tabPageIndex === 0}
              className={`p-2 rounded-full transition-all ${tabPageIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  const dateString = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveDay(idx + 1);
                        if (scheduleData[idx + 1]?.[0]?.position) {
                          setMapCenter(scheduleData[idx + 1][0].position);
                          setZoom(14);
                        }
                      }}
                      className={`min-w-[140px] py-3 px-6 rounded-[22px] flex flex-col items-center transition-all duration-300 ${isActive ? 'text-white shadow-lg scale-[1.02]' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                      style={isActive ? { background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)' } : {}}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-white/80' : 'text-gray-300'}`}>Day {idx + 1}</span>
                      <span className="text-[13px] font-black">{dateString} ({dayName})</span>
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => setTabPageIndex((prev) => (prev + 1) * 3 < itineraryData.tripDays ? prev + 1 : prev)}
              disabled={(tabPageIndex + 1) * 3 >= itineraryData.tripDays}
              className={`p-2 rounded-full transition-all ${(tabPageIndex + 1) * 3 >= itineraryData.tripDays ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <ChatSidebar
          isOpen={isChatSidebarOpen}
          onClose={() => setIsChatSidebarOpen(false)}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          messages={messages}
          isTyping={isTyping}
          suggestions={itineraryData.llmCommentary?.next_action_suggestion || (itineraryData as any).next_action_suggestion}
        />

        <div className={`flex transition-all duration-300 ease-in-out ${isScheduleSidebarOpen ? 'w-[320px]' : 'w-0 overflow-hidden'}`}>
          <ScheduleSidebar
            activeDay={activeDay}
            scheduleItems={scheduleData[activeDay] || []}
            onDragEnd={onDragEnd}
            onAddToMyPlan={handleSaveToMyPlan}
            onItemClick={handleFocusLocation}
            isMyPlan={itineraryData.isMyPlan}
            isCompleted={!!((itineraryData as any).is_completed || (itineraryData as any).isCompleted)}
            onToggleCompletion={async () => {
              const courseId = travelCourseId || jobId;
              if (!courseId) return;
              try {
                const currentStatus = !!((itineraryData as any).is_completed || (itineraryData as any).isCompleted);
                const newStatus = !currentStatus;
                await updateCourseCompletion(courseId, newStatus);
                setItineraryData(prev => ({ 
                  ...prev, 
                  isCompleted: newStatus,
                  is_completed: newStatus 
                } as any));
              } catch (error: any) {
                alert(error.message || '상태 변경에 실패했습니다.');
              }
            }}
            selectedItemId={selectedScheduleItem?.id ?? null}
          />
        </div>

        <button
          onClick={() => setIsScheduleSidebarOpen(!isScheduleSidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 w-10 h-20 bg-white border-y border-l rounded-l-2xl shadow-[-5px_0_15px_rgba(0,0,0,0.05)] hover:bg-gray-50 flex items-center justify-center transition-all duration-300 ${isScheduleSidebarOpen ? 'right-[320px]' : 'right-0'}`}
        >
          <div className={`text-gray-400 transform transition-transform duration-300 ${isScheduleSidebarOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
      </main>
    </div>
  );
};

export default PlanDetailPage;
