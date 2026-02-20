import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '@mohang/ui';
import { Country, DateRange, CalendarDay } from './types';

export const useCalendarLogic = (initialCountries: Country[]) => {
  const navigate = useNavigate();
  const { surveyData, updateSurveyData } = useSurvey();
  const [countryList, setCountryList] = useState<Country[]>(initialCountries);
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountries.length > 0 ? initialCountries[0].id : '',
  );
  const [range, setRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleNext = () => {
    if (!range.start || !range.end) {
      alert('여행 기간을 먼저 선택해주세요!');
      return;
    }

    const startDateStr = range.start.toISOString().split('T')[0];
    const endDateStr = range.end.toISOString().split('T')[0];
    const dateDisplayStr = `${range.start.getMonth() + 1}.${range.start.getDate()} ~ ${range.end.getMonth() + 1}.${range.end.getDate()}`;

    // 현재 선택된 국가의 정보 찾기
    const currentCountry = countryList.find((c) => c.id === selectedCountry);
    if (!currentCountry) return;

    // SurveyContext의 regions 업데이트
    const updatedRegions = surveyData.regions.map((r) =>
      r.region === currentCountry.name
        ? { ...r, start_date: startDateStr, end_date: endDateStr }
        : r,
    );

    updateSurveyData({ regions: updatedRegions });

    // 로컬 국가 리스트 업데이트 (UI 표시용)
    setCountryList((prev) =>
      prev.map((c) =>
        c.id === selectedCountry
          ? { ...c, date: dateDisplayStr, selectedRange: { ...range } }
          : c,
      ),
    );

    const currentIndex = countryList.findIndex((c) => c.id === selectedCountry);
    if (currentIndex < countryList.length - 1) {
      const nextCountry = countryList[currentIndex + 1];
      setSelectedCountry(nextCountry.id);

      const nextRange = nextCountry.selectedRange.start
        ? { ...nextCountry.selectedRange }
        : { start: null, end: null };
      setRange(nextRange);
    } else {
      // 모든 국가 선택 완료 시 전체 시작/종료일 계산 및 저장
      const allStarts = updatedRegions
        .map((r) => r.start_date)
        .filter(Boolean)
        .sort();
      const allEnds = updatedRegions
        .map((r) => r.end_date)
        .filter(Boolean)
        .sort();

      if (allStarts.length > 0 && allEnds.length > 0) {
        const finalStart = allStarts[0];
        const finalEnd = allEnds[allEnds.length - 1];

        updateSurveyData({
          start_date: finalStart,
          end_date: finalEnd,
        });

        console.log('Final Survey Data before moving:', {
          ...surveyData,
          regions: updatedRegions,
          start_date: finalStart,
          end_date: finalEnd,
        });
      }

      alert('모든 나라의 일정을 선택하셨습니다!');
      navigate('/people-count');
    }
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const firstDayIndex = getFirstDayOfMonth(year, month);
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: CalendarDay[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: prevMonth,
      year: prevYear,
      type: 'prev',
    });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      type: 'current',
    });
  }

  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    calendarDays.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      type: 'next',
    });
  }

  const handleDateClick = (calendarDay: CalendarDay) => {
    if (calendarDay.type === 'prev' || calendarDay.type === 'next') {
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
        const diffTime = Math.abs(
          clickedDate.getTime() - range.start.getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 8) {
          alert('최대 8일까지만 선택 가능합니다!');
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

  const handleCountryChange = (id: string) => {
    setSelectedCountry(id);
    const existing = countryList.find((c) => c.id === id);
    if (existing?.selectedRange.start) {
      setRange({ ...existing.selectedRange });
    } else {
      setRange({ start: null, end: null });
    }
  };

  return {
    countryList,
    selectedCountry,
    range,
    currentDate,
    setCurrentDate,
    year,
    month,
    calendarDays,
    handleNext,
    handleDateClick,
    isSelected,
    getConfirmedCountry,
    handleCountryChange,
  };
};
