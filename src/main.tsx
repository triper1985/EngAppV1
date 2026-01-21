import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// import { runContentChecks } from './content/dev/runChecks';

// if (__DEV__) {
//   runContentChecks();
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
