import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  colors,
  typography,
  getMainPageUser,
  getAccessToken,
  createOrUpdatePreferences,
} from '@mohang/ui';
import mohaengLogo from '../../../assets/images/mohaeng-logo.svg';

type Step = 'START' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'DONE';

const STEP_ORDER: Step[] = [
  'START',
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'Q5',
  'Q6',
  'DONE',
];
const QUESTION_STEPS: Step[] = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
const TOTAL_STEPS = QUESTION_STEPS.length;

interface QuestionOption {
  text: string;
  highlight: string[];
  value: string;
}

const stepOptions: Record<string, QuestionOption[]> = {
  Q1: [
    {
      text: '에메랄드빛 바다와 부드러운 모래사장',
      highlight: ['바다', '모래사장'],
      value: 'OCEAN_BEACH',
    },
    {
      text: '눈 덮인 산등성이가 보이는 따뜻한 노천탕',
      highlight: ['노천탕'],
      value: 'SNOW_HOT_SPRING',
    },
    {
      text: '선선한 바람을 맞으며 걷기 좋은 깨끗한 도시의 거리',
      highlight: ['깨끗한 도시'],
      value: 'CLEAN_CITY_BREEZE',
    },
    {
      text: '에너지가 넘치는 실내 랜드마크',
      highlight: ['실내 랜드마크'],
      value: 'INDOOR_LANDMARK',
    },
  ],
  Q2: [
    {
      text: '가볍게 다녀올 수 있는 4시간 이내의 단거리',
      highlight: ['4시간'],
      value: 'SHORT_HAUL',
    },
    {
      text: '기본 전환을 할 수 있는 5~8시간 정도의 중거리',
      highlight: ['5~8시간'],
      value: 'MEDIUM_HAUL',
    },
    {
      text: '이국적 정취를 위해 10시간 이상의 장거리',
      highlight: ['10시간'],
      value: 'LONG_HAUL',
    },
  ],
  Q3: [
    {
      text: '세련된 디자인의 건축물이 가득한 현대적 감각',
      highlight: ['현대적'],
      value: 'MODERN_TRENDY',
    },
    {
      text: '유적지와 고즈넉한 역사적 분위기',
      highlight: ['역사적'],
      value: 'HISTORIC_RELAXED',
    },
    {
      text: '파도 소리와 새소리만 들리는 압도적인 대자연',
      highlight: ['대자연'],
      value: 'PURE_NATURE',
    },
  ],
  Q4: [
    {
      text: '최소한의 비용으로 합리적인 가성비 여행',
      highlight: ['가성비'],
      value: 'COST_EFFECTIVE',
    },
    {
      text: '여행지의 특별한 순간에는 지불하는 균형 잡힌 여행',
      highlight: ['균형'],
      value: 'BALANCED',
    },
    {
      text: '오직 최고의 서비스와 품질만을 지향하는 프리미엄 여행',
      highlight: ['프리미엄'],
      value: 'PREMIUM_LUXURY',
    },
  ],
  Q5: [
    {
      text: '현지인들만 아는 로컬 노포 탐방',
      highlight: ['로컬'],
      value: 'LOCAL_HIDDEN_GEM',
    },
    {
      text: '미슐랭 가이드 맛집이나 쾌적한 파인 다이닝',
      highlight: ['파인 다이닝'],
      value: 'FINE_DINING',
    },
    {
      text: '공간의 인테리어와 플레이팅이 완벽한 인스타 감성 카페 투어',
      highlight: ['카페 투어'],
      value: 'INSTAGRAMMABLE',
    },
  ],
  Q6: [
    {
      text: '유명 브랜드와 로컬 편집숍을 넘나드는 쇼핑 투어',
      highlight: ['쇼핑 투어'],
      value: 'SHOPPING_TOUR',
    },
    {
      text: '서핑, 스키, 등산 등 온몸으로 자연을 느끼는 역동적인 액티비티',
      highlight: ['액티비티'],
      value: 'DYNAMIC_ACTIVITY',
    },
    {
      text: '미술관과 박물관을 조용히 관람하며 예술적 영감을 채우는 시간',
      highlight: ['예술적'],
      value: 'ART_AND_CULTURE',
    },
  ],
};

