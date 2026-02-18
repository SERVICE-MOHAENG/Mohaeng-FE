import React from 'react';

interface PlanInfoProps {
  onBack: () => void;
  title: string;
  dateRange: string;
  details: string;
  tasteMatch: string;
  hashtags: string[];
}

const PlanInfo: React.FC<PlanInfoProps> = ({
  onBack,
  title,
  dateRange,
  details,
  tasteMatch,
  hashtags,
}) => {
  return (
    <div className="absolute top-5 left-5 flex flex-col gap-2 z-10 text-nowrap">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={onBack}
          className="bg-white min-h-[35px] px-4 py-2 rounded-full shadow-md text-xs font-bold hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="mb-0.5">←</div>
            <div>뒤로</div>
          </div>
        </button>
        <div className="bg-white min-h-[35px] px-5 py-2 rounded-full shadow-md font-bold text-sm">
          {title}
        </div>
        <div className="bg-white min-h-[35px] px-5 py-2 rounded-full shadow-md text-gray-600 text-[11px] font-bold">
          {dateRange} · {details}
        </div>
        <div className="bg-white min-h-[35px] px-5 py-2 rounded-full shadow-md text-gray-600 text-[11px] font-bold">
          {tasteMatch}
        </div>
      </div>
      <div className="flex gap-2">
        {hashtags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-sky-400 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlanInfo;
