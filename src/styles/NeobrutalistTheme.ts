import { createGlobalStyle } from 'styled-components';

// A simplified theme focusing on high visibility of navigation elements
const NeobrutalistTheme = createGlobalStyle`
  body {
    background: #f0f0f0;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }

  /* Super visible button styles */
  .sv-btn {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background-color: #FFD700 !important; /* Bright gold */
    color: #000000 !important;
    border: 3px solid #000000 !important;
    border-radius: 8px !important;
    font-weight: bold !important;
    font-size: 18px !important;
    padding: 12px 24px !important;
    margin: 15px auto !important;
    box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.8) !important;
    cursor: pointer !important;
    transform: scale(1) !important;
    transition: transform 0.2s !important;
    text-transform: uppercase !important;
  }

  .sv-btn:hover {
    transform: scale(1.05) !important;
    background-color: #FFA500 !important; /* Orange on hover */
  }

  /* Make start button extra large and pulsing */
  .sv-btn.sv-start-btn {
    font-size: 24px !important;
    padding: 15px 30px !important;
    background-color: #32CD32 !important; /* Lime green */
    animation: pulse 1.5s infinite !important;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Make navigation buttons container visible */
  .sv-footer.sv-action-bar {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    justify-content: center !important;
    padding: 20px !important;
    margin-top: 20px !important;
    background-color: #e6e6e6 !important;
    border-top: 2px solid #000000 !important;
    position: relative !important;
  }

  /* Add an indicator text above buttons */
  .sv-footer.sv-action-bar::before {
    content: "CLICK BELOW TO CONTINUE" !important;
    display: block !important;
    text-align: center !important;
    width: 100% !important;
    position: absolute !important;
    top: -30px !important;
    left: 0 !important;
    font-weight: bold !important;
    color: #FF0000 !important;
    animation: blink 1s infinite !important;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  /* Make progress bar visible */
  .sv-progress {
    height: 20px !important;
    background-color: #e6e6e6 !important;
    border: 2px solid #000000 !important;
    margin-bottom: 20px !important;
  }

  .sv-progress__bar {
    background-color: #4CAF50 !important;
    height: 100% !important;
  }

  /* Survey container styles */
  .sv-root-modern {
    width: 100% !important;
    max-width: 800px !important;
    margin: 0 auto !important;
    background-color: #FFFFFF !important;
    padding: 20px !important;
    border: 3px solid #000000 !important;
    border-radius: 8px !important;
  }

  /* Question styles */
  .sv-question {
    background-color: #f9f9f9 !important;
    padding: 15px !important;
    border: 2px solid #000000 !important;
    margin-bottom: 20px !important;
  }

  /* Title styles */
  .sv-title {
    font-size: 24px !important;
    margin-bottom: 20px !important;
    text-align: center !important;
    color: #000000 !important;
  }

  /* Description styles */
  .sv-description {
    font-size: 18px !important;
    margin-bottom: 30px !important;
    text-align: center !important;
    color: #333333 !important;
  }
`;

export { NeobrutalistTheme }; 