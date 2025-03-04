import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { spotCards, challengeCards } from '../data/cards';

// Types for our dashboard
interface SurveyResult {
  id: string;
  timestamp: number;
  data: Record<string, any>;
}

interface CardRating {
  cardId: string;
  cardText: string;
  noticeRating?: number;
  funRating: number;
  likelyRating?: number;
  suggestions: string[];
}

// Styled components
const DashboardContainer = styled.div`
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
  z-index: 2;
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const DashboardTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
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
`;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 4px solid #FF00FF;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.7);
`;

const SummaryTitle = styled.h2`
  font-family: 'Press Start 2P', cursive;
  font-size: 18px;
  color: #4ECDC4;
  margin-top: 0;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'VT323', monospace;
  font-size: 18px;
  color: #F7FFF7;
`;

const TableHead = styled.thead`
  border-bottom: 2px solid #FF00FF;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    background-color: rgba(255, 107, 107, 0.2);
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  color: #FFE66D;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
`;

const RatingBar = styled.div<{ rating: number }>`
  height: 20px;
  background: linear-gradient(to right, #FF6B6B, #4ECDC4);
  width: ${props => props.rating * 20}%;
  border-radius: 4px;
  margin-top: 5px;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#FF6B6B' : 'transparent'};
  border: 2px solid #FF00FF;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  color: ${props => props.active ? '#000' : '#F7FFF7'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.5);
  }
`;

const SubmissionsList = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 4px solid #FF00FF;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.7);
  margin-bottom: 30px;
`;

const SuggestionText = styled.div`
  font-family: 'VT323', monospace;
  font-size: 16px;
  color: #F7FFF7;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 10px;
  margin-top: 5px;
  border-left: 3px solid #4ECDC4;
`;

