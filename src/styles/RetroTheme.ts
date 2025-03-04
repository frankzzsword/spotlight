import { createGlobalStyle } from 'styled-components';

export const RetroTheme = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  :root {
    --primary-color: #FF6B6B;
    --secondary-color: #4ECDC4;
    --background-color: #2A2A2A;
    --text-color: #F7FFF7;
    --accent-color: #FFE66D;
    --error-color: #FF6B6B;
    --success-color: #6BFF89;
    --border-color: #FF00FF;
    --glow-color: rgba(255, 107, 107, 0.7);
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: var(--text-color);
    background-color: var(--background-color);
    background-image: 
      radial-gradient(circle at 20% 35%, rgba(255, 230, 109, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 65%, rgba(78, 205, 196, 0.15) 0%, transparent 50%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6, button, .sv-title {
    font-family: 'Press Start 2P', cursive !important;
    line-height: 1.5;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
  }

  /* Override SurveyJS styling for retro game theme */
  .sv-root-modern {
    --background: transparent !important;
    --background-dim: #1A1A1A !important;
    --primary: var(--primary-color) !important;
    --primary-light: #FF8A8A !important;
    --primary-foreground: #000 !important;
    --secondary: var(--secondary-color) !important;
    --foreground: var(--text-color) !important;
    --border: var(--border-color) !important;
  }

  .sv-container-modern {
    max-width: 1000px !important;
    margin: 0 auto !important;
  }

  .sv-body {
    border: 4px solid var(--border-color) !important;
    border-radius: 8px !important;
    box-shadow: 0 0 20px var(--glow-color) !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
    margin: 20px !important;
    padding: 20px !important;
  }

  .sv-title {
    font-size: 28px !important;
    color: var(--accent-color) !important;
    text-align: center !important;
    margin-bottom: 30px !important;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.8)) !important;
  }

  .sv-description {
    text-align: center !important;
    color: var(--accent-color) !important;
    margin-bottom: 20px !important;
  }

  .sv-btn {
    font-family: 'Press Start 2P', cursive !important;
    text-transform: uppercase !important;
    border: 3px solid var(--border-color) !important;
    background: var(--primary-color) !important;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.8) !important;
    color: #000 !important;
    transition: all 0.2s ease !important;
    padding: 10px 20px !important;
    margin: 5px !important;
  }

  .sv-btn:hover {
    transform: translate(-2px, -2px) !important;
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.8) !important;
  }

  .sv-btn:active {
    transform: translate(2px, 2px) !important;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8) !important;
  }

  .sv-panel {
    border: 2px dashed var(--border-color) !important;
    border-radius: 8px !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    margin-bottom: 20px !important;
    padding: 20px !important;
    transition: all 0.3s ease-in-out !important;
  }

  .sv-panel:hover {
    box-shadow: 0 0 10px var(--glow-color) !important;
    transform: scale(1.01) !important;
  }

  .sv-panel__title {
    font-family: 'Press Start 2P', cursive !important;
    color: var(--accent-color) !important;
    font-size: 16px !important;
    margin-bottom: 15px !important;
    line-height: 1.3 !important;
  }

  .sv-string-viewer {
    line-height: 1.5 !important;
  }

  .sv-question__title {
    font-size: 18px !important;
    color: var(--secondary-color) !important;
    margin-bottom: 10px !important;
  }

  .sv-comment {
    background-color: rgba(0, 0, 0, 0.5) !important;
    border: 2px solid var(--border-color) !important;
    color: var(--text-color) !important;
    font-family: 'VT323', monospace !important;
    font-size: 18px !important;
  }

  /* Rating styles */
  .sv-rating {
    justify-content: center !important;
  }

  .sv-rating__item {
    padding: 5px !important;
    transition: all 0.2s ease !important;
  }

  .sv-rating__item-text {
    font-family: 'Press Start 2P', cursive !important;
    font-size: 14px !important;
  }

  .sv-rating__min-text, .sv-rating__max-text {
    font-family: 'VT323', monospace !important;
    font-size: 16px !important;
    color: var(--accent-color) !important;
  }

  /* Animations */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    8%, 22%, 62% { opacity: 0.8; }
    31%, 47%, 73% { opacity: 0.95; }
    38%, 54% { opacity: 0.9; }
  }

  .survey-intro h2, .thank-you-page h2 {
    animation: flicker 5s infinite !important;
    color: var(--accent-color) !important;
    text-align: center !important;
    margin-bottom: 20px !important;
  }

  .sv-progress {
    height: 20px !important;
    border: 2px solid var(--border-color) !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    margin-bottom: 20px !important;
  }

  .sv-progress__bar {
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color)) !important;
    background-size: 200% 100% !important;
    animation: gradient-animation 3s ease infinite !important;
    height: 100% !important;
  }

  @keyframes gradient-animation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .game-over-animation {
    font-family: 'Press Start 2P', cursive !important;
    font-size: 36px !important;
    text-align: center !important;
    margin: 30px 0 !important;
    color: var(--primary-color) !important;
    animation: pulse 2s infinite !important;
    text-shadow: 
      0 0 5px var(--primary-color),
      0 0 10px var(--primary-color),
      0 0 15px var(--primary-color),
      0 0 20px var(--primary-color) !important;
  }

  /* Card styling */
  .card-container {
    perspective: 1000px;
    margin-bottom: 20px;
  }

  .card {
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .card-front, .card-back {
    width: 100%;
    min-height: 100px;
    backface-visibility: hidden;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .card-front {
    background: linear-gradient(135deg, var(--primary-color), #FF3366);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Press Start 2P', cursive;
    font-size: 14px;
    text-align: center;
  }

  .card-back {
    background: linear-gradient(135deg, var(--secondary-color), #2AA1CC);
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
  }

  /* For mobile devices */
  @media (max-width: 768px) {
    body {
      font-size: 16px;
    }

    .sv-title {
      font-size: 20px !important;
    }

    .sv-panel__title {
      font-size: 14px !important;
    }

    .sv-btn {
      padding: 8px 16px !important;
      font-size: 12px !important;
    }

    .game-over-animation {
      font-size: 24px !important;
    }
  }
`;

export default RetroTheme; 