const stepQuestions: Record<string, { title: string; subtitle: string }> = {
  Q1: {
    title: 'Q1. 선호하시는 기후와 풍경을\n알려주세요!',
    subtitle:
      '지금 이 순간, 당신의 오감을 깨우는\n가장 이상적인 날씨와 풍경은 무엇인가요?',
  },
  Q2: {
    title: 'Q2. 이동 범위 및 비행 한계',
    subtitle:
      '이번 여행을 위해 기꺼이 감수할 수 있는\n비행 시간의 한계는 어느 정도인가요?',
  },
  Q3: {
    title: 'Q3. 공간의 분위기와 감성',
    subtitle:
      "당신이 머무는 공간에서\n가장 중요하게 느끼고 싶은 '감성'은 무엇인가요?",
  },
  Q4: {
    title: 'Q4. 소비 성향과 가치',
    subtitle: '여행을 위한 소비에서\n가장 중요하게 생각하는 가치는 무엇인가요?',
  },
  Q5: {
    title: 'Q5. 식도락의 깊이 (다중 선택)',
    subtitle:
      '여행지에서 당신의 입맛을 사로잡을\n최고의 식사 경험은 무엇인가요?',
  },
  Q6: {
    title: 'Q6. 핵심 활동과 목적 (다중 선택)',
    subtitle: '이번 여행을 통해 얻고 싶은\n가장 중요한 경험은 무엇인가요?',
  },
};

function renderOptionText(text: string, highlights: string[]): React.ReactNode[] {
  let result: (string | React.ReactNode)[] = [text];
  highlights.forEach((hl, hi) => {
    const next: (string | React.ReactNode)[] = [];
    result.forEach((part, pi) => {
      if (typeof part === 'string') {
        const idx = part.indexOf(hl);
        if (idx !== -1) {
          if (idx > 0) next.push(part.slice(0, idx));
          next.push(
            <span key={`${hi}-${pi}`} style={{ color: colors.primary[500] }}>
              {hl}
            </span>,
          );
          if (idx + hl.length < part.length)
            next.push(part.slice(idx + hl.length));
        } else {
          next.push(part);
        }
      } else {
        next.push(part);
      }
    });
    result = next;
  });
  return result;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? '32px' : '10px',
            height: '10px',
            backgroundColor:
              i === current
                ? colors.primary[500]
                : i < current
                  ? colors.primary[200]
                  : colors.gray[200],
          }}
        />
      ))}
    </div>
  );
}

interface RadioOptionProps {
  option: QuestionOption;
  selected: boolean;
  onSelect: () => void;
}

function RadioOption({ option, selected, onSelect }: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-right"
      style={{
        borderColor: selected ? colors.primary[500] : colors.gray[200],
        backgroundColor: selected ? colors.primary[50] : colors.white.white100,
      }}
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: selected ? colors.primary[500] : colors.gray[200],
          backgroundColor: selected ? colors.primary[500] : 'transparent',
        }}
      >
        {selected && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className="flex-1 text-right"
        style={{ ...typography.body.BodyM, color: colors.gray[700] }}
      >
        {renderOptionText(option.text, option.highlight)}
      </span>
    </button>
  );
}

