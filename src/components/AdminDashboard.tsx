import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadSurveyData, checkMongoDBConnection } from '../api/surveyData';

// Types
type CardType = 'spot' | 'challenge';

type SurveyResult = {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: number;
  completed: boolean;
  cards: {
    id: string;
    type: CardType;
    content: string;
    rating1: number;
    rating2: number;
    suggestion: string;
  }[];
};

type SuggestionQuestion = {
  _id: string;
  question: string;
  status: 'new' | 'approved' | 'rejected';
  timestamp: string;
  meta?: {
    userAgent?: string;
    ip?: string;
  };
};

// Styled components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #000000;
  font-size: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #000000;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #000000;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? '#ffffff' : '#000000'};
  background-color: ${props => props.active ? '#000000' : '#ffffff'};
  border: 2px solid #000000;
  border-bottom: ${props => props.active ? 'none' : '2px solid #000000'};
  cursor: pointer;
  transition: all 0.15s ease;
  margin-right: 5px;
  
  &:hover {
    color: ${props => props.active ? '#ffffff' : '#000000'};
    background-color: ${props => props.active ? '#000000' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  margin-top: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #000000;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #000000;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin: 2rem 0 1rem 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  border: 2px solid #000000;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 0.75rem 1.5rem;
  background-color: #000000;
  border-bottom: 2px solid #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  color: #ffffff;
`;

const TableCell = styled.td`
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #000000;
  font-size: 1rem;
  color: #000000;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px solid #000000;
  border-radius: 0.5rem;
  text-align: center;
  background-color: #ffffff;
  color: #000000;
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #000000;
`;

// New styled components for suggestions
const SuggestionCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 2px solid #000000;
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SuggestionText = styled.p`
  font-size: 1.1rem;
  color: #000000;
  margin: 0.5rem 0;
`;

const SuggestionMeta = styled.div`
  font-size: 0.8rem;
  color: #666666;
  margin-top: 0.5rem;
`;

const StatusBadge = styled.span<{ status: 'new' | 'approved' | 'rejected' }>`
  background-color: ${props => {
    switch (props.status) {
      case 'new': return '#2196F3';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#2196F3';
    }
  }};
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'responses' | 'suggestions'>('overview');
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    status: string;
    mongoStatus: string;
    error: string | null;
    environment: string;
    serverTime: string;
    vercelRegion?: string;
    fallback?: boolean;
  } | null>(null);

  const checkConnection = async () => {
    try {
      const status = await checkMongoDBConnection();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionStatus({
        connected: false,
        status: 'error',
        mongoStatus: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'unknown',
        serverTime: new Date().toISOString(),
        fallback: true
      });
    }
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const response = await loadSurveyData();
      console.log('Loaded survey data:', response);
      
      // Process survey data
      if (Array.isArray(response)) {
        setSurveyResults(response);
      } else {
        console.error('Invalid survey data format:', response);
        setSurveyResults([]);
      }
      
      // Attempt to process suggestion questions if they exist
      if (response && typeof response === 'object' && 'data' in response && response.data && 'suggestions' in response.data) {
        setSuggestions(response.data.suggestions || []);
        console.log('Loaded suggestions:', response.data.suggestions);
      } else {
        console.log('No suggestions data found in response');
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error loading survey results:', error);
      setSurveyResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    loadResults();
    
    // Refresh connection status periodically
    const connectionInterval = setInterval(checkConnection, 60000);
    
    return () => {
      clearInterval(connectionInterval);
    };
  }, []);

  // Calculate stats
  const totalSurveys = surveyResults.length;
  const totalCardResponses = surveyResults.reduce((total, survey) => total + (survey.cards?.length || 0), 0);
  
  // Calculate spot card stats
  const spotCards = surveyResults.flatMap(survey => 
    survey.cards?.filter(card => card.type === 'spot') || []
  );
  const totalSpotCards = spotCards.length;
  const avgSpotRating1 = totalSpotCards > 0 
    ? spotCards.reduce((sum, card) => sum + (card.rating1 || 0), 0) / totalSpotCards 
    : 0;
  const avgSpotRating2 = totalSpotCards > 0 
    ? spotCards.reduce((sum, card) => sum + (card.rating2 || 0), 0) / totalSpotCards 
    : 0;
    
  // Calculate challenge card stats
  const challengeCards = surveyResults.flatMap(survey => 
    survey.cards?.filter(card => card.type === 'challenge') || []
  );
  const totalChallengeCards = challengeCards.length;
  const avgChallengeRating1 = totalChallengeCards > 0 
    ? challengeCards.reduce((sum, card) => sum + (card.rating1 || 0), 0) / totalChallengeCards 
    : 0;
  const avgChallengeRating2 = totalChallengeCards > 0 
    ? challengeCards.reduce((sum, card) => sum + (card.rating2 || 0), 0) / totalChallengeCards 
    : 0;

  // Connection status component
  const ConnectionStatus = () => {
    if (!connectionStatus) {
      return <div>Checking connection...</div>;
    }

    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: connectionStatus.connected ? '#e8f5e9' : '#ffebee',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: `2px solid ${connectionStatus.connected ? '#4caf50' : '#f44336'}`
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>
          {connectionStatus.connected ? '✅ Connected' : '❌ Not Connected'}
        </h3>
        <div style={{ fontSize: '0.9rem' }}>
          <div><strong>Status:</strong> {connectionStatus.status}</div>
          <div><strong>MongoDB:</strong> {connectionStatus.mongoStatus}</div>
          <div><strong>Environment:</strong> {connectionStatus.environment}</div>
          <div><strong>Server Time:</strong> {connectionStatus.serverTime}</div>
          {connectionStatus.vercelRegion && (
            <div><strong>Vercel Region:</strong> {connectionStatus.vercelRegion}</div>
          )}
          {connectionStatus.fallback && (
            <div style={{ color: '#f44336', fontWeight: 'bold', marginTop: '0.5rem' }}>
              Using localStorage fallback - API unavailable
            </div>
          )}
          {connectionStatus.error && (
            <div style={{ color: '#f44336', marginTop: '0.5rem' }}>
              <strong>Error:</strong> {connectionStatus.error}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuggestionsTab = () => {
    if (loading) {
      return <div>Loading suggestions...</div>;
    }

    if (!suggestions || suggestions.length === 0) {
      return (
        <EmptyState>
          <EmptyStateTitle>No Suggestions Yet</EmptyStateTitle>
          <p>There are no suggestion questions submitted by users yet.</p>
        </EmptyState>
      );
    }

    return (
      <>
        <SectionTitle>User Suggestions ({suggestions.length})</SectionTitle>
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion._id}>
            <SuggestionHeader>
              <StatusBadge status={suggestion.status || 'new'}>
                {suggestion.status || 'New'}
              </StatusBadge>
              <span>{new Date(suggestion.timestamp).toLocaleString()}</span>
            </SuggestionHeader>
            <SuggestionText>"{suggestion.question}"</SuggestionText>
            {suggestion.meta && (
              <SuggestionMeta>
                {suggestion.meta.userAgent && <div>User Agent: {suggestion.meta.userAgent}</div>}
              </SuggestionMeta>
            )}
          </SuggestionCard>
        ))}
      </>
    );
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
      </Header>
      
      <ConnectionStatus />
      
      <TabsContainer>
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </TabButton>
        <TabButton 
          active={activeTab === 'cards'} 
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </TabButton>
        <TabButton 
          active={activeTab === 'responses'} 
          onClick={() => setActiveTab('responses')}
        >
          Responses
        </TabButton>
        <TabButton 
          active={activeTab === 'suggestions'} 
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </TabButton>
      </TabsContainer>
      
      {activeTab === 'overview' && (
        <TabContent>
          <StatsGrid>
            <StatCard>
              <StatNumber>{totalSurveys}</StatNumber>
              <StatLabel>Surveys Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{totalCardResponses}</StatNumber>
              <StatLabel>Card Responses</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{avgSpotRating1.toFixed(1)}</StatNumber>
              <StatLabel>Avg. Spot Rating 1</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{avgSpotRating2.toFixed(1)}</StatNumber>
              <StatLabel>Avg. Spot Rating 2</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{avgChallengeRating1.toFixed(1)}</StatNumber>
              <StatLabel>Avg. Challenge Rating 1</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{avgChallengeRating2.toFixed(1)}</StatNumber>
              <StatLabel>Avg. Challenge Rating 2</StatLabel>
            </StatCard>
          </StatsGrid>
        </TabContent>
      )}
      
      {activeTab === 'cards' && (
        <TabContent>
          <SectionTitle>Card Statistics</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>{totalSpotCards}</StatNumber>
              <StatLabel>Total Spot Cards</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{totalChallengeCards}</StatNumber>
              <StatLabel>Total Challenge Cards</StatLabel>
            </StatCard>
          </StatsGrid>
        </TabContent>
      )}
      
      {activeTab === 'responses' && (
        <TabContent>
          <SectionTitle>Survey Responses</SectionTitle>
          {loading ? (
            <div>Loading survey data...</div>
          ) : surveyResults.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No Survey Responses Yet</EmptyStateTitle>
              <p>There are no completed surveys yet.</p>
            </EmptyState>
          ) : (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Cards</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {surveyResults.map((survey) => (
                    <tr key={survey.id}>
                      <TableCell>{survey.userName || 'Anonymous'}</TableCell>
                      <TableCell>{new Date(survey.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{survey.cards?.length || 0}</TableCell>
                      <TableCell>{survey.completed ? 'Completed' : 'In Progress'}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </TabContent>
      )}
      
      {activeTab === 'suggestions' && (
        <TabContent>
          {renderSuggestionsTab()}
        </TabContent>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard; 