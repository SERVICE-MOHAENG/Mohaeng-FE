import React from 'react';
import { typography, colors } from '@mohang/ui';
import { DateRange, CalendarDay, Country } from './types';
import CalendarImg from '../../../assets/images/CalendarImg.png';

interface CalendarGridProps {
  year: number;
  month: number;
  calendarDays: CalendarDay[];
  range: DateRange;
  onDateClick: (day: CalendarDay) => void;
  isSelected: (dateObj: {
    year: number;
    month: number;
    day: number;
  }) => boolean;
  getConfirmedCountry: (dateObj: {
    year: number;
    month: number;
    day: number;
  }) => Country | undefined;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  calendarDays,
  range,
  onDateClick,
  isSelected,
  getConfirmedCountry,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="w-[400px] select-none">
      <div className="flex items-center justify-between mb-2 px-4">
        <button
          className="text-gray-400 hover:text-black"
          onClick={onPrevMonth}
        >
          {'<'}
        </button>
        <span className="font-bold text-lg text-gray-600">
          {year}년 {month + 1}월
        </span>
        <button
          className="text-gray-400 hover:text-black"
          onClick={onNextMonth}
        >
          {'>'}
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-gray-400 font-bold">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <div key={idx} className="py-2" style={typography.body.BodyB}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dateObj, i) => {
          const active = isSelected(dateObj);
          const confirmedCountry = getConfirmedCountry(dateObj);

          const currentTimestamp = new Date(
            dateObj.year,
            dateObj.month,
            dateObj.day,
          ).getTime();
          const startTimestamp = range.start
            ? new Date(
                range.start.getFullYear(),
                range.start.getMonth(),
                range.start.getDate(),
              ).getTime()
            : null;
          const endTimestamp = range.end
            ? new Date(
                range.end.getFullYear(),
                range.end.getMonth(),
                range.end.getDate(),
              ).getTime()
            : null;

          const isStart = active && currentTimestamp === startTimestamp;
          const isEnd = active && currentTimestamp === endTimestamp;

          const isConfirmedStart =
            confirmedCountry &&
            confirmedCountry.selectedRange.start &&
            new Date(
              confirmedCountry.selectedRange.start.getFullYear(),
              confirmedCountry.selectedRange.start.getMonth(),
              confirmedCountry.selectedRange.start.getDate(),
            ).getTime() === currentTimestamp;
          const isConfirmedEnd =
            confirmedCountry &&
            confirmedCountry.selectedRange.end &&
            new Date(
              confirmedCountry.selectedRange.end.getFullYear(),
              confirmedCountry.selectedRange.end.getMonth(),
              confirmedCountry.selectedRange.end.getDate(),
            ).getTime() === currentTimestamp;

          const isCurrentMonth = dateObj.type === 'current';

          const cellStyle: React.CSSProperties = {
            backgroundColor:
              isStart || isEnd
                ? colors.primary[500]
                : active
                  ? colors.primary[50]
                  : isConfirmedStart || isConfirmedEnd
                    ? colors.gray[300]
                    : confirmedCountry
                      ? colors.gray[200]
                      : undefined,
            color:
              isStart || isEnd || confirmedCountry
                ? colors.white.white100
                : !isCurrentMonth
                  ? colors.gray[300]
                  : active
                    ? colors.primary[700]
                    : colors.gray[400],
            fontWeight: isStart || isEnd ? 700 : active ? 500 : undefined,
          };

          return (
            <div
              key={i}
              onClick={() => onDateClick(dateObj)}
              className={`relative py-5 flex items-center justify-center cursor-pointer text-sm transition-all rounded-md ${!active ? 'hover:bg-gray-100' : ''} ${isStart || isEnd ? 'pt-1' : ''}`}
              style={{ ...cellStyle, ...typography.body.LBodyB }}
            >
              <span className={isStart || isEnd ? 'font-bold' : ''}>
                {dateObj.day}
              </span>
              {isStart && (
                <span className="absolute bottom-1">
                  <img src={CalendarImg} alt="Start" />
                </span>
              )}
              {isEnd && (
                <span className="absolute bottom-1 text-[10px]">
                  <img src={CalendarImg} alt="End" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
