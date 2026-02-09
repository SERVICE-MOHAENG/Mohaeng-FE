import { Header } from '@mohang/ui';
import { useCalendarLogic } from './useCalendarLogic';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { CalendarFooter } from './CalendarFooter';
import { Country } from './types';
import { useEffect, useState } from 'react';

const initialCountries: Country[] = [
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
  } = useCalendarLogic(initialCountries);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
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
