import { colors, typography } from '@mohang/ui';

interface Props {
  searches: string[];
  onRemove: (index: number) => void;
}

export function RecentSearchList({ searches, onRemove }: Props) {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full items-center justify-center gap-2 whitespace-nowrap">
        {searches.map((search, index) => {
          return (
            <div
              key={index}
              className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm"
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
                onClick={() => onRemove(index)}
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
