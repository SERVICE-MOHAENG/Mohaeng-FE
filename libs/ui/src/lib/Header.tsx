import { Link } from 'react-router-dom';
import LogoImage from '../assets/BI.svg';

export interface HeaderProps {
  notificationCount?: number;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
}

export function Header({ notificationCount = 0, isLoggedIn = true, onLoginClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={LogoImage} alt="모행 로고" className="h-8" />
          <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Paperozi' }}>모행</span>
        </Link>
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button className="p-2 hover:text-gray-800 text-gray-600 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="p-2 hover:text-gray-800 text-gray-600 transition-colors relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="21" r="1" fill="currentColor"/>
                  <circle cx="20" cy="21" r="1" fill="currentColor"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-[18px] h-[18px] text-xs flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>
              <Link to="/mypage" className="p-0">
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="16" fill="#4169E1"/>
                  <circle cx="16" cy="12" r="5" fill="white"/>
                  <path d="M7 27c0-5 4-9 9-9s9 4 9 9" fill="white"/>
                </svg>
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              onClick={onLoginClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
