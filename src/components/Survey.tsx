import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import 'survey-core/survey.min.css';
import { createSurveyModel } from '../data/surveyModel';
import styled from 'styled-components';

// Add a global debug logger
const DEBUG = true;
const log = (message: string, data?: any) => {
  if (DEBUG) {
    if (data) {
      console.log(`%c[SurveyDebug] ${message}`, 'background: #ffde59; color: #000; padding: 2px 4px; border-radius: 2px;', data);
    } else {
      console.log(`%c[SurveyDebug] ${message}`, 'background: #ffde59; color: #000; padding: 2px 4px; border-radius: 2px;');
    }
  }
};

// Define the interface for window to include webkitAudioContext
interface ExtendedWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const extendedWindow = window as ExtendedWindow;

const SurveyContainer = styled.div`
  position: relative;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 70vh; /* Ensure container takes up space */
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
`;

const RetroTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 28px;
  color: #FFE66D;
  text-shadow: 
    3px 3px 0 #FF6B6B,
    -1px -1px 0 #4ECDC4,
    1px -1px 0 #4ECDC4,
    -1px 1px 0 #4ECDC4,
    1px 1px 0 #4ECDC4;
  margin: 0;
  padding: 20px 0;
  letter-spacing: -1px;
  animation: flicker 5s infinite;
`;

const GameStartText = styled.div`
  font-family: 'Press Start 2P', cursive;
  font-size: 16px;
  color: #FF6B6B;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
  margin: 10px 0;
  animation: blink 1.5s infinite;
`;

const AudioControls = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const AudioButton = styled.button`
  background-color: #000000;
  border: 3px solid #000000;
  color: #FFDE59;
  border-radius: 0;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0 #000000;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000000;
  }
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000000;
  }
`;

// Custom navigation buttons
const CustomNavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-top: 5px solid #FFDE59;
  border-bottom: 5px solid #FFDE59;
  z-index: 9999;
  position: relative;
  width: 100%;
  bottom: 0;
  left: 0;
`;

const CustomButton = styled.button`
  display: block;
  width: 250px;
  padding: 15px 30px;
  margin: 15px auto;
  background-color: #FFDE59;
  color: #000000;
  border: 4px solid #000000;
  font-family: 'Press Start 2P', cursive;
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 30px #FFDE59;
  position: relative;
  z-index: 9999;
  animation: buttonPulse 2s infinite;

  @keyframes buttonPulse {
    0% { transform: scale(1.0); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1.0); }
  }

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 6px 6px 0 #000000, 0 0 30px #FFDE59;
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 2px 2px 0 #000000, 0 0 15px #FFDE59;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255, 255, 255, 0.5);
    transform: rotate(30deg);
    transition: all 0.6s ease;
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { left: -60%; }
    100% { left: 120%; }
  }
`;