export function SurveyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('START');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      const isAuthed = Boolean(token && token !== 'undefined');
      setIsLoggedIn(isAuthed);

      if (isAuthed) {
        try {
          const res = await getMainPageUser();
          const userData = (res as any).data || res;
          console.log('User data:', userData);
          setUser(userData);
        } catch (error) {
          console.error('getMainPageUser ERROR:', error);
        }
      }
    };
    fetchUser();
  }, []);

  const userName = user?.name || '여행자';

  const handleNext = () => {
    const currentIdx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[currentIdx + 1]);
  };

  const handleDone = async () => {
    try {
      const payload = {
        weather: answers.Q1,
        travel_range: answers.Q2,
        travel_style: answers.Q3,
        budget_level: answers.Q4,
        food_personality: answers.Q5 || [],
        main_interests: answers.Q6 || [],
      };

      console.log('선호도 등록 요청 데이터:', payload);
      const res = await createOrUpdatePreferences(payload);
      console.log('등록 응답 데이터:', res);
      const data = (res as any).data || res;

      // 추천 여행지 결과 조회를 위해 홈이나 결과 페이지로 이동
      // jobId를 state로 전달하여 HomePage에서 결과를 조회할 수 있도록 함
      navigate('/', { state: { jobId: data.jobId } });
    } catch (error) {
      console.error('createOrUpdatePreferences ERROR:', error);
    }
  };

  const isQuestionStep = QUESTION_STEPS.includes(step);
  const currentStepIndex = QUESTION_STEPS.indexOf(step);
  const currentOptions = isQuestionStep ? stepOptions[step] : [];
  const currentQuestion = isQuestionStep ? stepQuestions[step] : null;

  const isMultiChoice = step === 'Q5' || step === 'Q6';
  const selectedValues = answers[step] || (isMultiChoice ? [] : null);

  const toggleAnswer = (val: string) => {
    setAnswers((prev) => {
      const current = prev[step] || [];
      const updated = current.includes(val)
        ? current.filter((v: string) => v !== val)
        : [...current, val];
      return { ...prev, [step]: updated };
    });
  };

  const setSingleAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [step]: val }));
  };

  const isStepValid = isMultiChoice
    ? selectedValues.length > 0
    : !!selectedValues;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4">
        <img
          src={mohaengLogo}
          alt="모행 로고"
          className="h-8 w-8 object-contain"
        />
        <span
          style={{ ...typography.title.TitleB, color: colors.primary[500] }}
        >
          MoHaeng
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-12">
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl">
          {/* 설문 시작 */}
          {step === 'START' && (
            <div className="flex flex-col items-center gap-8 md:gap-12 text-center">
              <p
                className="text-xl md:text-2xl lg:text-3xl font-medium"
                style={{
                  color: colors.gray[700],
                  lineHeight: '1.6',
                }}
              >
                {userName}님의 취향을 분석하기 위해
                <br />
                간단한 설문 조사를 시작하겠어요!
              </p>
              <button
                onClick={handleNext}
                className="w-full h-14 md:h-16 rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: colors.primary[500],
                  ...typography.body.LBodyM,
                }}
              >
                설문 시작하기
              </button>
            </div>
          )}

          {/* Q1 ~ Q6 */}
          {isQuestionStep && currentQuestion && (
            <div className="flex flex-col gap-6 md:gap-10">
              <StepIndicator current={currentStepIndex} total={TOTAL_STEPS} />

              <div className="flex flex-col gap-4">
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  style={{
                    color: colors.gray[800],
                    whiteSpace: 'pre-line',
                    lineHeight: '1.2',
                  }}
                >
                  {currentQuestion.title}
                </h1>
                <p
                  className="text-base md:text-lg"
                  style={{
                    color: colors.gray[300],
                    whiteSpace: 'pre-line',
                  }}
                >
                  {currentQuestion.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {currentOptions.map((option) => (
                  <RadioOption
                    key={option.text}
                    option={option}
                    selected={
                      isMultiChoice
                        ? selectedValues.includes(option.value)
                        : selectedValues === option.value
                    }
                    onSelect={() =>
                      isMultiChoice
                        ? toggleAnswer(option.value)
                        : setSingleAnswer(option.value)
                    }
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!isStepValid}
                className="w-full h-14 md:h-16 rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                style={{
                  backgroundColor: colors.primary[500],
                  ...typography.body.LBodyM,
                }}
              >
                다음
              </button>
            </div>
          )}

          {/* 완료 */}
          {step === 'DONE' && (
            <div className="flex flex-col items-center gap-8 md:gap-12 text-center">
              <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.primary[500] }}
              >
                <svg className="w-10 h-10 md:w-14 md:h-14" viewBox="0 0 48 40" fill="none">
                  <path
                    d="M4 20L18 34L44 6"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className="text-xl md:text-2xl lg:text-3xl font-medium"
                style={{
                  color: colors.gray[700],
                  lineHeight: '1.6',
                }}
              >
                {userName}님,
                <br />
                취향을 확실히 분석했어요!
              </p>
              <button
                onClick={handleDone}
                className="w-full h-14 md:h-16 rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: colors.primary[500],
                  ...typography.body.LBodyM,
                }}
              >
                시작하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
