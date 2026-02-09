export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Country {
  id: string;
  name: string;
  date: string;
  status: string;
  selectedRange: DateRange;
}

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  type: 'prev' | 'current' | 'next';
}
