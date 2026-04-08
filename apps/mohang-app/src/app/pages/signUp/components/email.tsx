import { useState } from 'react';
import { Input } from '@mohang/ui';

export function EmailInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
}) {
  const [emailError, setEmailError] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="text"
        placeholder="example@email.com"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setEmailError('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter?.();
          }
        }}
        error={emailError}
        showPasswordToggle
        required
      />
    </div>
  );
}
