import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signUp/SignupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import MyPage from './pages/MyPage';
import TravelSelectionPage from './pages/TravelSelectionPage/index';
import CalendarPage from './pages/signUp/CalendarPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth/callback/google" element={<OAuthCallbackPage />} />
      <Route path="/oauth/callback/naver" element={<OAuthCallbackPage />} />
      <Route path="/oauth/callback/kakao" element={<OAuthCallbackPage />} />
      <Route path="/trip/:id" element={<TripDetailPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/create-trip" element={<TravelSelectionPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
