import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAccessToken, colors, Globe, Header } from '@mohang/ui';
import mohaengLogo from '../../assets/images/mohaeng-logo.svg';

// Questions Data (FULL Roadmap Questionnaire)
const QUESTIONS = [
  {
    id: 'Q1',
    topic: 'Schedule',
    question: '언제 떠나는 여행인가요?',
    icon: '🗓️',
    options: ['날짜 선택', '기간 설정'],
  },
  {
    id: 'Q2',
    topic: 'Region',
    question: '어디로 향하시나요?',
    icon: '📍',
    options: ['국내외 전 지역', '복수 지역 선택'],
  },
  {
    id: 'Q3',
    topic: 'Companion',
    question: '누구와 함께 떠나시나요?',
    icon: '👥',
    options: ['혼자', '친구', '연인', '가족', '비즈니스'],
  },
  {
    id: 'Q4',
    topic: 'People',
    question: '몇 명이서 함께 하나요?',
    icon: '🔢',
    options: ['1명', '소규모 그룹', '대규모 단체'],
  },
  {
    id: 'Q5',
    topic: 'Theme',
    question: '어떤 분위기의 여행을 꿈꾸시나요?',
    icon: '✨',
    options: ['힐링', '액티비티', '문화공간', '쇼핑', '미식'],
  },
  {
    id: 'Q6',
    topic: 'Pace',
    question: '하루를 얼마나 빡빡하게 채우고 싶나요?',
    icon: '⚡',
    options: ['DENSE (빡빡하게)', 'RELAXED (널널하게)'],
  },
  {
    id: 'Q7',
    topic: 'Planning',
    question: '일정을 대하는 당신의 스타일은?',
    icon: '📝',
    options: ['PLANNED (계획형)', 'SPONTANEOUS (즉흥형)'],
  },
  {
    id: 'Q8',
    topic: 'Destination',
    question: '어떤 장소를 더 선호하시나요?',
    icon: '🏛️',
    options: ['TOURIST (관광지)', 'LOCAL (로컬 경험)'],
  },
  {
    id: 'Q9',
    topic: 'Activity',
    question: '무엇을 할 때 가장 즐거운가요?',
    icon: '⛰️',
    options: ['ACTIVE (활동 중심)', 'REST (휴식 중심)'],
  },
  {
    id: 'Q10',
    topic: 'Priority',
    question: '여행에서 가장 중요한 가치는?',
    icon: '⚖️',
    options: ['EFFICIENCY (효율)', 'EMOTIONAL (감성)'],
  },
  {
    id: 'Q11',
    topic: 'Budget',
    question: '어느 정도의 예산을 고려하시나요?',
    icon: '💳',
    options: ['LOW', 'MID', 'HIGH', 'LUXURY'],
  },
  {
    id: 'Q12',
    topic: 'Notes',
    question: '특별히 전달하고 싶은 메시지가 있나요?',
    icon: '✉️',
    options: ['자유로운 추가 요청'],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'dense' | 'relaxed'>('dense');

  useEffect(() => {
    const token = getAccessToken();
    const isAuthed = Boolean(token && token !== 'undefined');
    setIsLoggedIn(isAuthed);

    if (isAuthed) {
      navigate('/home', { replace: true });
    }

    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, [navigate]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory selection:bg-[#00C2FF]/30 scroll-smooth">
      <Header isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center snap-start snap-always">
        <div className="absolute inset-0 z-0 scale-100 md:scale-105">
          <Globe showOverlay={false} onClick={() => navigate('/login')} />
        </div>

        <AnimatePresence>
          {isLoaded && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 text-center space-y-10 px-6"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] drop-shadow-2xl">
                  세상에 없던
                  <br />
                  당신만의{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] via-cyan-300 to-blue-400">
                    항해
                  </span>
                </h1>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-xl mx-auto">
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed opacity-80">
                  모행의 지능형 큐레이션이 당신의 취향을 분석하여
                  <br />
                  가장 완벽한 여행의 경로를 그려냅니다.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => navigate('/login')}
                  className="group relative px-12 py-5 bg-[#00C2FF] text-white rounded-full font-bold text-xl shadow-[0_0_40px_rgba(0,194,255,0.3)] hover:shadow-[0_0_60px_rgba(0,194,255,0.5)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 font-black">시작하기</span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/30 to-transparent" />
      </section>

      {/* Discovery Section (The 12 Questions - Horizontal Scroll) */}
      <section className="h-screen py-16 overflow-hidden bg-gray-50/50 flex flex-col justify-center snap-start snap-always">
        <div className="max-w-7xl mx-auto w-full px-10 mb-8 md:mb-16 text-center shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#00C2FF] font-black text-xs mb-4 tracking-[0.4em] uppercase opacity-70">
              Phase 01: The Interview
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
              당신의 항해를 시작하기 위한
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#00C2FF]">
                12가지 질문
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="relative group/scroll overflow-hidden w-full">
          <style>{`
            @keyframes marqueeScroll {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-3888px, 0, 0); }
            }
          `}</style>
          {/* Infinite Auto Scroll Container using pure CSS to prevent breaking scroll-snap */}
          <div
            className="flex gap-6 px-10 pb-4 w-max hover:[animation-play-state:paused]"
            style={{ 
              animation: 'marqueeScroll 60s linear infinite',
              willChange: 'transform'
            }}
          >
            {/* Duplicate questions for seamless looping */}
            {[...QUESTIONS, ...QUESTIONS].map((q, i) => (
              <div
                key={`${q.id}-${i}`}
                className="flex-shrink-0 w-[300px] bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#00C2FF]/20 transition-all duration-700 group/card cursor-pointer"
              >
                <div className="text-4xl mb-6 group-hover/card:scale-110 transition-transform duration-700 origin-left">
                  {q.icon}
                </div>
                <h4 className="text-gray-400 font-bold text-[10px] tracking-widest uppercase mb-3">
                  {q.topic}
                </h4>
                <p className="text-xl font-black text-gray-800 leading-tight mb-8 h-[3em] flex items-center tracking-tighter">
                  {q.question}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt, optIdx) => (
                    <span
                      key={optIdx}
                      className="px-3.5 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-100 group-hover/card:bg-[#00C2FF]/5 group-hover/card:text-[#00C2FF] transition-colors"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Hint Gradients */}
          <div className="absolute top-0 left-0 bottom-4 w-32 bg-gradient-to-r from-gray-50/90 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-4 w-32 bg-gradient-to-l from-gray-50/90 to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* Visualization Section (Map & Itinerary) */}
      <section className="bg-gray-950 h-screen py-16 relative overflow-hidden flex flex-col justify-center snap-start snap-always">
        <div className="max-w-7xl mx-auto w-full px-10 relative z-10 shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                <div className="text-[#00C2FF] font-black text-xs mb-4 tracking-[0.4em] uppercase opacity-60">
                  Phase 02: Navigation
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
                  기술로 연결된
                  <br />
                  선명한 여정
                </h2>
                <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 opacity-70">
                  모행은 수천 개의 목적지를 실시간으로 연동하여 날짜별 동선과
                  예술적인 지도를 선사합니다.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 bg-[#00C2FF]/20 rounded-xl flex items-center justify-center text-base text-[#00C2FF] font-black">
                      01
                    </div>
                    <div className="text-white font-bold text-base">
                      압도적인 Map View
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 bg-[#00C2FF]/20 rounded-xl flex items-center justify-center text-base text-[#00C2FF] font-black">
                      02
                    </div>
                    <div className="text-white font-bold text-base">
                      날짜별 동선 시각화
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              {/* Mock UI Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full aspect-[16/9] relative flex gap-5 p-2"
              >
                {/* Left Column */}
                <div className="flex-[3] flex flex-col gap-5">
                  {/* Map Widget */}
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} viewport={{ once: true }}
                    className="flex-[2] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl relative overflow-hidden group"
                  >
                    {/* Header */}
                    <div className="absolute top-6 left-6 z-20">
                      <div className="text-[10px] text-[#00C2FF] font-black uppercase tracking-widest mb-1 opacity-80">Live Navigation</div>
                      <h3 className="text-white font-bold text-lg leading-tight">최적화된 이동 경로</h3>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0f19]/80 z-10" />

                    {/* SVG Map Path */}
                    <svg className="absolute inset-0 w-full h-full object-cover z-0" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
                      <path d="M -50,150 C 100,100 150,200 250,50 C 300,10 350,100 450,80" stroke="#00C2FF" strokeWidth="3" fill="none" strokeDasharray="6 6" className="opacity-50" />
                      <motion.path 
                        d="M -50,150 C 100,100 150,200 250,50 C 300,10 350,100 450,80" 
                        stroke="#00C2FF" strokeWidth="4" fill="none" 
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      />
                      {/* Waypoints */}
                      <circle cx="250" cy="50" r="5" fill="#fff" className="drop-shadow-[0_0_15px_#00C2FF]" />
                      <circle cx="250" cy="50" r="15" fill="#00C2FF" opacity="0.3" className="animate-ping" />
                      <circle cx="50" cy="110" r="4" fill="#64748b" />
                      <circle cx="370" cy="85" r="4" fill="#64748b" />
                    </svg>

                    {/* Floating active marker */}
                    <motion.div 
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2, type: 'spring' }}
                      className="absolute top-[40px] left-[61%] z-30 bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-900 shadow-[0_10px_30px_rgba(0,194,255,0.4)] flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" /> 메트로폴리탄 미술관
                    </motion.div>
                  </motion.div>

                  {/* Bottom Widgets */}
                  <div className="flex-[1] flex gap-5">
                    {/* Time Widget */}
                    <motion.div 
                      initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} viewport={{ once: true }}
                      className="flex-1 bg-gradient-to-br from-[#00C2FF]/10 to-[#0057FF]/10 backdrop-blur-2xl border border-[#00C2FF]/20 rounded-[28px] shadow-2xl p-6 flex flex-col justify-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C2FF]/10 rounded-full blur-[40px] -mr-10 -mt-10" />
                      <div className="text-[#00C2FF] font-black text-3xl mb-1 tracking-tighter">4<span className="text-xl opacity-60 ml-0.5 mr-2">h</span>30<span className="text-xl opacity-60 ml-0.5">m</span></div>
                      <div className="text-blue-200/50 text-[10px] font-black uppercase tracking-widest">예상 소요 시간</div>
                    </motion.div>

                    {/* Distance Widget */}
                    <motion.div 
                      initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} viewport={{ once: true }}
                      className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl p-6 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-black text-3xl mb-1 tracking-tighter">24.5<span className="text-sm text-gray-400 ml-1.5">km</span></div>
                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">총 이동 거리</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Column: Itinerary */}
                <motion.div 
                  initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} viewport={{ once: true }}
                  className="flex-[2] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl p-8 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-white font-black text-2xl mb-1.5">Day 1 일정</h3>
                      <p className="text-[#00C2FF] text-xs font-black uppercase tracking-widest">도심 속 로컬 경험</p>
                    </div>
                    <div className="bg-white/10 text-white text-[10px] px-3 py-1.5 rounded-full font-bold">10.24 (목)</div>
                  </div>

                  <div className="flex-1 relative flex flex-col justify-center gap-8 pl-8">
                    {/* Timeline Line */}
                    <div className="absolute left-10 top-4 bottom-4 w-[2px] bg-gradient-to-b from-gray-700 via-[#00C2FF] to-gray-700 opacity-40 rounded-full" />
                    
                    {/* Items */}
                    {/* Item 1 */}
                    <div className="relative pl-8 group">
                      <div className="absolute left-[-21px] top-1.5 w-3 h-3 bg-gray-500 rounded-full border-4 border-[#0b0f19] transition-transform group-hover:scale-125 group-hover:bg-gray-400" />
                      <div className="text-gray-500 text-[10px] font-black tracking-widest mb-1.5">09:00 AM</div>
                      <div className="text-gray-300 font-bold text-[15px] mb-1">센트럴 파크</div>
                    </div>

                    {/* Item 2 - Active */}
                    <div className="relative pl-8 group">
                      <div className="absolute left-[-23px] top-1.5 w-[14px] h-[14px] bg-[#00C2FF] rounded-full border-[3px] border-[#0b0f19] shadow-[0_0_15px_#00C2FF] transition-transform group-hover:scale-110" />
                      <div className="text-[#00C2FF] text-[10px] font-black tracking-widest mb-1.5 flex items-center gap-2">
                        11:30 AM <span className="text-[8px] bg-[#00C2FF]/20 px-1.5 py-0.5 rounded text-[#00C2FF]">현재 단계</span>
                      </div>
                      <div className="text-white font-black text-[17px] mb-1">메트로폴리탄 미술관</div>
                      <div className="text-gray-400 text-xs font-medium">세계 최대의 미술관 관람</div>
                    </div>

                    {/* Item 3 */}
                    <div className="relative pl-8 group opacity-60 hover:opacity-100 transition-opacity">
                      <div className="absolute left-[-21px] top-1.5 w-3 h-3 bg-gray-600 rounded-full border-4 border-[#0b0f19]" />
                      <div className="text-gray-500 text-[10px] font-black tracking-widest mb-1.5">02:00 PM</div>
                      <div className="text-gray-400 font-bold text-[15px] mb-1">첼시 마켓</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-white text-xs font-bold flex justify-center items-center gap-2 group">
                      <span>일정 전체 보기</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Abstract background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
      </section>

      {/* Community / Inspiration Section */}
      <section className="bg-white h-screen py-16 flex flex-col justify-center snap-start snap-always">
        <div className="max-w-7xl mx-auto w-full px-10 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="order-2 md:order-1 relative"
            >
              <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-[48px] p-10 border border-gray-100 shadow-xl relative z-10 overflow-hidden">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-[#00C2FF]/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    📖
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-800 tracking-tight">
                      Explore Journeys
                    </h4>
                    <p className="text-gray-400 font-bold text-base">
                      다른 이들의 발자취를 따라
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-8 rounded-[28px] bg-[#00C2FF]/5 border border-[#00C2FF]/20 flex items-center justify-between group overflow-hidden relative cursor-default"
                  >
                    <span className="font-black text-[#00C2FF] text-lg relative z-10">
                      여행자들의 로드맵 탐색
                    </span>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md relative z-10 text-lg">
                      🗺️
                    </div>
                    <div className="absolute inset-0 bg-[#00C2FF]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-8 rounded-[28px] bg-gray-50 border border-gray-100 flex items-center justify-between group overflow-hidden relative cursor-default"
                  >
                    <span className="font-black text-gray-700 text-lg relative z-10">
                      영감을 주는 여행기 읽기
                    </span>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative z-10 text-lg">
                      ✍️
                    </div>
                    <div className="absolute inset-0 bg-gray-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#00C2FF]/5 rounded-full blur-[80px]" />
            </motion.div>

            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                <div className="text-[#00C2FF] font-black text-xs mb-4 tracking-[0.4em] uppercase opacity-60">
                  Phase 03: Community
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight mb-8 tracking-tighter">
                  누군가의 기록이
                  <br />
                  당신의{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#00C2FF]">
                    영감
                  </span>
                  이 됩니다
                </h2>
                <p className="text-gray-500 text-xl font-medium leading-relaxed mb-10 opacity-70">
                  모행은 다른 여행자들이 남긴 생생한 로드맵과 블로그를 통해
                  새로운 목적지를 발견할 수 있는 창을 제공합니다.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section (Stats) */}
      <section className="bg-gray-50/80 h-screen py-16 border-y border-gray-100 relative overflow-hidden flex flex-col justify-center snap-start snap-always">
        <div className="max-w-7xl mx-auto w-full px-10 text-center relative z-10 shrink-0">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl md:text-5xl font-black mb-20 tracking-tighter leading-snug"
            style={{ color: colors.gray[800] }}
          >
            오늘 하루,
            <br />
            이미{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#00C2FF]">
              수천 명
            </span>
            이 모행을 경험했습니다.
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-10">
            {[
              { val: '3,842+', label: '기록된 여정들' },
              { val: '124개국', label: '함께한 도시들' },
              { val: '8,201+', label: '나누고 싶은 장소들' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1.2 }}
                className="bg-white px-12 py-16 rounded-[48px] shadow-sm hover:shadow-xl transition-all duration-1000 w-full md:w-auto min-w-[300px] group border border-gray-100"
              >
                <div className="text-5xl font-black text-[#00C2FF] mb-6 group-hover:scale-110 transition-transform duration-700 tracking-tighter">
                  {stat.val}
                </div>
                <div className="text-gray-400 font-bold text-lg tracking-tight opacity-60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-100/20 rounded-full blur-[200px] -mr-[400px] -mt-[400px]" />
      </section>

      {/* CTA Footer Section */}
      <section className="h-screen py-16 text-center relative bg-white flex flex-col justify-center snap-start snap-always">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="flex flex-col items-center gap-12"
        >
          <div className="flex items-center gap-4">
            <img
              src={mohaengLogo}
              alt="Logo"
              className="w-16 h-16 animate-pulse opacity-70"
            />
            <span className="text-3xl font-black text-[#00C2FF] tracking-tighter">
              MoHaeng
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter leading-tight max-w-3xl">
            당신만의 특별한 목적지로 향하는 여정,
            <br />
            모행과 함께 지도를 그려보세요.
          </h3>

          <div className="flex flex-col items-center gap-8">
            <button
              onClick={() => navigate('/login')}
              className="px-16 py-5 bg-[#00C2FF] text-white rounded-full font-black text-xl shadow-[0_15px_50px_rgba(0,194,255,0.4)] hover:shadow-[0_25px_70px_rgba(0,194,255,0.6)] transition-all hover:scale-105 active:scale-95"
            >
              지금 가입하고 시작하기
            </button>
            <p className="text-gray-400 font-bold opacity-60 text-base">
              진짜 여행을 위한 가장 완벽한 공간
            </p>
          </div>

          <p className="text-gray-300 font-bold mt-24 tracking-[0.3em] uppercase text-[10px]">
            © 2026 MoHaeng Platform. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
