interface Props {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder: string;
}

export function TravelSearchBar({
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  placeholder,
}: Props) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-[#d6eef8] bg-white pl-5 pr-20 text-[15px] text-gray-700 outline-none transition focus:border-[#00BFFF] focus:ring-4 focus:ring-cyan-50/70"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 flex h-9 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-400 text-white shadow-md transition-transform hover:bg-cyan-500 active:scale-90"
        onClick={onSearch}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}
