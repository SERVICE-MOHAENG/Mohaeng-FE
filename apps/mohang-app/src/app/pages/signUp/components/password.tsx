import { useState } from 'react';
import { Input } from '@mohang/ui';

export function PasswordInput({
  value,
  onChange,
  passwordConfirm,
  onChangePasswordConfirm,
}: {
  value: string;
  onChange: (value: string) => void;
  passwordConfirm: string;
  onChangePasswordConfirm: (value: string) => void;
}) {
  const [passwordError, setPasswordError] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPasswordError('');
        }}
        showPasswordToggle
        required
      />
      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요."
        value={passwordConfirm}
        onChange={(e) => {
          onChangePasswordConfirm(e.target.value);
          setPasswordError('');
        }}
        error={passwordError}
        showPasswordToggle
        required
      />
    </div>
  );
}
