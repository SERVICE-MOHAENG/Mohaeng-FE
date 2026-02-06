interface Props {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  placeholder: string;
}

export function TravelSearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
}: Props) {
  return (
    <div className="w-full px-10 relative mb-8">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-14 pl-3 pr-16 rounded-xl border-2 focus:ring-4 focus:ring-cyan-50/50 focus:bg-white outline-none text-base md:text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="absolute right-12 top-1/2 -translate-y-1/2 bg-cyan-400 w-14 h-8 rounded-full text-white flex items-center justify-center hover:bg-cyan-500 shadow-md transition-transform active:scale-90"
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
