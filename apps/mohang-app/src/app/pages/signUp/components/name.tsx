import { Input } from '@mohang/ui';

export function NameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="text"
        placeholder="ex. 홍길동"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
