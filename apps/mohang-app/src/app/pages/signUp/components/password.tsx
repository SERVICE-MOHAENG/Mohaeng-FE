import { Input } from '@mohang/ui';

export function PasswordInput({
  value,
  onChange,
  passwordConfirm,
  onChangePasswordConfirm,
  onEnter,
  passwordError,
}: {
  value: string;
  onChange: (value: string) => void;
  passwordConfirm: string;
  onChangePasswordConfirm: (value: string) => void;
  onEnter?: () => void;
  passwordError?: string;
}) {
  const passwordMismatchError =
    value && passwordConfirm && value !== passwordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : '';

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter?.();
          }
        }}
        error={passwordError}
        showPasswordToggle
        required
      />
      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요."
        value={passwordConfirm}
        onChange={(e) => onChangePasswordConfirm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter?.();
          }
        }}
        error={passwordMismatchError}
        showPasswordToggle
        required
      />
    </div>
  );
}
