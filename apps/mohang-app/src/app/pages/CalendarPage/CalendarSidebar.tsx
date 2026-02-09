import React from 'react';
import { typography, colors } from '@mohang/ui';
import { Country } from './types';

interface CalendarSidebarProps {
  countryList: Country[];
  selectedCountry: string;
  onCountryChange: (id: string) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  countryList,
  selectedCountry,
  onCountryChange,
}) => {
  return (
    <aside className="h-[50%] border-r relative px-20 flex flex-col">
      <h2 style={{ ...typography.title.sTitleB }}>나라 선택</h2>
      <div className="py-8 relative">
        <div className="absolute left-[9.5px] top-2 bottom-2 w-0 border-l border-dashed border-gray-300 -z-10" />

        {countryList.map((country, index) => {
          const isActive = selectedCountry === country.id;
          const isScheduled = !!country.selectedRange.start;

          const hasNextScheduled =
            index < countryList.length - 1 &&
            !!countryList[index + 1].selectedRange.start;
          const showColorLine = isScheduled && hasNextScheduled;

          return (
            <div
              key={country.id}
              className="relative flex items-center gap-4 mb-12"
            >
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
                  onChange={() => onCountryChange(country.id)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    color: isActive ? colors.black.black100 : colors.gray[400],
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
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-full" />
    </aside>
  );
};
