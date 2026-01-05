import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth/callback/google" element={<OAuthCallbackPage />} />
      <Route path="/oauth/callback/naver" element={<OAuthCallbackPage />} />
      <Route path="/oauth/callback/kakao" element={<OAuthCallbackPage />} />
    </Routes>
  );
}

export default App;