const StatsCounter = styled.div`
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  color: #FFE66D;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  
  span {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 4px;
    border: 2px solid #FF00FF;
  }
`;

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
  const [spotCardRatings, setSpotCardRatings] = useState<CardRating[]>([]);
  const [challengeCardRatings, setChallengeCardRatings] = useState<CardRating[]>([]);
  const [activeTab, setActiveTab] = useState<'spot' | 'challenge'>('spot');
  
  useEffect(() => {
    // Load all survey results from localStorage
    const results: SurveyResult[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('survey_result_')) {
        try {
          const timestamp = parseInt(key.replace('survey_result_', ''));
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          results.push({ id: key, timestamp, data });
        } catch (e) {
          console.error('Error parsing survey result:', e);
        }
      }
    }
    
    // Sort results by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);
    setSurveyResults(results);
    
    // Process the results to get ratings for each card
    processResults(results);
  }, []);
  
  const processResults = (results: SurveyResult[]) => {
    // Initialize empty ratings for all cards
    const spotRatings: Record<string, CardRating> = {};
    const challengeRatings: Record<string, CardRating> = {};
    
    // Initialize with empty arrays
    spotCards.forEach(card => {
      spotRatings[card.id] = {
        cardId: card.id,
        cardText: card.text,
        noticeRating: 0,
        funRating: 0,
        suggestions: []
      };
    });
    
    challengeCards.forEach(card => {
      challengeRatings[card.id] = {
        cardId: card.id,
        cardText: card.text,
        funRating: 0,
        likelyRating: 0,
        suggestions: []
      };
    });
    
    // Process each survey result
    results.forEach(result => {
      const { data } = result;
      
      // Loop through all keys in the data
      Object.keys(data).forEach(key => {
        // Process spot card ratings
        if (key.startsWith('spot_notice_')) {
          const cardId = key.replace('spot_notice_', '');
          if (spotRatings[cardId]) {
            spotRatings[cardId].noticeRating = (spotRatings[cardId].noticeRating || 0) + data[key];
          }
        } else if (key.startsWith('spot_fun_')) {
          const cardId = key.replace('spot_fun_', '');
          if (spotRatings[cardId]) {
            spotRatings[cardId].funRating = (spotRatings[cardId].funRating || 0) + data[key];
          }
        } else if (key.startsWith('spot_suggestion_')) {
          const cardId = key.replace('spot_suggestion_', '');
          if (spotRatings[cardId] && data[key]) {
            spotRatings[cardId].suggestions.push(data[key]);
          }
        }
        
        // Process challenge card ratings
        else if (key.startsWith('challenge_fun_')) {
          const cardId = key.replace('challenge_fun_', '');
          if (challengeRatings[cardId]) {
            challengeRatings[cardId].funRating = (challengeRatings[cardId].funRating || 0) + data[key];
          }
        } else if (key.startsWith('challenge_likely_')) {
          const cardId = key.replace('challenge_likely_', '');
          if (challengeRatings[cardId]) {
            challengeRatings[cardId].likelyRating = (challengeRatings[cardId].likelyRating || 0) + data[key];
          }
        } else if (key.startsWith('challenge_suggestion_')) {
          const cardId = key.replace('challenge_suggestion_', '');
          if (challengeRatings[cardId] && data[key]) {
            challengeRatings[cardId].suggestions.push(data[key]);
          }
        }
      });
    });
    
    // Convert from object to array and calculate averages based on result count
    const resultCount = results.length || 1; // Avoid division by zero
    
    const spotRatingsArray = Object.values(spotRatings).map(rating => ({
      ...rating,
      noticeRating: rating.noticeRating ? rating.noticeRating / resultCount : 0,
      funRating: rating.funRating ? rating.funRating / resultCount : 0
    }));
    
    const challengeRatingsArray = Object.values(challengeRatings).map(rating => ({
      ...rating,
      funRating: rating.funRating ? rating.funRating / resultCount : 0,
      likelyRating: rating.likelyRating ? rating.likelyRating / resultCount : 0
    }));
    
    // Sort by fun rating (highest first)
    spotRatingsArray.sort((a, b) => b.funRating - a.funRating);
    challengeRatingsArray.sort((a, b) => b.funRating - a.funRating);
    
    setSpotCardRatings(spotRatingsArray);
    setChallengeCardRatings(challengeRatingsArray);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>SURVEY RESULTS DASHBOARD</DashboardTitle>
        <StatsCounter>
          <span>{surveyResults.length} SUBMISSIONS RECEIVED</span>
        </StatsCounter>
      </DashboardHeader>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'spot'} 
          onClick={() => setActiveTab('spot')}
        >
          SPOT CARDS
        </TabButton>
        <TabButton 
          active={activeTab === 'challenge'} 
          onClick={() => setActiveTab('challenge')}
        >
          CHALLENGE CARDS
        </TabButton>
      </TabContainer>
      
      {activeTab === 'spot' && (
        <SummaryContainer>
          <SummaryCard>
            <SummaryTitle>TOP SPOT CARDS (MOST FUN)</SummaryTitle>
            <StatsTable>
              <TableHead>
                <tr>
                  <TableHeader>CARD TEXT</TableHeader>
                  <TableHeader>FUN RATING</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {spotCardRatings.slice(0, 10).map(card => (
                  <TableRow key={card.cardId}>
                    <TableCell>{card.cardText}</TableCell>
                    <TableCell>
                      {card.funRating.toFixed(1)}/5
                      <RatingBar rating={card.funRating} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StatsTable>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryTitle>EASIEST TO NOTICE SPOT CARDS</SummaryTitle>
            <StatsTable>
              <TableHead>
                <tr>
                  <TableHeader>CARD TEXT</TableHeader>
                  <TableHeader>NOTICE RATING</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {[...spotCardRatings].sort((a, b) => (b.noticeRating || 0) - (a.noticeRating || 0)).slice(0, 10).map(card => (
                  <TableRow key={card.cardId}>
                    <TableCell>{card.cardText}</TableCell>
                    <TableCell>
                      {(card.noticeRating || 0).toFixed(1)}/5
                      <RatingBar rating={card.noticeRating || 0} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StatsTable>
          </SummaryCard>
        </SummaryContainer>
      )}
      
      {activeTab === 'challenge' && (
        <SummaryContainer>
          <SummaryCard>
            <SummaryTitle>TOP CHALLENGE CARDS (MOST FUN)</SummaryTitle>
            <StatsTable>
              <TableHead>
                <tr>
                  <TableHeader>CARD TEXT</TableHeader>
                  <TableHeader>FUN RATING</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {challengeCardRatings.slice(0, 10).map(card => (
                  <TableRow key={card.cardId}>
                    <TableCell>{card.cardText}</TableCell>
                    <TableCell>
                      {card.funRating.toFixed(1)}/5
                      <RatingBar rating={card.funRating} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StatsTable>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryTitle>MOST LIKELY TO DO CHALLENGES</SummaryTitle>
            <StatsTable>
              <TableHead>
                <tr>
                  <TableHeader>CARD TEXT</TableHeader>
                  <TableHeader>LIKELY RATING</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {[...challengeCardRatings].sort((a, b) => (b.likelyRating || 0) - (a.likelyRating || 0)).slice(0, 10).map(card => (
                  <TableRow key={card.cardId}>
                    <TableCell>{card.cardText}</TableCell>
                    <TableCell>
                      {(card.likelyRating || 0).toFixed(1)}/5
                      <RatingBar rating={card.likelyRating || 0} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StatsTable>
          </SummaryCard>
        </SummaryContainer>
      )}
      
      {surveyResults.length > 0 && (
        <SubmissionsList>
          <SummaryTitle>RECENT SUBMISSIONS</SummaryTitle>
          <StatsTable>
            <TableHead>
              <tr>
                <TableHeader>DATE</TableHeader>
                <TableHeader>RESPONSES</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {surveyResults.slice(0, 5).map(result => (
                <TableRow key={result.id}>
                  <TableCell>{formatDate(result.timestamp)}</TableCell>
                  <TableCell>{Object.keys(result.data).length} answers</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StatsTable>
        </SubmissionsList>
      )}
      
      {(activeTab === 'spot' ? spotCardRatings : challengeCardRatings).length > 0 && (
        <SubmissionsList>
          <SummaryTitle>SUGGESTIONS FOR {activeTab === 'spot' ? 'SPOT' : 'CHALLENGE'} CARDS</SummaryTitle>
          <StatsTable>
            <TableHead>
              <tr>
                <TableHeader>CARD</TableHeader>
                <TableHeader>SUGGESTIONS</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {(activeTab === 'spot' ? spotCardRatings : challengeCardRatings)
                .filter(card => card.suggestions.length > 0)
                .slice(0, 10)
                .map(card => (
                  <TableRow key={card.cardId}>
                    <TableCell>{card.cardText}</TableCell>
                    <TableCell>
                      {card.suggestions.map((suggestion, index) => (
                        <SuggestionText key={index}>{suggestion}</SuggestionText>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </StatsTable>
        </SubmissionsList>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 