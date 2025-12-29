export interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 group"
      style={{ fontFamily: 'Paperozi' }}
    >
      <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
      <span className="font-bold text-base whitespace-nowrap">새 여행 일정 생성하기</span>
    </button>
  );
}

export default FloatingActionButton;
