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
                transition={{ duration: 1.5 }}
                className="bg-white/5 rounded-[40px] p-5 border border-white/10 aspect-[16/9] relative flex shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {/* Map Mockup Area (2/3) */}
                <div className="flex-grow bg-[#1a1c1e] rounded-[32px] relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                      }}
                    />
                  </div>

                  {/* Markers */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-1/3 left-1/4 w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-[#1a1c1e]"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-[#1a1c1e]"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
                    className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] border-2 border-[#1a1c1e]"
                  />

                  {/* Polyline */}
                  <svg className="absolute inset-0 w-full h-full opacity-30">
                    <path
                      d="M100 150 L250 250 L400 350"
                      stroke="#00C2FF"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6,6"
                    />
                  </svg>

                  {/* LLM Bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="absolute top-6 right-6 max-w-[180px] bg-white rounded-[20px] p-4 shadow-2xl"
                  >
                    <div className="text-[8px] font-black text-[#00C2FF] mb-1.5 tracking-widest uppercase opacity-70">
                      AI Architect
                    </div>
                    <p className="text-[11px] font-black text-gray-800 leading-tight">
                      대자연과 도심의 균형을 맞춘 최적의 경로입니다.
                    </p>
                  </motion.div>
                </div>

                {/* Sidebar Mockup Area (1/3) */}
                <div className="w-[180px] ml-5 flex flex-col gap-4">
                  <div className="flex bg-white/5 p-1 rounded-xl self-start border border-white/10">
                    <button
                      onClick={() => setActiveTab('dense')}
                      className={`px-2.5 py-1.5 text-[9px] font-black rounded-lg transition-all ${activeTab === 'dense' ? 'bg-[#00C2FF] text-white' : 'text-gray-500'}`}
                    >
                      DENSE
                    </button>
                    <button
                      onClick={() => setActiveTab('relaxed')}
                      className={`px-2.5 py-1.5 text-[9px] font-black rounded-lg transition-all ${activeTab === 'relaxed' ? 'bg-[#00C2FF] text-white' : 'text-gray-500'}`}
                    >
                      RELAXED
                    </button>
                  </div>

                  <div className="flex-grow space-y-3">
                    <AnimatePresence mode="wait">
                      {activeTab === 'dense' ? (
                        <motion.div
                          key="dense"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-3"
                        >
                          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 group/item">
                            <div className="text-[8px] text-[#00C2FF] font-black mb-0.5 opacity-50">
                              09:00 AM
                            </div>
                            <div className="text-[12px] text-white font-bold">
                              센트럴 파크
                            </div>
                          </div>
                          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 group/item">
                            <div className="text-[8px] text-[#00C2FF] font-black mb-0.5 opacity-50">
                              11:30 AM
                            </div>
                            <div className="text-[12px] text-white font-bold">
                              현대 미술관
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="relaxed"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-3"
                        >
                          <div className="p-4 rounded-[20px] bg-[#00C2FF]/10 border border-[#00C2FF]/20 group/item">
                            <div className="text-[8px] text-[#00C2FF] font-black mb-0.5">
                              오전
                            </div>
                            <div className="text-[12px] text-white font-extrabold">
                              여유로운 산책
                            </div>
                          </div>
                          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 group/item">
                            <div className="text-[8px] text-gray-500 font-bold mb-0.5 tracking-wider uppercase">
                              오후
                            </div>
                            <div className="text-[12px] text-white font-bold">
                              로컬 카페 탐방
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
