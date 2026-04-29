import React from 'react';
import type { NormalizedSchedulePlace } from '../../../utils/placeSchema';

interface ScheduleSidebarProps {
  activeDay: number;
  scheduleItems: NormalizedSchedulePlace[];
  onAddToMyPlan: () => void;
  onItemClick?: (item: NormalizedSchedulePlace) => void;
  date?: string;
  isMyPlan?: boolean;
  isCompleted?: boolean;
  onToggleCompletion?: () => void;
  selectedItemId?: string | null;
}

const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({
  activeDay,
  scheduleItems,
  onAddToMyPlan,
  onItemClick,
  date,
  isMyPlan = false,
  isCompleted = false,
  onToggleCompletion,
  selectedItemId,
}) => {
  return (
    <aside className="w-[320px] bg-white border-l flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative">
      <div className="p-8 pt-6 pb-1">
        <h2 className="text-xl font-bold text-gray-800">
          Day {activeDay} 일정
        </h2>
        {date && (
          <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">
            {date}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4 relative scrollbar-hide pb-32">
        {scheduleItems.map((item, idx) => (
          <div
            key={item.id}
            className={`rounded-xl transition-colors ${
              selectedItemId === item.id ? 'bg-sky-50' : ''
            }`}
          >
            <div
              className="relative flex gap-5 py-4 items-start cursor-pointer hover:bg-gray-50 transition-colors rounded-xl px-2 -mx-2"
              onClick={() => onItemClick && onItemClick(item)}
            >
              {idx !== scheduleItems.length - 1 && (
                <div
                  className="absolute left-[26px] top-[70px] w-[2px] h-[calc(90%-56px)]"
                  style={{
                    background:
                      'linear-gradient(180deg, #00CCFF 0%, #BFDBFE 100%)',
                  }}
                ></div>
              )}
              <div className="w-10 h-10 rounded-xl bg-sky-400 flex items-center justify-center text-white font-black shadow-md shrink-0 z-10">
                {idx + 1}
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-[15px] text-gray-800">
                  {item.title}
                </span>
                <span
                  className={`mt-2 inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                    item.isCategoryFallback
                      ? 'border-gray-200 bg-gray-100 text-gray-500'
                      : 'border-sky-100 bg-sky-50 text-sky-600'
                  }`}
                >
                  {item.placeCategoryLabel}
                </span>
                <span className="text-sky-500 text-[11px] font-black mt-1 uppercase">
                  {item.time}
                </span>
                <p className="text-gray-400 text-[10px] mt-1 font-medium leading-relaxed">
                  {item.location}
                </p>
                <p className="text-gray-500 text-[10px] mt-1 font-medium leading-relaxed">
                  {item.description || '장소 설명이 아직 없어요.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 플로팅 버튼 */}
      {(!isMyPlan || (isMyPlan && onToggleCompletion)) && (
        <div className="absolute bottom-8 right-6 z-30">
          {!isMyPlan ? (
            <button
              onClick={onAddToMyPlan}
              className="w-full text-white py-4 px-8 rounded-full font-black text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)',
              }}
            >
              <span className="text-xl">+</span> 내 일정에 추가하기
            </button>
          ) : (
            <button
              onClick={onToggleCompletion}
              className={`w-full py-4 px-8 rounded-full font-black text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : 'text-white'
              }`}
              style={!isCompleted ? {
                background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)',
              } : {}}
            >
              {isCompleted && <span className="text-sm">✓</span>}
              {isCompleted ? '여행 완료' : '여행 완료하기'}
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default ScheduleSidebar;
