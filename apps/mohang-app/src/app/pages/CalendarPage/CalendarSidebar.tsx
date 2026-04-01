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
    <aside className="relative flex flex-col justify-center h-full flex-1 flex-col border-r px-12 pt-10">
      <div className="relative h-2/3">
        <h2 className="mb-10 shrink-0" style={{ ...typography.title.sTitleB }}>
          도시 선택
        </h2>

        <div className="relative h-[calc(100%-56px)] overflow-y-auto pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative py-2">
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
                className="relative mb-12 flex items-center gap-4"
              >
                {showColorLine && (
                  <div className="absolute left-[9.5px] top-5 h-12 w-0 border-l-2 border-cyan-400 -z-5" />
                )}

                <div className="relative flex h-5 w-5 items-center justify-center bg-white">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                      isActive || isScheduled
                        ? 'border-cyan-400'
                        : 'border-gray-200'
                    }`}
                  >
                    {(isActive || isScheduled) && (
                      <div className="h-3 w-3 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="country"
                    checked={isActive}
                    onChange={() => onCountryChange(country.id)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>

                <div className="flex min-w-0 items-baseline gap-2 whitespace-nowrap">
                  <span
                    className="whitespace-nowrap"
                    style={{
                      color: isActive ? colors.black.black100 : colors.gray[400],
                      ...typography.title.sTitleB,
                    }}
                  >
                    {country.name}
                  </span>
                  <span
                    className="whitespace-nowrap text-xs"
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
        </div>
      </div>

      <div className="absolute right-0 top-1/2 h-2/3 w-1 -translate-y-1/2 rounded-l-full bg-cyan-400" />
    </aside>
  );
};
