import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Jost (SIL OFL 1.1) bundled locally via @fontsource — Latin subset, only the
// weights the design uses. See THIRD_PARTY_NOTICES.md.
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-600.css';
import '@fontsource/jost/latin-700.css';
import App from './App';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
