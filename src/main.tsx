import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { UserProvider } from './contexts/user-context';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <UserProvider>
          <Suspense>
            <App />
          </Suspense>
        </UserProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
