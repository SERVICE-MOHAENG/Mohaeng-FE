import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { SurveyProvider } from '@mohang/ui';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SurveyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SurveyProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
