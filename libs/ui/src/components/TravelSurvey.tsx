import React, { useState } from 'react';
import { colors, typography } from '@mohang/ui';

const surveyData = [
  {
    questionId: 1,
    title: (
      <>
        선호하시는 기후와 풍경을 <br />
        알려주세요!
      </>
    ),
    description: (
      <>
        지금 이 순간, 당신의 오감을 깨우는 <br />
        가장 이상적인 날씨와 풍경은 무엇인가요?
      </>
    ),
    options: [
      {
        id: 1,
        text: '에메랄드빛 바다와 부드러운 모래사장',
        highlight: [
          { text: '바다', color: colors.primary[500] },
          { text: '모래사장', color: colors.primary[500] },
        ],
      },
      {
        id: 2,
        text: '눈 덮인 산등성이가 보이는 따뜻한 노천탕',
        highlight: { text: '노천탕', color: colors.primary[500] },
      },
      {
        id: 3,
        text: '선선한 바람을 맞으며 걷기 좋은 깨끗한 도시의 거리',
        highlight: { text: '도시', color: colors.primary[500] },
      },
      {
        id: 4,
        text: '에너지가 넘치는 실내 랜드마크',
        highlight: { text: '실내 랜드마크', color: colors.primary[500] },
      },
    ],
  },
  {
    questionId: 2,
    title: '이동 범위 및 비행 한계',
    description: (
      <>
        이번 여행을 위해 기꺼이 감수할 수 있는 <br />
        비행 시간의 한계는 어느 정도인가요?
      </>
    ),
    options: [
      {
        id: 1,
        text: '가볍게 다녀올 수 있는 4시간 이내의 단거리',
        highlight: '단거리',
      },
      {
        id: 2,
        text: '기분 전환을 할 수 있는 5~8시간 정도의 중거리',
        highlight: '중거리',
      },
      {
        id: 3,
        text: '이국적 정취를 위해 10시간 이상의 장거리',
        highlight: '장거리',
      },
    ],
  },
  {
    questionId: 3,
    title: '공간의 분위기와 감성',
    description: (
      <>
        당신이 머무는 공간에서
        <br />
        가장 중요하게 느끼고 싶은 '감성'은 무엇인가요?
      </>
    ),
    options: [
      {
        id: 1,
        text: '세련된 디자인의 건축물이 가득한 현대적 감각',
        highlight: { text: '현대적', color: colors.primary[500] },
      },
      {
        id: 2,
        text: '유적지와 고즈넉한 역사적 분위기',
        highlight: { text: '역사적', color: colors.primary[500] },
      },
      {
        id: 3,
        text: '파도 소리와 새소리만 들리는 압도적인 대자연',
        highlight: { text: '대자연', color: colors.primary[500] },
      },
    ],
  },
];

export const TravelSurvey = () => {
  // 현재 어떤 질문(큰 ID)을 보고 있는지 관리 (0부터 시작)
  const [currentStep, setCurrentStep] = useState(0);
  // 각 질문별로 어떤 옵션을 선택했는지 저장 { 1: 1, 2: 4 ... }
  const [selections, setSelections] = useState<Record<number, number>>({});

  const currentQuestion = surveyData[currentStep];

  const handleSelect = (optionId: number) => {
    setSelections({
      ...selections,
      [currentQuestion.questionId]: optionId,
    });
  };

  const handleNext = () => {
    if (currentStep < surveyData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Survey Completed:', selections);
      alert('설문이 완료되었습니다!');
    }
  };

  const renderText = (
    text: string,
    highlight?:
      | string
      | { text: string; color: string }
      | { text: string; color: string }[],
  ) => {
    if (!highlight) return text;

    // 인자를 항상 배열로 정규화
    const highlights = Array.isArray(highlight)
      ? highlight
      : typeof highlight === 'string'
        ? [{ text: highlight, color: colors.primary[500] }]
        : [highlight];

    if (highlights.length === 0) return text;

    let parts: (string | React.ReactNode)[] = [text];

    highlights.forEach(({ text: highlightText, color }) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach((part) => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        const splitText = part.split(highlightText);
        splitText.forEach((t, i) => {
          newParts.push(t);
          if (i < splitText.length - 1) {
            newParts.push(
              <span key={`${highlightText}-${i}`} style={{ color }}>
                {highlightText}
              </span>,
            );
          }
        });
      });
      parts = newParts;
    });

    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>{part}</React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center w-full font-sans p-2 md:p-4">
      <div className="w-full max-w-xl">
        {/* 프로그레스 바 */}
        <div className="flex items-center gap-2 mb-4">
          {surveyData.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i === currentStep
                  ? 'w-10 h-2 bg-cyan-400 rounded-full'
                  : 'w-2 h-2 bg-gray-200 rounded-full'
              }`}
            />
          ))}
        </div>
        {/* 질문 헤더 */}
        <div className="flex flex-col gap-2 mb-6">
          <h1
            className="text-gray-900 mb-1"
            style={{ ...typography.title.TitleB }}
          >
            Q{currentQuestion.questionId}. {currentQuestion.title}
          </h1>
          <p
            className="text-gray-500 text-md leading-relaxed"
            style={{ ...typography.body.BodyB, lineHeight: '1.2' }}
          >
            {currentQuestion.description}
          </p>
        </div>

        {/* 선택지 목록 */}
        <div className="space-y-2 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg border-2 ${
                selections[currentQuestion.questionId] === option.id
                  ? 'border-cyan-100 bg-cyan-50'
                  : 'border-gray-50 bg-gray-50'
              }`}
            >
              {selections[currentQuestion.questionId] === option.id ? (
                <div className="w-6 h-6 text-cyan-400 bg-red-500" />
              ) : (
                <div className="w-6 h-6 text-gray-300" />
              )}
              <span style={{ ...typography.body.BodyB }}>
                {renderText(option.text, option.highlight)}
              </span>
            </button>
          ))}
        </div>

        <button
          disabled={!selections[currentQuestion.questionId]}
          onClick={handleNext}
          className="w-full py-3.5 bg-cyan-400 text-white text-base font-bold rounded-lg disabled:bg-gray-200 transition-all active:scale-[0.98]"
        >
          {currentStep === surveyData.length - 1 ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
};
