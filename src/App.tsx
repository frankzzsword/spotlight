import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// import SurveyComponent from './components/Survey';
import SimpleSurvey from './components/SimpleSurvey';
import AdminDashboard from './components/AdminDashboard';
import SquaresBackground from './components/SquaresBackground';
// import NeobrutalistTheme from './styles/NeobrutalistTheme';

const App: React.FC = () => {
  return (
    <Router>
      <SquaresBackground />
      <div className="App">
        {/* <NeobrutalistTheme /> */}
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              <header className="App-header">
                <h1><span className="title-spotlight">SPOTLIGHT</span></h1>
                <p className="title-tagline">The only card game that <span className="highlight">parties</span> with you</p>
              </header>
              <main>
                {/* <SurveyComponent /> */}
                <SimpleSurvey />
              </main>
              <footer>
                <p>🎮 <span className="footer-highlight">Coming to your next party soon!</span> Get ready to level up your gatherings! 🎉</p>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
