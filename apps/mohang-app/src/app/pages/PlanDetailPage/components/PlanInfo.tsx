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
}) => {
  return (
    <div className="absolute top-5 left-5 flex flex-col gap-2 z-10 text-nowrap">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={onBack}
          className="bg-white min-h-[30px] px-3 py-1.5 rounded-full shadow-md text-[11px] font-bold hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <div className="mb-0.5 text-xs">←</div>
            <div>뒤로</div>
          </div>
        </button>
        <div className="bg-white min-h-[30px] px-4 py-1.5 rounded-full shadow-md font-bold text-[13px]">
          {title}
        </div>
        <div className="bg-white min-h-[30px] px-4 py-1.5 rounded-full shadow-md text-gray-600 text-[10px] font-bold">
          {dateRange} · {details}
        </div>
        {tasteMatch && (
          <div className="bg-white min-h-[30px] px-4 py-1.5 rounded-full shadow-md text-gray-600 text-[10px] font-bold text-nowrap">
            {tasteMatch}
          </div>
        )}
      </div>
      <div className="flex gap-1.5">
        {hashtags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-sky-400 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold shadow-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlanInfo;
