import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '@mohang/ui';

interface CalendarFooterProps {
  onNext: () => void;
}

export const CalendarFooter: React.FC<CalendarFooterProps> = ({ onNext }) => {
  return (
    <footer className="fixed bottom-6 w-full px-10 flex justify-between pointer-events-none">
      <Link
        to="/create-trip"
        className="px-5 py-2 rounded-lg text-white font-bold text-lg transition-all active:scale-95 pointer-events-auto"
        style={{ backgroundColor: colors.gray[400] }}
      >
        이전
      </Link>
      <button
        onClick={onNext}
        className="px-5 font-bold rounded-lg text-white transition-all active:scale-95 pointer-events-auto"
        style={{ backgroundColor: colors.primary[500] }}
      >
        다음
      </button>
    </footer>
  );
};
