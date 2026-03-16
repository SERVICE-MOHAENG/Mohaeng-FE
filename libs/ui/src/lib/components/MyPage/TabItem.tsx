export const TabItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2.5 text-sm font-bold transition-all ${
      active ? 'text-gray-800 border-b-2 border-[#00BFFF]' : 'text-gray-400'
    }`}
  >
    {label}
  </button>
);
