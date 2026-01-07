import { useState } from 'react';
import { Input } from '@mohang/ui';

export function EmailInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [emailError, setEmailError] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="text"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setEmailError('');
        }}
        error={emailError}
        showPasswordToggle
        required
      />
    </div>
  );
}
