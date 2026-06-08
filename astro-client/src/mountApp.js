import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './stores/ThemeContext';
import { DataProvider } from './stores/DataContext';
import { LanguageProvider } from './stores/LanguageContext';
import App from './App';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F8FAFC;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}

.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

html.dark {
  background-color: #0F0F1A;
  color-scheme: dark;
}
`;

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export function mountApp() {
  console.log('Mounting app...');
  addStyles();
  
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  console.log('Root element found:', rootElement);
  
  const root = createRoot(rootElement);
  
  try {
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(BrowserRouter, null,
          React.createElement(ThemeProvider, null,
            React.createElement(DataProvider, null,
              React.createElement(LanguageProvider, null,
                React.createElement(App, null)
              )
            )
          )
        )
      )
    );
    console.log('App mounted successfully!');
  } catch (error) {
    console.error('Error mounting app:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  mountApp();
});