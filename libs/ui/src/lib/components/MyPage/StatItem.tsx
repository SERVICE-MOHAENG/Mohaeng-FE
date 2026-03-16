export const StatItem = ({ label, value, color }: any) => (
  <div className="text-center flex-1">
    <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
    <div className="text-[11px] text-gray-500">{label}</div>
  </div>
);
