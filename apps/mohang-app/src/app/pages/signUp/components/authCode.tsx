import { useRef, useState } from 'react';
import { colors, typography } from '@mohang/ui';

export function AuthCodeInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
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
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
      return;
    }

    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH);

    if (!pastedValue) return;

    onChange(pastedValue);
    setAuthCodeError('');
    inputsRef.current[Math.min(pastedValue.length, LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
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
            onPaste={handlePaste}
            className="h-[56px] w-[56px] rounded-xl border text-center outline-none transition-colors sm:h-[64px] sm:w-[64px]"
            style={{
              ...typography.body.BodyB,
              borderColor: authCodeError ? colors.system[500] : colors.gray[200],
              backgroundColor: colors.gray[50],
              color: colors.gray[800],
            }}
          />
        ))}
      </div>

      {authCodeError && <p className="text-sm text-red-500">{authCodeError}</p>}
    </div>
  );
}
