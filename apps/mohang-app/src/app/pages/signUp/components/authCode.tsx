import { useState } from 'react';
import { Input } from '@mohang/ui';

export function AuthCodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [authCodeError, setAuthCodeError] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="text"
        label="인증번호"
        placeholder="인증번호를 입력해주세요."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setAuthCodeError('');
        }}
        error={authCodeError}
        showPasswordToggle
        required
      />
    </div>
  );
}
