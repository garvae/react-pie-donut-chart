import { createTheme, MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import './index.css';
import App from './App.tsx';

const theme = createTheme({
  fontFamily: '"Space Grotesk", system-ui, sans-serif',
  headings: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif'
  },
  primaryColor: 'cyan',
  defaultRadius: 'xl'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </StrictMode>
);
