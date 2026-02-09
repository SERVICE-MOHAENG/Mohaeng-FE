import React from 'react';
import { Link } from 'react-router-dom';

interface CalendarFooterProps {
  onNext: () => void;
}

export const CalendarFooter: React.FC<CalendarFooterProps> = ({ onNext }) => {
  return (
    <footer className="fixed bottom-10 w-full px-20 flex justify-between pointer-events-none">
      <Link
        to="/create-trip"
        className="px-8 py-2 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 pointer-events-auto transition-colors"
      >
        이전
      </Link>
      <button
        onClick={onNext}
        className="px-8 py-2 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 pointer-events-auto transition-colors shadow-lg"
      >
        다음
      </button>
    </footer>
  );
};
