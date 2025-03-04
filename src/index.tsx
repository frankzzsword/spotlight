import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'survey-core/defaultV2.min.css';
import { NeobrutalistTheme } from './styles/NeobrutalistTheme';
import { createGlobalStyle } from 'styled-components';
import reportWebVitals from './reportWebVitals';

// Import SurveyJS styles
import 'survey-creator-core/survey-creator-core.min.css';

// Preload fonts function from existing file
function preloadFonts() {
  // Font preloading implementation
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
    'https://fonts.googleapis.com/css2?family=VT323&display=swap'
  ];
  
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'preload';
    link.as = 'style';
    document.head.appendChild(link);
    
    const linkStyle = document.createElement('link');
    linkStyle.href = url;
    linkStyle.rel = 'stylesheet';
    document.head.appendChild(linkStyle);
  });
}

// Preload the fonts
preloadFonts();

// Global styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pageExit {
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'VT323', monospace;
    background-color: #000000;
    color: #fff;
    min-height: 100vh;
    font-size: 20px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Press Start 2P', cursive;
  }

  .sv-page {
    animation: slideInUp 0.3s forwards;
    transition: all 0.3s ease-out;
  }

  .page-exit {
    animation: pageExit 0.3s forwards;
  }

  /* Add retro scanline effect */
  body::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg, 
      rgba(0, 0, 0, 0.1), 
      rgba(0, 0, 0, 0.1) 1px, 
      transparent 1px, 
      transparent 2px
    );
    pointer-events: none;
    z-index: 100;
    opacity: 0.3;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <NeobrutalistTheme />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
