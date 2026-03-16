export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-50">
    <svg
      className="w-16 h-16 text-gray-300 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);
