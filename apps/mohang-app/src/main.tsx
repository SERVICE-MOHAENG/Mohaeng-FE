import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { SurveyProvider } from '@mohang/ui';
import { queryClient } from './app/queryClient';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <SurveyProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SurveyProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
