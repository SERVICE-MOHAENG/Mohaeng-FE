import React, { useState, useRef } from 'react';

export const CarouselList = ({
  dataGroups,
  renderItem,
  listClassName = "bg-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50"
}: {
  dataGroups: any[][];
  renderItem: (item: any) => React.ReactNode;
  listClassName?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const newSlide = Math.round(scrollLeft / clientWidth);
      if (newSlide !== currentSlide) {
        setCurrentSlide(newSlide);
      }
    }
  };

  const scrollToSection = (index: number) => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
      >
        {dataGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="flex-none w-full snap-center space-y-4 p-1"
          >
            <div className={listClassName}>
              {group.map((item) => renderItem(item))}
            </div>
          </div>
        ))}
      </div>

      {dataGroups.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {dataGroups.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-4 bg-[#00BFFF]' : 'w-1 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
