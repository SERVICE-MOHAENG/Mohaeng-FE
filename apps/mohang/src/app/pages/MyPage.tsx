import { MyPage as MyPageComponent } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';

export function MyPage() {
  const navigate = useNavigate();

  // TODO: 실제로는 API에서 사용자 정보를 가져와야 함
  const mockUser = {
    name: '김풍풍',
    email: 'kimpoong@example.com',
    memberSince: '2024.01.15',
    totalTrips: 8,
    totalCountries: 14,
    upcomingTrips: 3,
    favoritePlaces: 12,
  };

  const handleLogout = () => {
    console.log('로그아웃');
    // TODO: 로그아웃 처리
    navigate('/login');
  };

  const handleEditProfile = () => {
    console.log('프로필 수정');
    // TODO: 프로필 수정 모달 또는 페이지로 이동
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('정말로 회원탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      console.log('회원탈퇴');
      // TODO: 회원탈퇴 API 호출
      navigate('/');
    }
  };

  return (
    <MyPageComponent
      user={mockUser}
      onLogout={handleLogout}
      onEditProfile={handleEditProfile}
      onDeleteAccount={handleDeleteAccount}
    />
  );
}

export default MyPage;
