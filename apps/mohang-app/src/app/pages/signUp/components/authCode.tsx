import { useRef } from 'react';
import { colors, typography } from '@mohang/ui';

export function AuthCodeInput({
  value,
  onChange,
  onEnter,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  error?: string;
}) {
  const length = 6;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const nextValue = value.split('');
    nextValue[index] = char;
    onChange(nextValue.join(''));

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter?.();
      return;
    }

    if (event.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);

    if (!pastedValue) return;

    onChange(pastedValue);
    inputsRef.current[Math.min(pastedValue.length, length - 1)]?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] ?? ''}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className="h-[56px] w-[56px] rounded-xl border text-center outline-none transition-colors sm:h-[64px] sm:w-[64px]"
            style={{
              ...typography.body.BodyB,
              borderColor: error ? colors.system[500] : colors.gray[200],
              backgroundColor: colors.gray[50],
              color: colors.gray[800],
            }}
          />
        ))}
      </div>

      {error && (
        <p
          style={{
            ...typography.label.labelM,
            color: colors.system[500],
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
