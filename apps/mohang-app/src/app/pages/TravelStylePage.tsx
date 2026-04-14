import { useEffect, useState } from 'react';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
} from '@mohang/ui';
import type { SurveyData } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import busy from '../../assets/images/busy.png';
import relaxed from '../../assets/images/relaxed.png';
import tourist from '../../assets/images/TOURIST_SPOTS .png';
import local from '../../assets/images/LOCAL_EXPERIENCE.png';
import planned from '../../assets/images/PLANNED .png';
import spontaneous from '../../assets/images/SPONTANEOUS .png';
import efficiency from '../../assets/images/EFFICIENCY .png';
import emotionalCompass from '../../assets/images/EMOTIONAL .png';
import moodFire from '../../assets/images/ACTIVE.png';
import healingHeart from '../../assets/images/REST_FOCUSED.png';

interface StepConfig {
  id: keyof Pick<
    SurveyData,
    | 'pace_preference'
    | 'destination_preference'
    | 'planning_preference'
    | 'activity_preference'
    | 'priority_preference'
  >;
  title: string;
  subtitle: string;
  options: {
    displayId: string;
    serverValue: string;
    name: string;
    icon: string;
  }[];
}

const steps: StepConfig[] = [
  {
    id: 'pace_preference',
    title: '여행 스타일 선택',
    subtitle: '원하는 여행 밀도를 선택해주세요.\n빽빽하게 VS 여유롭게',
    options: [
      {
        displayId: 'DENSE',
        serverValue: 'DENSE',
        name: '빽빽하게',
        icon: busy,
      },
      {
        displayId: 'RELAXED',
        serverValue: 'RELAXED',
        name: '여유롭게',
        icon: relaxed,
      },
    ],
  },
  {
    id: 'planning_preference',
    title: '여행 스타일 선택',
    subtitle: '계획 방식에 가까운 스타일을 선택해주세요.\n계획형 VS 즉흥형',
    options: [
      {
        displayId: 'PLANNED',
        serverValue: 'PLANNED',
        name: '계획형',
        icon: planned,
      },
      {
        displayId: 'SPONTANEOUS',
        serverValue: 'SPONTANEOUS',
        name: '즉흥형',
        icon: spontaneous,
      },
    ],
  },
  {
    id: 'destination_preference',
    title: '여행 스타일 선택',
    subtitle: '선호하는 방문지를 선택해주세요.\n관광지 위주 VS 로컬 경험 위주',
    options: [
      {
        displayId: 'TOURIST',
        serverValue: 'TOURIST_SPOTS',
        name: '관광지 위주',
        icon: tourist,
      },
      {
        displayId: 'LOCAL',
        serverValue: 'LOCAL_EXPERIENCE',
        name: '로컬 경험 위주',
        icon: local,
      },
    ],
  },
  {
    id: 'activity_preference',
    title: '여행 스타일 선택',
    subtitle: '여행 중 원하는 활동량을 선택해주세요.\n휴식 중심 VS 활동 중심',
    options: [
      {
        displayId: 'REST',
        serverValue: 'REST_FOCUSED',
        name: '휴식 중심',
        icon: healingHeart,
      },
      {
        displayId: 'ACTIVE',
        serverValue: 'ACTIVE',
        name: '활동 중심',
        icon: moodFire,
      },
    ],
  },
  {
    id: 'priority_preference',
    title: '여행 스타일 선택',
    subtitle: '일정 추천에서 더 중요한 기준을 선택해주세요.\n감성 VS 효율',
    options: [
      {
        displayId: 'EMOTIONAL',
        serverValue: 'EMOTIONAL',
        name: '감성',
        icon: emotionalCompass,
      },
      {
        displayId: 'EFFICIENCY',
        serverValue: 'EFFICIENCY',
        name: '효율',
        icon: efficiency,
      },
    ],
  },
];

export default function TravelStylePage() {
  const navigate = useNavigate();
  const { surveyData, updateSurveyData } = useSurvey();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  useEffect(() => {
    const missingDefaults = steps.reduce((acc, step) => {
      if (!surveyData[step.id]) {
        return {
          ...acc,
          [step.id]: step.options[0].serverValue,
        };
      }

      return acc;
    }, {} as Partial<SurveyData>);

    if (Object.keys(missingDefaults).length > 0) {
      updateSurveyData(missingDefaults);
    }
  }, [surveyData, updateSurveyData]);

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, travelStyleStep: 0 },
      '',
      window.location.href,
    );

    const handlePopState = (event: PopStateEvent) => {
      const stepIdx = event.state?.travelStyleStep;

      if (
        typeof stepIdx === 'number' &&
        stepIdx >= 0 &&
        stepIdx < steps.length
      ) {
        setCurrentStepIdx(stepIdx);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const currentStep = steps[currentStepIdx];
  const selectedValue =
    surveyData[currentStep.id] || currentStep.options[0].serverValue;

  const handleSelect = (val: string) => {
    updateSurveyData({
      [currentStep.id]: val,
    });
  };

  const handleNext = () => {
    updateSurveyData({
      [currentStep.id]: selectedValue,
    });

    if (currentStepIdx < steps.length - 1) {
      const nextStepIdx = currentStepIdx + 1;
      window.history.pushState(
        { ...window.history.state, travelStyleStep: nextStepIdx },
        '',
        window.location.href,
      );
      setCurrentStepIdx(nextStepIdx);
    } else {
      navigate('/travel-setup');
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      window.history.back();
    } else {
      navigate('/travel-concept');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-28">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: colors.gray[800] }}
          >
            {currentStep.title}
          </h1>
          <p className="text-base text-gray-400 whitespace-pre-line leading-relaxed">
            {currentStep.subtitle}
          </p>
        </div>

        <div className="flex gap-5 max-w-2xl px-6 w-full justify-center">
          {currentStep.options.map((item) => (
            <div
              key={item.displayId}
              onClick={() => handleSelect(item.serverValue)}
              className={`flex-1 max-w-[220px] h-52 flex flex-col items-center justify-center rounded-[24px] border-2 cursor-pointer transition-all duration-300 gap-4 ${
                selectedValue === item.serverValue
                  ? 'border-cyan-400 bg-cyan-50/5 shadow-[0_15px_30px_rgba(34,211,238,0.12)]'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="h-28 w-28 flex items-center justify-center p-2">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <span
                style={{
                  color:
                    selectedValue === item.serverValue
                      ? colors.primary[500]
                      : colors.gray[700],
                  ...typography.body.BodyB,
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-10 left-0 w-full px-12 flex justify-between pointer-events-none">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto bg-gray-400 hover:bg-gray-500 shadow-sm"
          style={{
            ...typography.body.BodyM,
          }}
        >
          이전
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-2 rounded-lg text-white text-base transition-all active:scale-95 pointer-events-auto shadow-sm"
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
