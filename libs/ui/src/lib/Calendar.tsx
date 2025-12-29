import { useState } from 'react';

export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  minDate?: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
  monthOffset?: number; // 0 = 현재 달, 1 = 다음 달
}

export function Calendar({ selectedDate, onSelectDate, minDate, rangeStart, rangeEnd, monthOffset = 0 }: CalendarProps) {
  const getInitialMonth = () => {
    const base = selectedDate || new Date();
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && selected < minDate) return;
    onSelectDate?.(selected);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isInRange = (day: number) => {
    if (!rangeStart || !rangeEnd) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > rangeStart && date < rangeEnd;
  };

  const isRangeStart = (day: number) => {
    if (!rangeStart) return false;
    return (
      rangeStart.getDate() === day &&
      rangeStart.getMonth() === currentMonth.getMonth() &&
      rangeStart.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isRangeEnd = (day: number) => {
    if (!rangeEnd) return false;
    return (
      rangeEnd.getDate() === day &&
      rangeEnd.getMonth() === currentMonth.getMonth() &&
      rangeEnd.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < minDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthYear = currentMonth.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
  });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white rounded-2xl p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h3 className="text-xl font-bold text-gray-900">{monthYear}</h3>
        <button
          onClick={handleNextMonth}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-semibold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => {
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const today = isToday(day);
          const inRange = isInRange(day);
          const rStart = isRangeStart(day);
          const rEnd = isRangeEnd(day);
          const dayOfWeek = (firstDay + day - 1) % 7;
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-base font-semibold transition-all relative
                ${selected || rStart || rEnd ? 'bg-blue-600 text-white z-10' : ''}
                ${inRange ? 'bg-blue-100' : ''}
                ${!selected && !rStart && !rEnd && today ? 'border-2 border-blue-600 text-blue-600' : ''}
                ${!selected && !rStart && !rEnd && !today && !disabled && !inRange ? 'hover:bg-gray-100' : ''}
                ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!selected && !rStart && !rEnd && !today && !disabled && !inRange && isSunday ? 'text-red-600' : ''}
                ${!selected && !rStart && !rEnd && !today && !disabled && !inRange && isSaturday ? 'text-blue-600' : ''}
                ${!selected && !rStart && !rEnd && !today && !disabled && !inRange && !isSunday && !isSaturday ? 'text-gray-900' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
