import { useState } from 'react';
import { Calendar } from './Calendar';

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  companions: string[];
}

export interface CreateTripFormProps {
  onSubmit?: (data: TripFormData) => void;
  onCancel?: () => void;
}

const DESTINATIONS = [
  { value: '', label: '목적지를 선택하세요' },
  { value: '일본 도쿄', label: '🇯🇵 일본 도쿄' },
  { value: '일본 오사카', label: '🇯🇵 일본 오사카' },
  { value: '일본 후쿠오카', label: '🇯🇵 일본 후쿠오카' },
  { value: '태국 방콕', label: '🇹🇭 태국 방콕' },
  { value: '베트남 하노이', label: '🇻🇳 베트남 하노이' },
  { value: '베트남 다낭', label: '🇻🇳 베트남 다낭' },
  { value: '프랑스 파리', label: '🇫🇷 프랑스 파리' },
  { value: '영국 런던', label: '🇬🇧 영국 런던' },
  { value: '미국 뉴욕', label: '🇺🇸 미국 뉴욕' },
  { value: '미국 LA', label: '🇺🇸 미국 로스앤젤레스' },
];

export function CreateTripForm({ onSubmit, onCancel }: CreateTripFormProps) {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateObj, setStartDateObj] = useState<Date | undefined>();
  const [endDateObj, setEndDateObj] = useState<Date | undefined>();
  const [travelers, setTravelers] = useState(1);
  const [companionInput, setCompanionInput] = useState('');
  const [companions, setCompanions] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddCompanion = () => {
    if (companionInput.trim() && !companions.includes(companionInput.trim())) {
      setCompanions([...companions, companionInput.trim()]);
      setCompanionInput('');
    }
  };

  const handleRemoveCompanion = (companion: string) => {
    setCompanions(companions.filter(c => c !== companion));
  };

  const handleSubmit = () => {
    onSubmit?.({
      destination,
      startDate,
      endDate,
      travelers,
      companions,
    });
  };

  const canProceed = () => {
    if (step === 1) return destination.trim() !== '';
    if (step === 2) return startDate !== '' && endDate !== '';
    if (step === 3) return travelers > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold">뒤로가기</span>
        </button>

        {/* 진행 표시 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      s < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 text-sm text-gray-600 text-center">
            <span>목적지</span>
            <span>여행 일정</span>
            <span>인원 수</span>
            <span>동행자</span>
          </div>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Step 1: 목적지 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어디로 떠나시나요?
              </h2>
              <p className="text-gray-600 mb-8">여행 목적지를 선택해주세요</p>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xl px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors bg-white cursor-pointer"
                autoFocus
              >
                {DESTINATIONS.map((dest) => (
                  <option key={dest.value} value={dest.value}>
                    {dest.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2: 여행 일정 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                언제 떠나시나요?
              </h2>
              <p className="text-gray-600 mb-8">여행 시작일과 종료일을 선택해주세요</p>

              {/* 캘린더 좌우 배치 */}
              <div className="grid grid-cols-2 gap-6">
                <Calendar
                  selectedDate={startDateObj}
                  onSelectDate={(date) => {
                    // 이미 출발일과 도착일이 모두 선택되어 있으면 초기화하고 새로 시작
                    if (startDateObj && endDateObj) {
                      setStartDateObj(date);
                      setStartDate(date.toISOString().split('T')[0]);
                      setEndDateObj(undefined);
                      setEndDate('');
                    } else {
                      setStartDateObj(date);
                      setStartDate(date.toISOString().split('T')[0]);
                    }
                  }}
                  rangeStart={startDateObj}
                  rangeEnd={endDateObj}
                  monthOffset={0}
                />
                <Calendar
                  selectedDate={endDateObj}
                  onSelectDate={(date) => {
                    // 이미 출발일과 도착일이 모두 선택되어 있으면 초기화하고 새로 시작
                    if (startDateObj && endDateObj) {
                      setStartDateObj(date);
                      setStartDate(date.toISOString().split('T')[0]);
                      setEndDateObj(undefined);
                      setEndDate('');
                    } else {
                      setEndDateObj(date);
                      setEndDate(date.toISOString().split('T')[0]);
                    }
                  }}
                  rangeStart={startDateObj}
                  rangeEnd={endDateObj}
                  monthOffset={1}
                />
              </div>
            </div>
          )}

          {/* Step 3: 인원 수 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                몇 명이서 가시나요?
              </h2>
              <p className="text-gray-600 mb-8">총 여행 인원을 선택해주세요</p>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold transition-colors"
                >
                  -
                </button>
                <div className="text-5xl font-bold text-gray-900 w-32 text-center">
                  {travelers}
                </div>
                <button
                  onClick={() => setTravelers(travelers + 1)}
                  className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-2xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-center mt-4 text-gray-600">명</div>
            </div>
          )}

          {/* Step 4: 동행자 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                누구와 함께 가시나요?
              </h2>
              <p className="text-gray-600 mb-8">동행자를 추가해주세요 (선택사항)</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={companionInput}
                    onChange={(e) => setCompanionInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCompanion();
                      }
                    }}
                    placeholder="동행자 이름 입력"
                    className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                  />
                  <button
                    onClick={handleAddCompanion}
                    className="px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    추가
                  </button>
                </div>

                {companions.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      동행자 목록 ({companions.length}명)
                    </div>
                    {companions.map((companion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">{companion}</span>
                        <button
                          onClick={() => handleRemoveCompanion(companion)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                이전
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                여행 생성하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTripForm;
