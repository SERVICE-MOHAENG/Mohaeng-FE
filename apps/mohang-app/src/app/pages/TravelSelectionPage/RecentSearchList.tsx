import { colors, typography } from '@mohang/ui';

interface Props {
  searches: string[];
  onRemove: (index: number) => void;
}

export function RecentSearchList({ searches, onRemove }: Props) {
  const visible = searches.slice(-9);
  const startIndex = Math.max(0, searches.length - 9);

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 pb-1">
      <div className="flex flex-wrap justify-center gap-2">
        {visible.map((search, index) => {
          const realIndex = startIndex + index;
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm"
              style={{
                borderColor: colors.primary[500],
                backgroundColor: 'white',
                ...typography.body.BodyB,
              }}
            >
              <p
                className="whitespace-nowrap text-xs"
                style={{ color: colors.primary[500] }}
              >
                {search}
              </p>
              <button
                onClick={() => onRemove(realIndex)}
                className="hover:scale-125 transition-transform"
                style={{ color: colors.primary[500] }}
                type="button"
                aria-label={`최근 검색어 '${search}' 삭제`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
