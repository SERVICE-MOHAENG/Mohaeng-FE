import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import TravelSetupPage from './pages/TravelSetupPage';
import TravelRequirementPage from './pages/TravelRequirementPage';
import PlanDetailPage from './pages/PlanDetailPage/index';
import SurveyPage from './pages/SurveyPage/index';
import AuthGuard from './components/AuthGuard';

export function App() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const initUser = async () => {
      const token = getAccessToken();
      const isAuthed = Boolean(token && token !== 'undefined');
      if (!isAuthed) return;

      try {
        const res = await getMainPageUser();
        // The API returns UserResponse or wrapped in { data: UserResponse }
        const userData = (res as any).data || res;
        setUser(userData);
      } catch (error) {
        console.error('getMainPageUser in App ERROR:', error);
      }
    };

    initUser();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard>
            <HomePage initialUser={user} onUserLoaded={setUser} />
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
            <MyPage initialUser={user} />
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
        element={
          <AuthGuard>
            <TravelSetupPage />
          </AuthGuard>
        }
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
      <Route path="/survey" element={<SurveyPage />} />
    </Routes>
  );
}

export default App;
