import { useState } from 'react';

export interface CourseSectionProps {
  onCourseChange?: (course: string) => void;
}

export function CourseSection({ onCourseChange }: CourseSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState('일본');

  const countries = ['일본', '미국', '프랑스', '이탈리아', '스페인', '영국', '독일'];

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course);
    onCourseChange?.(course);
  };

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Paperozi' }}>사람들이 생성한 인기있는 여행 코스에요</h2>
      <div className="flex gap-3 flex-wrap">
        {countries.map((country) => (
          <button
            key={country}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all ${
              selectedCourse === country
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCourseClick(country)}
            style={{ fontFamily: 'Paperozi' }}
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CourseSection;
