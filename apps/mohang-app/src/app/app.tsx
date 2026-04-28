import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken, getMainPageUser, UserResponse } from '@mohang/ui';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signUp/SignupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import MyPage from './pages/MyPage';
import TravelSelectionPage from './pages/TravelSelectionPage/index';
import CalendarPage from './pages/CalendarPage/index';
import PeopleCountPage from './pages/PeopleCountPage';
import CompanionPage from './pages/CompanionPage';
import TravelConceptPage from './pages/TravelConceptPage';
import TravelStylePage from './pages/TravelStylePage';
import TravelRequirementPage from './pages/TravelRequirementPage';
import PlanDetailPage from './pages/PlanDetailPage/index';
import SurveyPage from './pages/SurveyPage/index';
import DiscoverPage from './pages/DiscoverPage';
import LandingPage from './pages/LandingPage';
import FeedbackPage from './pages/FeedbackPage';
import BlogWritePage from './pages/BlogWritePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AuthGuard from './components/AuthGuard';
import { AlertProvider } from './context/AlertContext';

export function App() {
  const token = getAccessToken();
  const isAuthed = Boolean(token && token !== 'undefined');

  const { data: user } = useQuery<UserResponse | null>({
    queryKey: ['current-user', token],
    queryFn: getMainPageUser,
    enabled: isAuthed,
  });

  return (
    <AlertProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <HomePage initialUser={user ?? null} />
            </AuthGuard>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/callback/google" element={<OAuthCallbackPage />} />
        <Route path="/oauth/callback/naver" element={<OAuthCallbackPage />} />
        <Route path="/oauth/callback/kakao" element={<OAuthCallbackPage />} />
        <Route
          path="/trip/:id"
          element={
            <AuthGuard>
              <TripDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/mypage"
          element={
            <AuthGuard>
              <MyPage initialUser={user ?? null} />
            </AuthGuard>
          }
        />
        <Route
          path="/create-trip"
          element={
            <AuthGuard>
              <TravelSelectionPage />
            </AuthGuard>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthGuard>
              <CalendarPage />
            </AuthGuard>
          }
        />
        <Route
          path="/people-count"
          element={
            <AuthGuard>
              <PeopleCountPage />
            </AuthGuard>
          }
        />
        <Route
          path="/companion"
          element={
            <AuthGuard>
              <CompanionPage />
            </AuthGuard>
          }
        />
        <Route
          path="/travel-concept"
          element={
            <AuthGuard>
              <TravelConceptPage />
            </AuthGuard>
          }
        />
        <Route
          path="/travel-style"
          element={
            <AuthGuard>
              <TravelStylePage />
            </AuthGuard>
          }
        />
        <Route
          path="/travel-setup"
          element={<Navigate to="/travel-requirement" replace />}
        />
        <Route
          path="/travel-requirement"
          element={
            <AuthGuard>
              <TravelRequirementPage />
            </AuthGuard>
          }
        />
        <Route
          path="/plan-detail/:jobId"
          element={
            <AuthGuard>
              <PlanDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/survey"
          element={
            <AuthGuard>
              <SurveyPage />
            </AuthGuard>
          }
        />
        <Route
          path="/discover"
          element={
            <AuthGuard>
              <DiscoverPage />
            </AuthGuard>
          }
        />
        <Route
          path="/feedback"
          element={
            <AuthGuard>
              <FeedbackPage />
            </AuthGuard>
          }
        />
        <Route
          path="/blog-write"
          element={
            <AuthGuard>
              <BlogWritePage />
            </AuthGuard>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <AuthGuard>
              <BlogDetailPage />
            </AuthGuard>
          }
        />
      </Routes>
    </AlertProvider>
  );
}

export default App;
