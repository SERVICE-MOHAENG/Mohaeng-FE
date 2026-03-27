import React from 'react';

interface PlanInfoProps {
  onBack: () => void;
  title: string;
  dateRange: string;
  details: string;
  tasteMatch?: string;
  hashtags: string[];
  summary?: any;
  isMyPlan?: boolean;
  isCompleted?: boolean;
  onToggleCompletion?: () => void;
}

const PlanInfo: React.FC<PlanInfoProps> = ({
  onBack,
  title,
  dateRange,
  details,
  tasteMatch,
  hashtags,
  summary,
  isMyPlan,
  isCompleted,
  onToggleCompletion,
}) => {
  return (
    <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 text-nowrap">
      <div className="flex flex-wrap gap-2.5 items-center">
        <button
          onClick={onBack}
          className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <span className="text-base">←</span>
          <span>뒤로</span>
        </button>
        <div className="bg-white px-4 py-1.5 rounded-full shadow-md font-bold text-sm text-gray-900 border border-gray-100">
          {title}
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-md text-gray-600 text-sm font-semibold border border-gray-100">
          {dateRange} · {details}
        </div>
        {tasteMatch && (
          <div className="bg-white px-4 py-2 rounded-full shadow-md text-blue-600 text-sm font-bold border border-gray-100">
            {tasteMatch}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-0.5">
        {hashtags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-sky-400 text-white text-[12px] px-4 py-1.5 rounded-full font-bold shadow-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlanInfo;
