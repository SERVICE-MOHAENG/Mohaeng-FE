import React, { useState } from 'react';
import { Header, typography } from '@mohang/ui';
import { colors } from '@mohang/ui';
import CalendarImg from '../../assets/images/CalendarImg.png';

const initialCountries: {
  id: string;
  name: string;
  date: string;
  status: string;
  selectedRange: { start: Date | null; end: Date | null };
}[] = [
  {
    id: 'japan',
    name: '일본',
    date: '미정',
    status: 'selected',
    selectedRange: { start: null, end: null },
  },
  {
    id: 'usa',
    name: '미국',
    date: '미정',
    status: 'pending',
    selectedRange: { start: null, end: null },
  },
  {
    id: 'germany',
    name: '독일',
    date: '미정',
    status: 'pending',
    selectedRange: { start: null, end: null },
  },
];

export default function CalendarPage() {
  const [countryList, setCountryList] = useState(initialCountries);
  const [selectedCountry, setSelectedCountry] = useState('japan');
  // 일정 선택 상태: { start: Date | null, end: Date | null }
  const [range, setRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 = 1월)

  const handleNext = () => {
    if (!range.start || !range.end) {
      alert('여행 기간을 먼저 선택해주세요!');
      return;
    }

    // 1. 현재 선택된 나라의 날짜 업데이트
    const dateString = `${range.start.getMonth() + 1}.${range.start.getDate()} ~ ${range.end.getMonth() + 1}.${range.end.getDate()}`;

    setCountryList((prev) =>
      prev.map((c) =>
        c.id === selectedCountry
          ? { ...c, date: dateString, selectedRange: { ...range } }
          : c,
      ),
    );

    // 2. 다음 나라로 이동
    const currentIndex = countryList.findIndex((c) => c.id === selectedCountry);
    if (currentIndex < countryList.length - 1) {
      const nextCountry = countryList[currentIndex + 1];
      setSelectedCountry(nextCountry.id);

      // 3. 선택한 날짜 초기화
      setRange({ start: null, end: null });
    } else {
      alert('모든 나라의 일정을 선택하셨습니다!');
      // 여기서 필요하다면 다음 페이지로 이동 logic 추가 (예: router.push)
    }
  };

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

  // 다음 달 날짜 채우기 (현재 주의 남은 빈 칸 채우기)
  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
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
    if (calendarDay.type === 'prev') {
      setCurrentDate(new Date(calendarDay.year, calendarDay.month, 1));
    }
    if (calendarDay.type === 'next') {
      setCurrentDate(new Date(calendarDay.year, calendarDay.month, 1));
    }

    const clickedDate = new Date(
      calendarDay.year,
      calendarDay.month,
      calendarDay.day,
    );

    if (!range.start || (range.start && range.end)) {
      setRange({ start: clickedDate, end: null });
    } else if (range.start && !range.end) {
      if (clickedDate < range.start) {
        setRange({ start: clickedDate, end: null });
      } else {
        // 날짜 차이 계산 (1일 = 86400000ms)
        const diffTime = Math.abs(
          clickedDate.getTime() - range.start.getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일 포함

        if (diffDays > 8) {
          alert('최대 8일까지만 선택 가능합니다!');
          // 선택을 초기화하거나 아무동작도 안 함
          return;
        }
        setRange({ ...range, end: clickedDate });
      }
    }
  };

  const isSelected = (dateObj: {
    year: number;
    month: number;
    day: number;
  }) => {
    if (!range.start) return false;

    // 비교를 위해 자정 기준 타임스탬프로 통일
    const current = new Date(
      dateObj.year,
      dateObj.month,
      dateObj.day,
    ).getTime();
    const start = new Date(
      range.start.getFullYear(),
      range.start.getMonth(),
      range.start.getDate(),
    ).getTime();

    if (!range.end) return current === start;

    const end = new Date(
      range.end.getFullYear(),
      range.end.getMonth(),
      range.end.getDate(),
    ).getTime();

    return current >= start && current <= end;
  };

  const getConfirmedCountry = (dateObj: {
    year: number;
    month: number;
    day: number;
  }) => {
    const current = new Date(
      dateObj.year,
      dateObj.month,
      dateObj.day,
    ).getTime();

    return countryList.find((country) => {
      // 현재 선택 중인 나라는 제외
      if (country.id === selectedCountry) return false;
      if (!country.selectedRange.start || !country.selectedRange.end)
        return false;

      const start = new Date(
        country.selectedRange.start.getFullYear(),
        country.selectedRange.start.getMonth(),
        country.selectedRange.start.getDate(),
      ).getTime();
      const end = new Date(
        country.selectedRange.end.getFullYear(),
        country.selectedRange.end.getMonth(),
        country.selectedRange.end.getDate(),
      ).getTime();

      return current >= start && current <= end;
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main className="flex h-[calc(100vh-72px)] items-center">
        {/* 사이드바 */}
        <aside className="h-[50%] border-r relative px-20 flex flex-col">
          <h2 style={{ ...typography.title.sTitleB }}>나라 선택</h2>
          <div className="py-8 relative">
            {/* 연결 점선 */}
            <div className="absolute left-[9.5px] top-2 bottom-2 w-0 border-l border-dashed border-gray-300 -z-10" />

            {countryList.map((country, index) => {
              const isActive = selectedCountry === country.id;
              const isScheduled = !!country.selectedRange.start;

              // 다음 나라가 있고, 현재 나라가 일정이 잡혀있으면 연결선을 파란색으로 (이미지 느낌 재현용)
              const hasNextScheduled =
                index < countryList.length - 1 &&
                !!countryList[index + 1].selectedRange.start;
              const showColorLine = isScheduled && hasNextScheduled;

              return (
                <div
                  key={country.id}
                  className="relative flex items-center gap-4 mb-12"
                >
                  {/* 항목 사이를 잇는 색칠된 선 (커스텀 구현) */}
                  {showColorLine && (
                    <div className="absolute left-[9.5px] top-5 h-12 w-0 border-l-2 border-cyan-400 -z-5" />
                  )}

                  <div className="relative flex items-center justify-center w-5 h-5 bg-white">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                        isActive || isScheduled
                          ? 'border-cyan-400'
                          : 'border-gray-200'
                      }`}
                    >
                      {(isActive || isScheduled) && (
                        <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="country"
                      checked={isActive}
                      onChange={() => setSelectedCountry(country.id)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        color: isActive
                          ? colors.black.black100
                          : colors.gray[400],
                        ...typography.title.sTitleB,
                      }}
                    >
                      {country.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: colors.gray[400],
                        ...typography.body.BodyM,
                      }}
                    >
                      {country.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 오른쪽 사이드바 표시선 */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-full" />
        </aside>

        {/* 메인 콘텐츠 */}
        <section className="flex-1 h-full py-4 px-8 flex flex-col items-center">
          <div className="text-center my-8">
            <h1 className="mb-4 " style={{ ...typography.title.sTitleB }}>
              일정 선택
            </h1>
            <p
              className="leading-relaxed"
              style={{ color: colors.gray[400], ...typography.body.BodyM }}
            >
              희망하는 여행 기간을 선택해주세요!
              <br />
              최소 1일 이상, 8일 이하로 선택해야 합니다!
            </p>
          </div>

          <div className="w-[400px] select-none">
            <div className="flex items-center justify-between mb-2 px-4">
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

                // Compare using timestamp for accuracy
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
                    onClick={() => handleDateClick(dateObj)}
                    className={`relative py-5 flex items-center justify-center cursor-pointer text-sm transition-all rounded-md
          ${!active ? 'hover:bg-gray-100' : ''} 
          ${isStart || isEnd ? 'pt-1' : ''}
        `}
                    style={{ ...cellStyle, ...typography.body.LBodyB }}
                  >
                    <span className={isStart || isEnd ? 'font-bold' : ''}>
                      {dateObj.day}
                    </span>

                    {/* 시작일 비행기 아이콘 */}
                    {isStart && (
                      <span className="absolute bottom-1">
                        <img src={CalendarImg} alt="Start" />
                      </span>
                    )}

                    {/* 종료일 비행기 아이콘 (도착 느낌으로 변경 가능) */}
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
        </section>
      </main>

      <footer className="fixed bottom-10 w-full px-20 flex justify-between pointer-events-none">
        <button className="px-8 py-2 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 pointer-events-auto transition-colors">
          이전
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-2 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 pointer-events-auto transition-colors shadow-lg"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
