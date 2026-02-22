import { useState } from 'react';
import { colors, typography } from '@mohang/ui';

export interface CourseSectionProps {
  onCourseChange?: (countryCode: string) => void;
}

export function CourseSection({ onCourseChange }: CourseSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState('JP');

  const countries = [
    { name: '일본', code: 'JP' },
    { name: '미국', code: 'US' },
    { name: '프랑스', code: 'FR' },
    { name: '이탈리아', code: 'IT' },
    { name: '스페인', code: 'ES' },
    { name: '영국', code: 'GB' },
    { name: '독일', code: 'DE' },
  ];

  const handleCourseClick = (code: string) => {
    setSelectedCourse(code);
    onCourseChange?.(code);
  };

  return (
    <div className="mt-12 mb-8">
      <div className="mb-6">
        <h2
          className="mb-3"
          style={{
            ...typography.title.TitleB,
            color: colors.gray[800],
          }}
        >
          사람들이 생성한 인기있는 <br />
          여행코스에요!
        </h2>
        <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
          실제 경험을 바탕으로 코스를 짰어요!
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {countries.map((country) => (
          <button
            key={country.code}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all ${
              selectedCourse === country.code
                ? 'bg-[#00CCFF] text-white hover:bg-[#00CCFF]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCourseClick(country.code)}
          >
            {country.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CourseSection;
