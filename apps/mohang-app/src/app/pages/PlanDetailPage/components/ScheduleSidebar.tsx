import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  position: google.maps.LatLngLiteral;
}

interface ScheduleSidebarProps {
  activeDay: number;
  scheduleItems: ScheduleItem[];
  onDragEnd: (result: DropResult) => void;
  onAddToMyPlan: () => void;
  date?: string;
}

const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({
  activeDay,
  scheduleItems,
  onDragEnd,
  onAddToMyPlan,
  date,
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="schedule-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 overflow-y-auto px-8 py-4 relative scrollbar-hide pb-32"
            >
              {scheduleItems.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative flex gap-5 py-4 items-start"
                    >
                      {idx !== scheduleItems.length - 1 && (
                        <div
                          className="absolute left-[19px] top-[70px] w-[2px] h-[calc(90%-56px)]"
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
                        <span className="text-sky-500 text-[11px] font-black mt-1 uppercase">
                          {item.time}
                        </span>
                        <p className="text-gray-400 text-[10px] mt-1 font-medium leading-relaxed">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 하단 플로팅 버튼 */}
      <div className="absolute bottom-8 right-6 z-30">
        <button
          onClick={onAddToMyPlan}
          className="w-full text-white py-3 px-4 rounded-full font-black text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1"
          style={{
            background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)',
          }}
        >
          <span className="text-lg">+</span> 내 일정으로 찜하기
        </button>
      </div>
    </aside>
  );
};

export default ScheduleSidebar;
