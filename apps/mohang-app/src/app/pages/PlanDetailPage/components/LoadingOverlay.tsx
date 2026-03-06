interface LoadingOverlayProps {
  message?: string;
  description?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = '일정을 생성하고 있습니다',
  description = '잠시만 기다려주세요',
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-400 rounded-full animate-spin mb-4"></div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{message}</h2>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
