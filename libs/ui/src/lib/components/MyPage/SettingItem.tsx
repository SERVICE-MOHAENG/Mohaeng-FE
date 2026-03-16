export const SettingItem = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left p-4 bg-[#F8F9FB] hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
  >
    {label}
  </button>
);
