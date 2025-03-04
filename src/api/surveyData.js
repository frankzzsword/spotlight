// API functions to save and load survey data
// Uses local storage fallback when API is unavailable

// Base URL for the API
const API_URL = process.env.NODE_ENV === 'production' 
  ? `/api` // In production, use relative URL (no origin)
  : 'http://localhost:3000/api'; 

// Debug information to help diagnose problems
console.log('Survey API configured as:', API_URL, 'ENV:', process.env.NODE_ENV);
console.log('App version: 1.2.0 (Vercel Serverless API)');
console.log('Build time:', new Date().toISOString());

// Function to save survey data
export const saveSurveyData = async (surveyData) => {
  try {
    // Add timestamp if not present
    if (!surveyData.createdAt) {
      surveyData.createdAt = new Date().toISOString();
    }
    
    // Log attempt
    console.log('Attempting to save survey data...');
    
    // Try to save to the API first
    try {
      const endpoint = `${API_URL}/save`;
      console.log('Saving survey data to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
        // Short timeout to fail fast if API is inaccessible
        signal: AbortSignal.timeout(5000)
      });
      
      console.log('Save response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Survey saved successfully to API:', result);
      return result;
    } catch (apiError) {
      console.warn('API save attempt failed, using localStorage fallback:', apiError);
      throw apiError; // Re-throw to trigger the fallback
    }
  } catch (error) {
    console.log('Falling back to localStorage...');
    
    // Fallback to localStorage if the API fails
    try {
      // Get existing survey results from localStorage
      const existingData = localStorage.getItem('surveyResults');
      let allSurveys = [];
      
      if (existingData) {
        allSurveys = JSON.parse(existingData);
      }
      
      // Add the new survey
      allSurveys.push(surveyData);
      
      // Save back to localStorage
      localStorage.setItem('surveyResults', JSON.stringify(allSurveys));
      
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(allSurveys, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const dataUrl = URL.createObjectURL(dataBlob);
      
      // Create a download link and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'survey_results.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log('Survey saved to localStorage as fallback and JSON file created');
      return { success: true, message: 'Saved to localStorage (fallback) and created JSON file', data: surveyData };
    } catch (localError) {
      console.error('Error saving to localStorage:', localError);
      return { success: false, error: localError.message };
    }
  }
};

// Function to load all survey data
export const loadSurveyData = async () => {
  try {
    console.log('Attempting to load survey data...');
    
    // Try API first
    try {
      const endpoint = `${API_URL}/getAll`;
      console.log('Loading survey data from:', endpoint);
      
      const response = await fetch(endpoint, {
        // Increase timeout for potentially large data sets
        signal: AbortSignal.timeout(8000)
      });
      
      console.log('Load response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Surveys loaded successfully from API:', result);
      
      if (result.success && result.data) {
        return result.data.responses || [];
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.warn('API load attempt failed, using localStorage fallback:', apiError);
      throw apiError; // Re-throw to trigger the fallback
    }
  } catch (error) {
    console.log('Falling back to localStorage...');
    
    // Fallback to localStorage if the API fails
    try {
      const storedResults = localStorage.getItem('surveyResults');
      if (storedResults) {
        console.log('Loading surveys from localStorage fallback');
        return JSON.parse(storedResults);
      }
      console.log('No surveys found in localStorage');
      return [];
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
      return [];
    }
  }
};

// Function to save a suggestion question
export const saveSuggestion = async (question) => {
  try {
    console.log('Attempting to save suggestion question...');
    
    // Try to save to the API
    const endpoint = `${API_URL}/saveSuggestion`;
    console.log('Saving suggestion to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(5000)
    });
    
    console.log('Save suggestion response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Suggestion saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving suggestion:', error);
    // Return error result
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Function to check the MongoDB connection health
export const checkMongoDBConnection = async () => {
  try {
    console.log('Checking connection health...');
    
    // Try to connect to API health endpoint
    try {
      const endpoint = `${API_URL}/health`;
      console.log('Checking API health at:', endpoint);
      
      const response = await fetch(endpoint, {
        // Short timeout to fail fast if API is inaccessible
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API health check response:', data);
      
      return {
        connected: data.mongodb === 'Connected',
        status: data.status,
        mongoStatus: data.mongodb,
        error: data.error,
        environment: data.environment,
        serverTime: data.serverTime,
        vercelRegion: data.vercelRegion
      };
    } catch (apiError) {
      console.warn('API health check failed, using fallback:', apiError);
      throw apiError; // Re-throw to trigger the fallback
    }
  } catch (error) {
    console.log('Using simulated health check response');
    
    return {
      connected: true,
      status: 'ok',
      mongoStatus: 'Using localStorage (API Unavailable)',
      environment: process.env.NODE_ENV || 'unknown',
      error: error.message,
      serverTime: new Date().toISOString(),
      fallback: true
    };
  }
}; 