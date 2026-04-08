import { Input } from '@mohang/ui';

export function EmailInput({
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
  return (
    <div className="flex flex-col gap-6">
      <Input
        type="text"
        placeholder="example@email.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter?.();
          }
        }}
        error={error}
        required
      />
    </div>
  );
}
