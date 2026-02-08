import React, { useState } from 'react';
import { Header } from '@mohang/ui';

const countries = [
  { id: 'japan', name: '일본', date: '미정', status: 'selected' },
  { id: 'usa', name: '미국', date: '미정', status: 'pending' },
  { id: 'germany', name: '독일', date: '미정', status: 'pending' },
];

export default function CalendarPage() {
  const [selectedCountry, setSelectedCountry] = useState('japan');
  // 일정 선택 상태: { start: 날짜, end: 날짜 }
  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: 1,
    end: 5,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 = 1월)

  // 이번 달의 첫 날짜 요일 구하기 (월요일 시작 기준: 월=0 ... 일=6)
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    // 일(0) -> 6, 월(1) -> 0, 화(2) -> 1 ...
    return day === 0 ? 6 : day - 1;
  };

  const firstDayIndex = getFirstDayOfMonth(year, month);
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 날짜 배열 생성
  const calendarDays = [];

  // 저번 달 날짜 채우기
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: month - 1, // 이전 달
      year: month === 0 ? year - 1 : year,
      type: 'prev',
    });
  }

  // 이번 달 날짜 채우기
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      type: 'current',
    });
  }

  // 다음 달 날짜 채우기 (나머지 채워서 42개 맞추기)
  const remainingSlots = 42 - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({
      day: i,
      month: month + 1, // 다음 달
      year: month === 11 ? year + 1 : year,
      type: 'next',
    });
  }

  const handleDateClick = (calendarDay: {
    day: number;
    month: number;
    year: number;
    type: string;
  }) => {
    // 이전/다음 달 클릭 시 해당 달로 이동
    if (calendarDay.type !== 'current') {
      setCurrentDate(new Date(calendarDay.year, calendarDay.month, 1));
      return;
    }

    const clickedDate = new Date(
      calendarDay.year,
      calendarDay.month,
      calendarDay.day,
    );

    // 시작일이 없거나 이미 기간 선택이 완료된 경우 -> 새로 시작일 지정
    if (!range.start || (range.start && range.end)) {
      setRange({ start: calendarDay.day, end: null });
    }
    // 시작일은 있고 종료일은 없는 상태
    else if (range.start && !range.end) {
      const startDate = new Date(year, month, range.start);

      // 클릭한 날이 시작일보다 앞선 경우 -> 시작일을 클릭한 날로 교체
      if (clickedDate < startDate) {
        setRange({ start: calendarDay.day, end: null });
      } else {
        // 날짜 차이 계산 (1일 = 86400000ms)
        const diffTime = Math.abs(clickedDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일 포함

        if (diffDays > 8) {
          alert('최대 8일까지만 선택 가능합니다!');
          // 선택을 초기화하거나 아무동작도 안 함
          return;
        }

        setRange({ ...range, end: calendarDay.day });
      }
    }
  };

  const isSelected = (day: number, type: string) => {
    if (type !== 'current') return false;
    if (!range.start) return false;
    if (!range.end) return day === range.start;
    return day >= range.start && day <= range.end;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main className="flex h-[calc(100vh-72px)] items-center">
        {/* 사이드바 */}
        <aside className="w-[20%] h-[50%] border-r relative p-16 mb-24 flex flex-col justify-center">
          <h2 className="text-xl font-bold">나라 선택</h2>
          <div className="space-y-10">
            <div className="absolute left-3 top-4 bottom-4 w-[1px] border-l border-dashed border-gray-300 -z-10" />
            {countries.map((country) => (
              <div key={country.id} className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="country"
                    checked={selectedCountry === country.id}
                    onChange={() => setSelectedCountry(country.id)}
                    className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-cyan-400 checked:bg-cyan-400 cursor-pointer transition-all"
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-bold text-lg ${selectedCountry === country.id ? 'text-black' : 'text-gray-400'}`}
                  >
                    {country.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {selectedCountry === country.id && range.start && range.end
                      ? `${month + 1}.${range.start} ~ ${month + 1}.${range.end}`
                      : country.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-400" />
        </aside>

        {/* 메인 콘텐츠 */}
        <section className="flex-1 p-12 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">일정 선택</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              희망하는 여행 기간을 선택해주세요!
              <br />
              최소 1일 이상, 8일 이하로 선택해야 합니다!
            </p>
          </div>

          <div className="w-[400px] select-none">
            <div className="flex items-center justify-between mb-6 px-4">
              <button
                className="text-gray-400 hover:text-black"
                onClick={() => {
                  setCurrentDate(new Date(year, month - 1, 1));
                }}
              >
                {'<'}
              </button>
              <span className="font-bold text-lg text-gray-600">
                {year}년 {month + 1}월
              </span>
              <button
                className="text-gray-400 hover:text-black"
                onClick={() => {
                  setCurrentDate(new Date(year, month + 1, 1));
                }}
              >
                {'>'}
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-4 font-bold">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((dateObj, i) => {
                const active = isSelected(dateObj.day, dateObj.type);
                const isStart = active && dateObj.day === range.start;
                const isEnd = active && dateObj.day === range.end;
                const isCurrentMonth = dateObj.type === 'current';

                return (
                  <div
                    key={i}
                    onClick={() => handleDateClick(dateObj)}
                    className={`relative h-12 flex items-center justify-center cursor-pointer text-sm transition-all
          ${active ? 'bg-cyan-50' : 'hover:bg-gray-100'} 
          ${isStart ? 'bg-blue-500 rounded-l-md z-10' : ''} 
          ${isEnd ? 'bg-blue-500 rounded-r-md z-10' : ''} 
          ${active && !isStart && !isEnd ? 'text-blue-700 font-medium' : ''}
          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
          ${isCurrentMonth && !active ? 'text-gray-700' : ''}
          ${isStart || isEnd ? 'text-white' : ''}
        `}
                  >
                    <span className={isStart || isEnd ? 'font-bold' : ''}>
                      {dateObj.day}
                    </span>

                    {/* 시작일 비행기 아이콘 */}
                    {isStart && (
                      <span className="absolute bottom-1 text-[10px] animate-bounce">
                        🛫
                      </span>
                    )}

                    {/* 종료일 비행기 아이콘 (도착 느낌으로 변경 가능) */}
                    {isEnd && (
                      <span className="absolute bottom-1 text-[10px]">🛬</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-10 w-full px-20 flex justify-between pointer-events-none">
        <button className="px-8 py-2 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 pointer-events-auto transition-colors">
          이전
        </button>
        <button className="px-8 py-2 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 pointer-events-auto transition-colors shadow-lg">
          다음
        </button>
      </footer>
    </div>
  );
}
