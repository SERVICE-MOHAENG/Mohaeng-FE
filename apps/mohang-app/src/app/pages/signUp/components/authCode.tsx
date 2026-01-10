import { useRef, useState } from 'react';

export function AuthCodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const LENGTH = 6;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [authCodeError, setAuthCodeError] = useState('');

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const nextValue = value.split('');
    nextValue[index] = char;
    onChange(nextValue.join(''));
    setAuthCodeError('');

    if (char && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        {Array.from({ length: LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] ?? ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`
              w-16 h-16
              rounded-lg
              bg-gray-100
              text-center
              text-lg
              font-semibold
              outline-none
              transition
              ${
                authCodeError
                  ? 'ring-2 ring-red-500'
                  : 'focus:ring-2 focus:ring-orange-500'
              }
            `}
          />
        ))}
      </div>

      {authCodeError && <p className="text-sm text-red-500">{authCodeError}</p>}
    </div>
  );
}
