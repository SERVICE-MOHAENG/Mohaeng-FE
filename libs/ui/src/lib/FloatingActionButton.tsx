import { typography } from '@mohang/ui';

export interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-6 bg-[#00CCFF] hover:bg-[#0099FF] text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 group"
    >
      <span
        className="group-hover:rotate-90 transition-transform duration-300"
        style={{
          ...typography.body.BodyM,
        }}
      >
        +
      </span>
      <span
        className="whitespace-nowrap"
        style={{
          ...typography.body.BodyM,
        }}
      >
        새 여행 일정 생성하기
      </span>
    </button>
  );
}

export default FloatingActionButton;
