import { colors, typography } from '@mohang/ui';

interface Props {
  searches: string[];
  onRemove: (index: number) => void;
}

export function RecentSearchList({ searches, onRemove }: Props) {
  const visible = searches.slice(-7);
  const startIndex = Math.max(0, searches.length - 7);

  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-2xl px-4 overflow-x-auto scrollbar-hide pb-2">
      <div className="flex gap-4 shrink-0 px-2">
        {visible.map((search, index) => {
          const realIndex = startIndex + index;
          return (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-full px-4 py-2 shrink-0 shadow-sm"
              style={{
                borderColor: colors.primary[500],
                backgroundColor: 'white',
                ...typography.body.BodyB,
              }}
            >
              <p
                className="whitespace-nowrap text-sm"
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
