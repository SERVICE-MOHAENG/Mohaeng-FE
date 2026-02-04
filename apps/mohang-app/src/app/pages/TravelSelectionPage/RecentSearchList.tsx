import { colors, typography } from '@mohang/ui';

interface Props {
  searches: string[];
  onRemove: (index: number) => void;
}

export function RecentSearchList({ searches, onRemove }: Props) {
  const visible = searches.slice(-7);
  const startIndex = Math.max(0, searches.length - 7);

  return (
    <div className="flex justify-center gap-4 w-2/3">
      {visible.map((search, index) => {
        const realIndex = startIndex + index;
        return (
          <div
            key={index}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 shrink-0"
            style={{
              borderColor: colors.primary[500],
              ...typography.body.BodyB,
            }}
          >
            <p
              className="whitespace-nowrap"
              style={{ color: colors.primary[500] }}
            >
              {search}
            </p>
            <button
              onClick={() => onRemove(realIndex)}
              style={{ color: colors.primary[500] }}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
}
