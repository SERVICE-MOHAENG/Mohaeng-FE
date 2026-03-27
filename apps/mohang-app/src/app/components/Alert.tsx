import React, { useEffect, useState } from 'react';

interface AlertProps {
  isOpen: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ isOpen, message, type, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bg: 'bg-green-500',
          lightBg: 'bg-green-50',
          text: 'text-green-600',
        };
      case 'error':
        return {
          icon: '✕',
          bg: 'bg-red-500',
          lightBg: 'bg-red-50',
          text: 'text-red-600',
        };
      case 'warning':
        return {
          icon: '!',
          bg: 'bg-yellow-500',
          lightBg: 'bg-yellow-50',
          text: 'text-yellow-700',
        };
      default:
        return {
          icon: 'ℹ',
          bg: 'bg-sky-400',
          lightBg: 'bg-sky-50',
          text: 'text-sky-600',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Alert Card */}
      <div
        className={`relative w-full max-w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all transform ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
        }`}
      >
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div
            className={`w-16 h-16 ${styles.lightBg} rounded-full flex items-center justify-center mb-6`}
          >
            <div
              className={`w-12 h-12 ${styles.bg} rounded-full flex items-center justify-center text-white text-2xl font-black shadow-sm`}
            >
              {styles.icon}
            </div>
          </div>

          {/* <h3 className="text-xl font-black text-gray-800 mb-3">
            {type === 'success'
              ? '성공'
              : type === 'error'
                ? '오류'
                : type === 'warning'
                  ? '알림'
                  : '안내'}
          </h3> */}

          <p className="text-gray-500 text-[15px] font-medium leading-relaxed break-keep">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-8 w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
