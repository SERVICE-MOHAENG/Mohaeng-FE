import { Header, useSurvey, getAccessToken } from '@mohang/ui';
import { useCalendarLogic } from './useCalendarLogic';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { CalendarFooter } from './CalendarFooter';
import { Country } from './types';
import { useEffect, useState, useMemo } from 'react';

export default function CalendarPage() {
  const { surveyData } = useSurvey();
  const regions = surveyData.regions || [];
  const destinations = regions.map((r: { region: string }) => r.region);

  // 도출된 목적지 목록을 Country 타입으로 변환
  const mappedCountries: Country[] = useMemo(
    () =>
      destinations.length > 0
        ? destinations.map((name: string, index: number) => ({
            id: `dest-${index}`,
            name,
            date: '미정',
            status: index === 0 ? 'selected' : 'pending',
            selectedRange: { start: null, end: null },
          }))
        : [
            {
              id: 'default',
              name: '목적지를 선택해주세요',
              date: '미정',
              status: 'selected',
              selectedRange: { start: null, end: null },
            },
          ],
    [destinations],
  );

  const {
    countryList,
    selectedCountry,
    range,
    year,
    month,
    calendarDays,
    handleNext,
    handleDateClick,
    isSelected,
    getConfirmedCountry,
    handleCountryChange,
    setCurrentDate,
  } = useCalendarLogic(mappedCountries);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex h-[calc(100vh-72px)] items-center">
        <CalendarSidebar
          countryList={countryList}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
        />

        <section className="flex-1 h-full py-4 px-8 flex flex-col items-center">
          <CalendarHeader />
          <CalendarGrid
            year={year}
            month={month}
            calendarDays={calendarDays}
            range={range}
            onDateClick={handleDateClick}
            isSelected={isSelected}
            getConfirmedCountry={getConfirmedCountry}
            onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
            onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
          />
        </section>
      </main>

      <CalendarFooter onNext={handleNext} />
    </div>
  );
}
