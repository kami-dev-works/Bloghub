import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../stores/ThemeContext';
import { DataProvider } from '../stores/DataContext';
import { LanguageProvider } from '../stores/LanguageContext';
import App from '../App';

const Root = () => {
  return (
    <React.StrictMode>
      <HelmetProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <DataProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </DataProvider>
        </ThemeProvider>
      </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
};

if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Root />);
  }
}

export default Root;