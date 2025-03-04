const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON data file
const DATA_FILE = path.join(__dirname, 'surveyData.json');

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// API endpoint to save survey data
app.post('/api/save-survey', (req, res) => {
  try {
    const newSurvey = req.body;
    
    // Read existing data
    let surveys = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      surveys = JSON.parse(data);
    }
    
    // Add new survey
    surveys.push(newSurvey);
    
    // Write back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(surveys, null, 2));
    
    res.json({ success: true, message: 'Survey saved successfully' });
  } catch (error) {
    console.error('Error saving survey:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get all surveys
app.get('/api/get-surveys', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json([]);
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const surveys = JSON.parse(data);
    
    res.json(surveys);
  } catch (error) {
    console.error('Error getting surveys:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 