const NavigationLabel = styled.div`
  color: #FFDE59;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  text-shadow: 0 0 10px #FFDE59;
  animation: blink 1s infinite;

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

// Audio context and sounds
const createAudioContext = () => {
  // Create an audio context only after user interaction
  if (!window.AudioContext && !extendedWindow.webkitAudioContext) {
    console.warn('AudioContext not supported in this browser');
    return null;
  }
  
  const AudioContextClass = window.AudioContext || extendedWindow.webkitAudioContext;
  return new AudioContextClass();
};

// Main Survey Component
const SurveyComponent = () => {
  const [survey, setSurvey] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const surveyContainerRef = useRef<HTMLDivElement>(null);
  const navigationLock = useRef<boolean>(false);
  const lastNavigationTime = useRef<number>(Date.now());
  const pageHistory = useRef<number[]>([]);
  const surveyRef = useRef<Model | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  
  // Log component state changes
  useEffect(() => {
    log(`Component state updated: 
    - isLoading: ${isLoading}
    - isCompleted: ${isCompleted}
    - currentPage: ${currentPage}
    - isTransitioning: ${isTransitioning}
    - navigationLock: ${navigationLock.current}
    - isStarted: ${isStarted}
    - pageHistory: ${JSON.stringify(pageHistory.current)}`);
  }, [isLoading, isCompleted, currentPage, isTransitioning, isStarted]);
  
  // Function to play sounds safely
  const playSound = useCallback((soundUrl: string, volume: number = 0.3) => {
    if (!audioEnabled || !audioContext) return;
    
    // Only attempt to play if audio is enabled and context is in a valid state
    if (audioContext.state === 'running') {
      try {
        fetch(soundUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
          })
          .then(arrayBuffer => {
            // Check if the context is still valid before decoding
            if (audioContext.state !== 'closed') {
              return audioContext.decodeAudioData(arrayBuffer);
            } else {
              throw new Error('AudioContext is closed');
            }
          })
          .then(audioBuffer => {
            // Double check context is still valid before creating source
            if (audioContext.state !== 'closed') {
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              
              // Create a gain node to control volume
              const gainNode = audioContext.createGain();
              gainNode.gain.value = volume;
              
              // Connect the source to the gain node and the gain node to the destination
              source.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Play the sound
              source.start(0);
            }
          })
          .catch(error => {
            console.error('Error playing sound:', error);
          });
      } catch (error) {
        console.error('Error setting up sound playback:', error);
      }
    } else if (audioContext.state === 'suspended') {
      // If context is suspended, try to resume it
      audioContext.resume().then(() => {
        // Try again after resuming
        setTimeout(() => playSound(soundUrl, volume), 100);
      }).catch(error => {
        console.error('Error resuming AudioContext:', error);
      });
    }
  }, [audioContext, audioEnabled]);
  
  // Custom navigation functions
  const handleStartSurvey = useCallback(() => {
    if (!survey || navigationLock.current) return;
    
    log('Start survey button clicked');
    navigationLock.current = true;
    
    try {
      // Start the survey - this moves from the intro page to the first question
      survey.start();
      setIsStarted(true);
      log('Survey started');
      
      // Update page tracking
      setCurrentPage(survey.currentPageNo);
      pageHistory.current.push(survey.currentPageNo);
      
      // Play sound
      playSound('/page-change.mp3', 0.4);
      
      // Force page change if not changed automatically
      if (survey.state === "starting") {
        log('Survey still in starting state after start() call, forcing next page');
        setTimeout(() => {
          survey.nextPage();
        }, 100);
      }
    } catch (err) {
      log('Error starting survey', err);
    }
    
    setTimeout(() => {
      navigationLock.current = false;
      log('Navigation lock released after start');
    }, 1000);
  }, [survey, playSound]);
  
  const handleNextPage = useCallback(() => {
    if (!survey || navigationLock.current) return;
    
    log('Next page button clicked');
    navigationLock.current = true;
    
    try {
      // Try to navigate to next page
      const success = survey.nextPage();
      log(`Next page navigation success: ${success}, new page: ${survey.currentPageNo}`);
      
      if (success) {
        // Update page tracking
        setCurrentPage(survey.currentPageNo);
        pageHistory.current.push(survey.currentPageNo);
        
        // Play sound
        playSound('/page-change.mp3', 0.4);
      }
    } catch (err) {
      log('Error navigating to next page', err);
    }
    
    setTimeout(() => {
      navigationLock.current = false;
    }, 1000);
  }, [survey, playSound]);
  
  const handlePrevPage = useCallback(() => {
    if (!survey || navigationLock.current) return;
    
    log('Previous page button clicked');
    navigationLock.current = true;
    
    try {
      // Try to navigate to previous page
      const success = survey.prevPage();
      log(`Previous page navigation success: ${success}, new page: ${survey.currentPageNo}`);
      
      if (success) {
        // Update page tracking
        setCurrentPage(survey.currentPageNo);
        pageHistory.current.push(survey.currentPageNo);
        
        // Play sound
        playSound('/page-change.mp3', 0.4);
      }
    } catch (err) {
      log('Error navigating to previous page', err);
    }
    
    setTimeout(() => {
      navigationLock.current = false;
    }, 1000);
  }, [survey, playSound]);
  
  const handleCompleteSurvey = useCallback(() => {
    if (!survey || navigationLock.current) return;
    
    log('Complete survey button clicked');
    navigationLock.current = true;
    
    try {
      // Try to complete the survey
      const success = survey.completeLastPage();
      log(`Survey completion success: ${success}`);
      
      if (!success) {
        // If there are validation errors, try to complete anyway
        survey.doComplete();
        log('Forced survey completion');
      }
      
      // Play completion sound
      playSound('/completion-sound.mp3', 0.5);
    } catch (err) {
      log('Error completing survey', err);
    }
    
    setTimeout(() => {
      navigationLock.current = false;
    }, 1000);
  }, [survey, playSound]);
  
  // Handle enabling audio (to be called after user interaction)
  const enableAudio = useCallback(() => {
    try {
      if (!audioContext) {
        const newAudioContext = createAudioContext();
        if (newAudioContext) {
          setAudioContext(newAudioContext);
          setAudioEnabled(true);
          
          // Play a sound to confirm audio is working
          setTimeout(() => {
            // Use a local reference to make sure we have the right context
            if (newAudioContext.state !== 'closed') {
              playSound('/start-sound.mp3', 0.2);
            }
          }, 300);
        } else {
          console.warn('Could not create AudioContext');
        }
      } else if (audioContext.state === 'suspended') {
        audioContext.resume()
          .then(() => {
            setAudioEnabled(true);
            // Play a sound to confirm audio is working
            setTimeout(() => {
              playSound('/start-sound.mp3', 0.2);
            }, 300);
          })
          .catch(error => {
            console.error('Error resuming AudioContext:', error);
          });
      } else if (audioContext.state === 'running') {
        // Already running, just enable
        setAudioEnabled(true);
      }
    } catch (error) {
      console.error('Error enabling audio:', error);
    }
  }, [audioContext, playSound]);
  
  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (!audioEnabled) {
      enableAudio();
    } else {
      setAudioEnabled(false);
      if (audioContext && audioContext.state === 'running') {
        audioContext.suspend();
      }
    }
  }, [audioEnabled, audioContext, enableAudio]);

  // Handle page transitions with animations
  const handlePageTransition = useCallback(() => {
    log(`Page transition started, isTransitioning: ${isTransitioning}`);
    if (surveyContainerRef.current && !isTransitioning) {
      setIsTransitioning(true);
      
      // Start exit animation
      if (surveyContainerRef.current.querySelector('.sv-page')) {
        const currentPageElement = surveyContainerRef.current.querySelector('.sv-page');
        if (currentPageElement) {
          currentPageElement.classList.add('page-exit');
          log('Added page-exit class to current page element');
          
          // Play sound
          playSound('/page-change.mp3', 0.4);
        } else {
          log('WARNING: No .sv-page element found to animate');
        }
      }
      
      // Wait for exit animation to complete
      setTimeout(() => {
        log('Animation timeout complete, setting isTransitioning to false');
        setIsTransitioning(false);
      }, 300);
    } else {
      log(`Page transition BLOCKED - container exists: ${!!surveyContainerRef.current}, isTransitioning: ${isTransitioning}`);
    }
  }, [isTransitioning, playSound]);

  // Create audio context safely
  const createAudioContext = useCallback(() => {
    log('Creating audio context');
    try {
      // Try to create AudioContext using standard API
      if (typeof AudioContext !== 'undefined') {
        return new AudioContext();
      } 
      // Fallback to webkitAudioContext for Safari
      else if (typeof extendedWindow.webkitAudioContext !== 'undefined') {
        return new extendedWindow.webkitAudioContext();
      } else {
        console.warn('AudioContext not supported');
        return null;
      }
    } catch (error) {
      console.error('Error creating AudioContext:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    log('Creating and configuring survey model');
    // Create a new survey model
    const model = createSurveyModel();
    log('Survey model created');
    
    // Store in ref for direct access
    surveyRef.current = model;
    
    // Explicitly set configuration to hide SurveyJS navigation buttons
    // since we'll use our custom ones
    model.showNavigationButtons = "none";
    model.showCompletedPage = false;
    model.firstPageIsStarted = true;
    model.showProgressBar = "top";
    model.focusFirstQuestionAutomatic = false;
    model.focusOnFirstError = false;
    
    // Log survey model details
    log(`Survey model configured:
    - Pages: ${model.pages.length}
    - Current page: ${model.currentPageNo}
    - First page is started: ${model.firstPageIsStarted}
    - Show navigation buttons: ${model.showNavigationButtons}
    - goNextPageAutomatic: ${model.goNextPageAutomatic}`);
    
    // Track current page for navigation protection
    setCurrentPage(model.currentPageNo);
    pageHistory.current.push(model.currentPageNo);
    
    // Set up event handlers for the survey

    // When survey completes (all questions answered)
    model.onComplete.add((sender) => {
      log('Survey completed');
      setIsCompleted(true);
      
      // Save results to local storage for persistence
      try {
        localStorage.setItem('surveyResults', JSON.stringify(sender.data));
        log('Survey results saved to localStorage');
      } catch (error) {
        console.error('Error saving survey results:', error);
      }
      
      // Play completion sound
      playSound('/completion-sound.mp3', 0.5);
    });

    // Handle page changes
    model.onCurrentPageChanging.add((sender, options) => {
      const now = Date.now();
      const timeSinceLastNav = now - lastNavigationTime.current;
      
      log(`Page changing event fired:
      - From page: ${sender.currentPageNo}
      - To page: ${options.newCurrentPage.visibleIndex}
      - Navigation locked: ${navigationLock.current}
      - Time since last nav: ${timeSinceLastNav}ms
      - isTransitioning: ${isTransitioning}`);
      
      // Check if navigation is allowed
      if (navigationLock.current || isTransitioning) {
        log('Navigation blocked due to lock or transition');
        options.allowChanging = false;
        return;
      }
      
      // Update navigation timing
      lastNavigationTime.current = now;
      
      // Trigger animation before page change
      handlePageTransition();
      
      // Update current page after a delay to allow animation
      setTimeout(() => {
        setCurrentPage(sender.currentPageNo);
        pageHistory.current.push(sender.currentPageNo);
        log(`Page changed to: ${sender.currentPageNo}, history: ${JSON.stringify(pageHistory.current)}`);
      }, 400);
    });

    // After each question is rendered, check button visibility
    model.onAfterRenderQuestion.add((sender, options) => {
      log(`Question rendered: ${options.question.name}`);
      
      // Check if buttons are visible after rendering
      setTimeout(() => {
        const buttons = document.querySelectorAll('button');
        log(`Button visibility check:
        - Next button: ${!!document.querySelector('.sv-btn.sv-next-btn')}
        - Prev button: ${!!document.querySelector('.sv-btn.sv-prev-btn')}
        - Complete button: ${!!document.querySelector('.sv-btn.sv-complete-btn')}
        - Start button: ${!!document.querySelector('.sv-btn.sv-start-btn')}`);
        
        log(`Navigation container: ${!!document.querySelector('.sv-footer.sv-action-bar')}`);
        
        log(`Total buttons in DOM: ${buttons.length}`);
        buttons.forEach((button, i) => {
          log(`Button ${i}: ${button.textContent} - class: ${button.className}`);
        });
        
        // Enable audio if buttons are clicked
        buttons.forEach(button => {
          button.addEventListener('click', enableAudio);
        });
      }, 500);
    });

    // Monitor page change events
    model.onCurrentPageChanged.add((sender) => {
      log(`Page actually changed to: ${sender.currentPageNo}`);
      if (sender.currentPageNo > 0) {
        setIsStarted(true);
      }
    });

    // Set the survey
    setSurvey(model);
    
    // Set the loading state after a delay to allow rendering
    setTimeout(() => {
      setIsLoading(false);
      log('Loading complete');
    }, 800);
    
    // Clean up function
    return () => {
      log('Survey component unmounting');
      if (model) {
        // Remove event handlers
        model.onComplete.clear();
        model.onCurrentPageChanging.clear();
        model.onAfterRenderQuestion.clear();
        model.onCurrentPageChanged.clear();
      }
      
      // Clean up audio context
      if (audioContext) {
        audioContext.close().catch(err => {
          console.error('Error closing AudioContext:', err);
        });
      }
    };
  }, [enableAudio, handlePageTransition, playSound, isTransitioning, audioContext]);

  // Debug button to log survey state
  const debugLog = useCallback(() => {
    if (!surveyRef.current) return;
    
    log(`Debug log:
    - Current page: ${surveyRef.current.currentPageNo}
    - Page count: ${surveyRef.current.pageCount}
    - Is on first page: ${surveyRef.current.isFirstPage}
    - Is on last page: ${surveyRef.current.isLastPage}
    - Current page has errors: ${surveyRef.current.currentPage?.hasErrors()}
    - State: ${surveyRef.current.state}
    - isStarted: ${isStarted}
    - Page history: ${JSON.stringify(pageHistory.current)}`);
    
    // Log all elements in the survey container
    if (surveyContainerRef.current) {
      const elements = surveyContainerRef.current.querySelectorAll('*');
      log(`Total elements in survey container: ${elements.length}`);
      
      // Log all navigation elements
      const navElements = surveyContainerRef.current.querySelectorAll('.sv-footer, .sv-action-bar, .sv-btn');
      log(`Navigation elements: ${navElements.length}`);
      navElements.forEach((el, i) => {
        log(`Nav element ${i}: ${(el as HTMLElement).tagName} - class: ${(el as HTMLElement).className} - visible: ${(el as HTMLElement).offsetParent !== null}`);
      });
    }
  }, [isStarted]);
  
  // Create debug overlay to visualize state
  const DebugOverlay = () => {
    if (!DEBUG) return null;
    
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FFDE59',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 10000,
        fontSize: '12px',
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <h4 style={{ margin: '0 0 5px 0' }}>Debug Info</h4>
        <p style={{ margin: '0 0 3px 0' }}>Page: {currentPage}</p>
        <p style={{ margin: '0 0 3px 0' }}>Nav Lock: {navigationLock.current ? 'Yes' : 'No'}</p>
        <p style={{ margin: '0 0 3px 0' }}>History: {pageHistory.current.join(' → ')}</p>
        <p style={{ margin: '0 0 3px 0' }}>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p style={{ margin: '0 0 3px 0' }}>Transitioning: {isTransitioning ? 'Yes' : 'No'}</p>
        <p style={{ margin: '0 0 3px 0' }}>Started: {isStarted ? 'Yes' : 'No'}</p>
        <button onClick={debugLog} style={{ marginTop: '5px' }}>Log</button>
      </div>
    );
  };

  // Render the survey
  return (
    <SurveyContainer ref={surveyContainerRef}>
      {/* Audio Toggle Button */}
      <button 
        onClick={toggleAudio} 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: audioEnabled ? '#4CAF50' : '#f44336',
          color: 'white',
          border: '2px solid black',
          borderRadius: '4px',
          fontSize: '16px',
          zIndex: 9999,
          boxShadow: '3px 3px 0 #000000'
        }}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>
      
      {/* Loading State */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#FFDE59',
          fontSize: '24px',
          fontFamily: "'Press Start 2P', cursive",
          textShadow: '0 0 10px #FFDE59, 0 0 20px #FFDE59'
        }}>
          <div>Loading Game...</div>
          <div style={{ 
            marginTop: '20px', 
            width: '200px', 
            height: '20px', 
            border: '3px solid #FFDE59',
            position: 'relative',
            overflow: 'hidden',
            animation: 'loadingPulse 1.5s infinite alternate'
          }}>
            <div style={{
              position: 'absolute',
              backgroundColor: '#FFDE59',
              height: '100%',
              width: '60%',
              animation: 'loadingBar 2s infinite ease-in-out'
            }}></div>
          </div>
        </div>
      )}
      
      {/* Main Survey Component */}
      {!isLoading && survey && (
        <div style={{ width: '100%', minHeight: '50vh' }}>
          <Survey model={survey} />
          
          {/* Custom Navigation Buttons that are always visible and styled correctly */}
          <CustomNavigationContainer>
            <NavigationLabel>
              {!isStarted ? "Click to start the game!" : "Click button below to continue"}
            </NavigationLabel>
            
            {/* Ensure each button type is displayed based on survey state */}
            {(!isStarted || (survey.state === "starting")) && (
              <CustomButton onClick={handleStartSurvey}>
                Start Game!
              </CustomButton>
            )}
            
            {/* Show Next button in all active survey states to ensure it's always available */}
            {isStarted && (survey.state !== "completed") && !survey.isLastPage && (
              <CustomButton onClick={handleNextPage}>
                Next Card
              </CustomButton>
            )}
            
            {isStarted && (survey.state !== "completed") && survey.isLastPage && (
              <CustomButton onClick={handleCompleteSurvey}>
                Finish Game
              </CustomButton>
            )}
            
            {isStarted && (survey.state !== "completed") && !survey.isFirstPage && currentPage > 0 && (
              <CustomButton 
                onClick={handlePrevPage}
                style={{ 
                  backgroundColor: "#dddddd", 
                  boxShadow: "0 0 10px #dddddd",
                  fontSize: "14px"
                }}
              >
                Previous Card
              </CustomButton>
            )}
            
            {/* Emergency button - always show a next button if no other navigation is shown */}
            {isStarted && !document.querySelector('.sv-footer') && (
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>Navigation issue detected</p>
                <CustomButton onClick={() => {
                  log('Emergency next button clicked');
                  if (survey) {
                    survey.nextPage();
                    setCurrentPage(survey.currentPageNo);
                  }
                }}>
                  EMERGENCY: Go to Next Card
                </CustomButton>
              </div>
            )}
          </CustomNavigationContainer>
        </div>
      )}
      
      {/* Completed State */}
      {isCompleted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#FFDE59',
          fontSize: '24px',
          fontFamily: "'Press Start 2P', cursive",
          padding: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '15px',
          border: '5px solid #FFDE59',
          boxShadow: '0 0 30px #FFDE59',
          width: '80%',
          maxWidth: '600px',
          animation: 'completionPulse 2s infinite alternate'
        }}>
          <h2>Game Complete!</h2>
          <p style={{ fontSize: '16px', marginTop: '20px' }}>Thanks for playing!</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              backgroundColor: '#FFDE59',
              color: '#000000',
              border: '4px solid #000000',
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 0 20px #FFDE59'
            }}
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* Debug Overlay */}
      <DebugOverlay />
    </SurveyContainer>
  );
}

export default SurveyComponent; 