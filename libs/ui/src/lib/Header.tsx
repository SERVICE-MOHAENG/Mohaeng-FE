import { Link } from 'react-router-dom';
import LogoImage from '../assets/BI.svg';
import MohangLogo from '../assets/MoHaeng.svg';
import UserImg from '../assets/userImg.svg';
import { colors, typography } from '@mohang/ui';

export interface HeaderProps {
  notificationCount?: number;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
}

export function Header({
  notificationCount = 0,
  isLoggedIn = false,
  onLoginClick,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center justify-center gap-4">
          <img src={LogoImage} alt="모행 로고" className="h-8" />
          <img src={MohangLogo} alt="모행 로고" className="h-6" />
        </Link>
        <nav className="flex items-center justify-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/mypage"
                style={{ ...typography.body.BodyM, color: colors.gray[300] }}
              >
                마이페이지
              </Link>
              <img src={UserImg} alt="유저 이미지" className="h-6" />
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                style={{ ...typography.body.BodyM, color: colors.gray[300] }}
              >
                로그인
              </Link>
              <p style={{ ...typography.body.BodyM, color: colors.gray[300] }}>
                |
              </p>
              <Link
                to="/signup"
                style={{ ...typography.body.BodyM, color: colors.gray[300] }}
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
