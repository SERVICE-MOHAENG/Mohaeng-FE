import { useState, useMemo } from 'react';
import { Header } from '@mohang/ui';
import { useJsApiLoader } from '@react-google-maps/api';
import { DropResult } from '@hello-pangea/dnd';
import MapSection from './components/MapSection';
import PlanInfo from './components/PlanInfo';
import ScheduleSidebar from './components/ScheduleSidebar';
import ChatSidebar from './components/ChatSidebar';
import { useNavigate } from 'react-router-dom';

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
  const [inputValue, setInputValue] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '안녕하세요! 어떤 일정 수정을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);

  const [scheduleData, setScheduleData] = useState<Record<number, any[]>>({
    1: [
      {
        id: 'd1-1',
        title: 'Cinderella Restaurant',
        position: { lat: 16.4855, lng: 97.6216 },
        time: '08:00',
        location: '호텔 루프탑',
      },
    ],
    2: [
      {
        id: 'd2-1',
        title: 'Ngwe Moe Hotel',
        position: { lat: 16.4782, lng: 97.6197 },
        time: '09:00',
        location: '수영장',
      },
    ],
    3: [
      {
        id: 'd3-1',
        title: '호텔 조식',
        position: { lat: 16.4855, lng: 97.6216 },
        time: '08:00',
        location: '호텔 루프탑 레스토랑 뷔페',
      },
      {
        id: 'd3-2',
        title: 'Ngwe Moe Hotel',
        position: { lat: 16.4782, lng: 97.6197 },
        time: '09:00',
        location: '수영장',
      },
      {
        id: 'd3-3',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
      {
        id: 'd3-4',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
      {
        id: 'd3-5',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
      {
        id: 'd3-6',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
      {
        id: 'd3-7',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
      {
        id: 'd3-8',
        title: 'Ocean Supercenter',
        position: { lat: 16.4688, lng: 97.6266 },
        time: '13:00',
        location: '쇼핑몰',
      },
    ],
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsChatSidebarOpen(true);
    setIsTyping(true);

    // AI 답변 시뮬레이션
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `"${userMessage.text}"에 대한 일정을 분석 중입니다. 잠시만 기다려주세요!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const onBack = () => {
    setIsChatSidebarOpen(false);
    setInputValue('');
    navigate('/travel-requirement');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(scheduleData[activeDay]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScheduleData({ ...scheduleData, [activeDay]: items });
  };

  const path = useMemo(
    () => scheduleData[activeDay].map((m) => m.position),
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
          center={scheduleData[activeDay][0]?.position || defaultCenter}
          zoom={zoom}
          onLoad={() => {}}
          path={path}
          scheduleItems={scheduleData[activeDay]}
          activeDay={activeDay}
          onZoomIn={() => setZoom((prev) => prev + 1)}
          onZoomOut={() => setZoom((prev) => prev - 1)}
        />

        {/* 상단 정보바 */}
        <PlanInfo
          onBack={onBack}
          title="베트남 하노이 여행"
          dateRange="2025.02.14 - 02.16"
          details="2박 3일 · 4명"
          tasteMatch="백남수님의 취향, 라오스 여행!"
          hashtags={['하롱베이투어', '가족여행']}
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
          className={`absolute bottom-8 z-10 w-full flex justify-center px-5 ${!isChatSidebarOpen ? 'left-1/2 -translate-x-[56%]' : 'left-1/5 -translate-x-[20%]'}`}
        >
          <div className="bg-[#f1f3f5] p-2 rounded-[28px] flex gap-2 shadow-2xl border border-white/50 backdrop-blur-sm">
            {[14, 15, 16].map((date, idx) => {
              const isActive = activeDay === idx + 1;
              const dateObj = new Date(2025, 1, date);
              const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
              const dayName = dayNames[dateObj.getDay()];

              return (
                <button
                  key={date}
                  onClick={() => setActiveDay(idx + 1)}
                  className={`min-w-[140px] py-3 px-6 rounded-[22px] flex flex-col items-center transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg scale-102'
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
                    className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-white/80' : 'text-gray-300'}`}
                  >
                    Day {idx + 1}
                  </span>
                  <span className="text-[13px] font-black">
                    2025.02.{date} ({dayName})
                  </span>
                </button>
              );
            })}
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
          scheduleItems={scheduleData[activeDay]}
          onDragEnd={onDragEnd}
          onAddToMyPlan={() => {}}
        />
      </main>
    </div>
  );
};

export default PlanDetailPage;
