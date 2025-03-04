import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { saveSurveyData } from '../api/surveyData';

// Define types for our survey
type CardType = 'spot' | 'challenge';

// Define styled components for our survey
const SurveyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 3px solid #0088cc;
  border-radius: 8px;
  box-shadow: 5px 5px 0px rgba(0, 136, 204, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const SurveyTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #222222;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
`;

const SurveyPage = styled.div`
  padding: 20px;
  background-color: #f8f8f8;
  border: 2px solid #0088cc;
  margin-bottom: 20px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  color: #333333;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border: 2px solid #0088cc;
  margin-bottom: 20px;
`;

const ProgressFill = styled.div<{ width: string }>`
  height: 100%;
  width: ${props => props.width};
  background-color: #0088cc;
  transition: width 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding: 20px;
  gap: 10px;
  position: relative;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #0088cc;
  color: #ffffff;
  border: 3px solid #0066aa;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 4px 4px 0px rgba(0, 136, 204, 0.4);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
    background-color: #00aaff;
  }
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px rgba(0, 136, 204, 0.4);
  }
`;

const StartButton = styled(Button)`
  background-color: #cc0088;
  color: #ffffff;
  border-color: #990066;
  font-size: 24px;
  padding: 15px 30px;
  animation: pulse 1.5s infinite;
  box-shadow: 4px 4px 0px rgba(204, 0, 136, 0.4);
  
  &:hover {
    background-color: #ff00aa;
  }
  
  &:active {
    box-shadow: 2px 2px 0px rgba(204, 0, 136, 0.4);
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  text-align: left;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #0088cc;
  border-radius: 4px;
  cursor: pointer;
  color: #333333;
  
  &:hover {
    background-color: #f0f0f0;
    border-color: #00aaff;
    color: #0088cc;
  }
  
  input:checked + span {
    color: #0088cc;
    font-weight: bold;
  }
`;

const QuestionTitle = styled.h3`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f0f0;
  border: 2px solid #0088cc;
  color: #333333;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h2`
  color: transparent;
  background: linear-gradient(45deg, #ff2a6d, #05d9e8, #f706cf);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  font-family: 'Audiowide', 'Orbitron', 'Press Start 2P', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(150, 50, 255, 0.5), 0 0 20px rgba(150, 50, 255, 0.3);
  animation: gradient 15s ease infinite;
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const WelcomeText = styled.p`
  color: #333;
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  padding: 0.5rem;
  
  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.8rem;
    position: relative;
  }
  
  li::before {
    content: '⚡';
    position: absolute;
    left: -1.5rem;
    color: #ff2a6d;
  }
  
  span.retro-box-red {
    display: inline-block;
    padding: 0.1em 0.4em;
    background: #ff2a6d;
    color: #fff;
    font-weight: bold;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
    transform: skew(-5deg);
    margin: 0 0.2em;
  }
  
  span.retro-box-blue {
    display: inline-block;
    padding: 0.1em 0.4em;
    background: #0088cc;
    color: #fff;
    font-weight: bold;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
    transform: skew(-5deg);
    margin: 0 0.2em;
  }
  
  span.retro-box-green {
    display: inline-block;
    padding: 0.1em 0.4em;
    background: #00cc88;
    color: #fff;
    font-weight: bold;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
    transform: skew(-5deg);
    margin: 0 0.2em;
  }
  
  span.retro-box-purple {
    display: inline-block;
    padding: 0.1em 0.4em;
    background: #9933cc;
    color: #fff;
    font-weight: bold;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
    transform: skew(-5deg);
    margin: 0 0.2em;
  }
  
  span.retro-box-orange {
    display: inline-block;
    padding: 0.1em 0.4em;
    background: #ff8800;
    color: #fff;
    font-weight: bold;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
    transform: skew(-5deg);
    margin: 0 0.2em;
  }
`;

const WelcomeCall = styled.p`
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 2rem 0;
  text-align: center;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  padding: 0.5rem;
  border-bottom: 3px dashed #0088cc;
  border-top: 3px dashed #0088cc;
`;

const FeedbackAppreciation = styled.p`
  color: #333;
  font-size: 1.2rem;
  font-style: italic;
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const ThankYouTitle = styled.h2`
  color: #0088cc;
  margin-bottom: 20px;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
`;

const ThankYouText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  max-width: 600px;
`;

const AnswersTitle = styled.h3`
  color: #cc0088;
  margin-bottom: 10px;
`;

const AnswersDisplay = styled.pre`
  background-color: #f8f8f8;
  padding: 15px;
  border: 2px solid #0088cc;
  border-radius: 4px;
  color: #333333;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  overflow: auto;
`;

// Card styled components
const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SpotCard = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
`;

const ChallengeCard = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
`;

const CardTypeLabel = styled.div<{ type: 'spot' | 'challenge' }>`
  background-color: ${props => props.type === 'spot' ? '#4CAF50' : '#FF9800'};
  color: #000000;
  padding: 8px 15px;
  font-weight: bold;
  font-size: 28px;
  text-align: center;
  margin-bottom: 15px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
  border: 2px solid #000000;
`;

const CardTitle = styled.h3`
  color: #222222;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.p`
  color: #222222;
  font-size: 22px;
  text-align: center;
  margin-bottom: 25px;
  padding: 0 10px;
  font-weight: 500;
  line-height: 1.4;
  text-shadow: none;
`;

const QuestionText = styled.p`
  color: #0088cc;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: left;
`;

const RatingGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RatingOption = styled.button<{ selected: boolean; rating: number }>`
  background-color: ${props => props.selected ? 
    (props.rating === 1 ? '#FF4136' :
     props.rating === 2 ? '#FF851B' :
     props.rating === 3 ? '#FFC107' :
     props.rating === 4 ? '#9EE09E' :
     '#2ECC40') : '#ffffff'};
  color: #000000;
  border: 2px solid #000000;
  border-radius: 4px;
  width: 45px;
  height: 45px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 3px;
  outline: none;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 2px solid #0088cc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #000000;
  background-color: #ffffff;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #00aaff;
    box-shadow: 0 0 0 2px rgba(0, 136, 204, 0.3);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #0088cc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #00aaff;
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

// Admin view components
const AdminButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #333333;
  color: #ffffff;
  z-index: 1000;
  padding: 8px 16px;
  font-size: 14px;
`;

const AdminPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  overflow-y: auto;
  padding: 20px;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AdminTitle = styled.h2`
  color: #33ff00;
  margin: 0;
`;

const CloseButton = styled.button`
  background-color: #cc0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

const ResultCardContent = styled.p`
  color: #333333;
  font-size: 16px;
  margin-bottom: 15px;
`;

const ResultRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666666;
  
  span {
    color: #333333;
    font-weight: bold;
    margin-left: 5px;
  }
`;

const ResultSuggestion = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #555555;
  margin-top: 10px;
  border-left: 3px solid #0088cc;
`;

// Suggestion page styled components
const SuggestionItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SuggestionType = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const TypeOption = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 2px solid ${props => props.selected ? 'transparent' : '#ffffff'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? '#4CAF50' : '#444444'};
  color: ${props => props.selected ? 'white' : '#ffffff'};
  
  &:first-child {
    background-color: ${props => props.selected ? '#4CAF50' : '#444444'};
  }
  
  &:last-child {
    background-color: ${props => props.selected ? '#FF9800' : '#444444'};
    color: ${props => props.selected ? 'white' : '#ffffff'};
  }
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #0088cc;
  color: #ffffff;
  border: 2px solid #0066aa;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #00aaff;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 0, 0, 0.6);
  color: white;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.8);
  }
`;

const RatingButton = styled.button<{ selected: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.selected ? '#0088cc' : '#ffffff'};
  border-radius: 4px;
  background-color: ${props => props.selected ? '#0088cc' : 'transparent'};
  color: ${props => props.selected ? '#ffffff' : '#ffffff'};
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin: 0 5px;
  
  &:hover {
    background-color: ${props => props.selected ? '#0088cc' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

// Define additional types for our survey data
type CardData = {
  id: string;
  type: CardType;
  content: string;
};

type CardSurveyAnswer = {
  rating1: number;
  rating2: number;
  suggestion: string;
};

type SurveyData = {
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

// Spot and Challenge card data
const spotCards: string[] = [
  "Someone tells the same story multiple times to different people.",
  "Someone sits on a non-chair surface (e.g., counter, floor).",
  "Someone mentions a trend.",
  "Someone claims they 'don't usually drink this much'.",
  "Someone smells/shakes a drink before sipping.",
  "A phone flashlight is used for non-utility purposes.",
  "Someone takes a group photo.",
  "Someone mentions their ex.",
  "Someone mentions the time.",
  "Someone takes part of their clothing off.",
  "Someone checks their phone while someone is talking to them.",
  "Someone talking with their mouth full.",
  "Someone using a paper towel.",
  "Someone offering unsolicited advice.",
  "Looking around the room like they're searching for someone specific.",
  "Someone takes a selfie with the host.",
  "Someone asks 'What do you do?'.",
  "Someone asks 'Where are you from?'.",
  "Someone tells a long story.",
  "Someone who starts mentioning about their colleague.",
  "Someone asks for a lighter.",
  "Someone does a cheers.",
  "Someone complains about the volume.",
  "Someone complains about the music.",
  "Someone talks about their job (in detail).",
  "Someone talks about their 'side hustle'.",
  "Someone complains about transportation.",
  "Someone talks about their sleep schedule.",
  "Someone mentions viral media.",
  "Someone making a 'dad joke'.",
  "Someone does something unexpected.",
  "You and someone else are drinking the exact drink.",
  "You and another person are wearing the same color.",
  "You and another person were both stuck in an awkward silence together.",
  "Someone has spilled a drink at some point in the party.",
  "A person tries to change the music.",
  "Someone whines about something trivial (temperature, music, etc.).",
  "Someone suddenly needs to go outside for 'fresh air'.",
  "Someone shows up late.",
  "Someone constantly interrupts conversations.",
  "You and another person laughed at something that wasn't supposed to be dirty, but your minds made it dirty.",
  "Catch someone vaping indoors.",
  "Person drinking out of a unique container.",
  "Someone is asking around about something specific.",
  "Hug strangers like old friends.",
  "Overshare personal stories.",
  "Lose shoes or accessories.",
  "Talking louder than usual.",
  "Being extra social.",
  "Snacking hard.",
  "Making big plans.",
  "Repeatedly offer to get everyone drinks.",
  "Trash-talk their job.",
  "Someone is talking to another person's ears.",
  "Someone is explaining the rules of another game.",
  "Two guests get into a 'heated' debate over something silly.",
  "Someone who has been posting stories."
];

const challengeCards: string[] = [
  "Swap an item of clothing with the person to your left. Wear it for 10 mins.",
  "Start a conga line that must include at least 10 people. Last to join drinks.",
  "Speak in a Russian accent for the next 10 mins. Slip-up = a shots.",
  "Let the group choose a temporary tattoo location. Apply it with Sharpie.",
  "Pick a partner. Stare into their eyes without blinking. First to laugh drinks.",
  "Teach the group a 'cultural dance' from a country you've never visited.",
  "Wear your socks on your hands and talk to people as a sock puppet.",
  "Propose to a stranger. If they say yes, they drink.",
  "Trade drinks with the nearest person.",
  "Do a viral dance trend.",
  "Wheel of Misfortune: Spin a bottle; kiss, slap, or shot with where it lands.",
  "Sob dramatically until someone hugs you. No hug = drink.",
  "Challenge someone to a thumb war.",
  "Challenge someone to a staring contest... and then immediately burst out laughing.",
  "Teach someone a dance move you just invented.",
  "Take a selfie with a stranger and make it your profile picture for the entire party.",
  "Say 'Peter Piper picked a pack of pickled peppers' five times fast.",
  "Recite the alphabet backward without a pause.",
  "Blindfolded identify 3 objects.",
  "Tell your most embarrassing fetish. *Volume = sincerity.*",
  "Sing a song using only fart noises.",
  "Ask someone to zip/unzip your pants.",
  "Let the group draw on your face something.",
  "Pillow/Cushion fight with a stranger.",
  "Twerk until someone joins you. Last person to join takes a shot.",
  "Crawl to the next room. Anyone who laughs must crawl with you.",
  "Be the party photographer.",
  "Engage in a compliment battle with the spotted person, escalating until it gets absurd.",
  "Hold hands with any one person for the next 5 minutes, no matter what.",
  "Flip a coin. Heads = you kiss the spotted person on the cheek. Tails = they slap you on the butt (lightly?).",
  "Eat something spicy or hold an ice cube in your hand for 30 seconds.",
  "Stand on one leg for the next 2 minutes. If you fail, you drink.",
  "For the next 3 minutes, everything the spotted person does, you must copy.",
  "Get on a table or chair and make an over-the-top toast to the party.",
  "5 rounds of rock paper scissors, loser takes a shot.",
  "Try to lick your elbow.",
  "Stand guard at the door and introduce the game in a hilarious accent to guests for 5 minutes.",
  "Freeze in a ridiculous pose for 20 seconds.",
  "Make a bizarre cocktail with whatever ingredients are available (must be drinkable!).",
  "Spend the next 5 minutes aggressively trying to explain the rules of the game to anyone who will listen.",
  "Successfully steal a Spot or Action card from another player without them noticing.",
  "Pretend to have lost a crucial Spot card, enlisting other players to help you 'find' it.",
  "For the next 10 minutes, you are the 'Party Hype-Person.' Enthusiastically compliment everything everyone does.",
  "High five 3 people who each must high five someone new.",
  "Hug someone who must hug someone new (spreads for 30 seconds).",
  "Toast with someone who must toast someone new (continues for 30 seconds).",
  "Pick a category, fail to name something = drink."
];

// The SimpleSurvey component
const SimpleSurvey: React.FC = () => {
  // State for the survey
  const [currentPage, setCurrentPage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
  const [answers, setAnswers] = useState<Record<string, CardSurveyAnswer>>({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<{
    id: string;
    type: 'spot' | 'challenge';
    content: string;
  }[]>([
    {
      id: `suggestion-${Date.now()}`,
      type: 'spot',
      content: ''
    }
  ]);
  
  // Use useEffect to select random cards when the component mounts
  useEffect(() => {
    // Select 20 random spot cards and 20 random challenge cards
    const randomSpotCards = [...spotCards]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .map(content => ({ id: `spot-${Date.now()}-${content}`, type: 'spot' as CardType, content }));
    
    const randomChallengeCards = [...challengeCards]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .map(content => ({ id: `challenge-${Date.now()}-${content}`, type: 'challenge' as CardType, content }));
    
    // Combine and shuffle all selected cards
    const allSelectedCards = [...randomSpotCards, ...randomChallengeCards]
      .sort(() => 0.5 - Math.random());
    
    setSelectedCards(allSelectedCards);
  }, []);
  
  // Initialize empty answers for all selected cards
  useEffect(() => {
    if (selectedCards.length > 0) {
      const initialAnswers: Record<string, CardSurveyAnswer> = {};
      selectedCards.forEach((card, index) => {
        initialAnswers[card.id] = {
          rating1: 0,
          rating2: 0,
          suggestion: ''
        };
      });
      setAnswers(initialAnswers);
    }
  }, [selectedCards]);

  // Handle rating selection
  const handleRating = (cardIndex: number, questionNumber: 1 | 2, rating: number) => {
    const cardKey = selectedCards[cardIndex].id;
    const currentCardAnswers = answers[cardKey] || { rating1: 0, rating2: 0, suggestion: '' };
    
    setAnswers({
      ...answers,
      [cardKey]: {
        ...currentCardAnswers,
        [`rating${questionNumber}`]: rating
      }
    });
  };
  
  // Handle suggestion text change
  const handleSuggestion = (cardIndex: number, suggestion: string) => {
    const cardKey = selectedCards[cardIndex].id;
    const currentCardAnswers = answers[cardKey] || { rating1: 0, rating2: 0, suggestion: '' };
    
    setAnswers({
      ...answers,
      [cardKey]: {
        ...currentCardAnswers,
        suggestion
      }
    });
  };

  // Handle user info
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  
  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  // Function to handle start button click
  const handleStart = () => {
    if (!userName || !userEmail) {
      alert('Please enter your name and email to start the survey');
      return;
    }
    
    setHasStarted(true);
    setCurrentPage(1);
  };
  
  // Handle next page navigation
  const handleNext = () => {
    if (currentPage < selectedCards.length) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === selectedCards.length) {
      // We're at the suggestion page
      setCurrentPage(currentPage + 1);
    } else {
      // We're at the thank you page
      handleComplete();
    }
  };

  // Handle previous page navigation
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle survey completion
  const handleComplete = () => {
    setIsCompleted(true);
    
    const surveyData = {
      id: uuidv4(),
      userName,
      userEmail,
      timestamp: Date.now(),
      completed: true,
      cards: selectedCards.map(card => ({
        id: card.id,
        type: card.type,
        content: card.type === 'spot' ? card.content : card.content,
        rating1: answers[card.id]?.rating1 || 0,
        rating2: answers[card.id]?.rating2 || 0,
        suggestion: answers[card.id]?.suggestion || ''
      })),
      userSuggestions: userSuggestions.filter(s => s.content.trim() !== '').map(suggestion => ({
        id: suggestion.id,
        type: suggestion.type,
        content: suggestion.content
      }))
    };
    
    // Save survey data using the API
    saveSurveyData(surveyData)
      .then(result => {
        console.log('Survey completed and saved:', result);
      })
      .catch(error => {
        console.error('Error saving survey results:', error);
      });
  };
  
  // Functions for handling user suggestions
  const handleAddSuggestion = () => {
    setUserSuggestions([
      ...userSuggestions,
      { id: `suggestion-${Date.now()}`, type: 'spot', content: '' }
    ]);
  };

  const handleRemoveSuggestion = (id: string) => {
    setUserSuggestions(userSuggestions.filter(s => s.id !== id));
  };

  const handleSuggestionTypeChange = (id: string, type: CardType) => {
    setUserSuggestions(userSuggestions.map(s => 
      s.id === id ? { ...s, type } : s
    ));
  };

  const handleSuggestionContentChange = (id: string, content: string) => {
    setUserSuggestions(userSuggestions.map(s => 
      s.id === id ? { ...s, content } : s
    ));
  };

  // Render a specific card with its questions
  const renderCardContent = (card: CardData, index: number) => {
    const cardKey = card.id;
    const cardAnswers = answers[cardKey] || { rating1: 0, rating2: 0, suggestion: '' };
    const CardComponent = card.type === 'spot' ? SpotCard : ChallengeCard;
    
    const question1 = card.type === 'spot'
      ? "How likely are you to notice this happening at a party?"
      : "How fun would this challenge be at a party?";
      
    const question2 = card.type === 'spot'
      ? "How fun or interesting is it to spot this scenario?"
      : "How likely are you (or someone else) to actually do this challenge?";
      
    const question3 = card.type === 'spot'
      ? "Any suggestions to make this Spot scenario more entertaining?"
      : "Any suggestions to make this Challenge more fun or easier to understand?";
    
    return (
      <CardComponent>
        <CardTypeLabel type={card.type}>{card.type.toUpperCase()} CARD</CardTypeLabel>
        <CardContent>{card.content}</CardContent>
        
        <QuestionText>{question1}</QuestionText>
        <RatingGroup>
          {[1, 2, 3, 4, 5].map(rating => (
            <RatingOption 
              key={`${cardKey}-q1-${rating}`}
              selected={cardAnswers.rating1 === rating}
              rating={rating}
              onClick={() => handleRating(index, 1, rating)}
            >
              {rating}
            </RatingOption>
          ))}
        </RatingGroup>
        
        <QuestionText>{question2}</QuestionText>
        <RatingGroup>
          {[1, 2, 3, 4, 5].map(rating => (
            <RatingOption 
              key={`${cardKey}-q2-${rating}`}
              selected={cardAnswers.rating2 === rating}
              rating={rating}
              onClick={() => handleRating(index, 2, rating)}
            >
              {rating}
            </RatingOption>
          ))}
        </RatingGroup>
        
        <QuestionText>{question3}</QuestionText>
        <TextArea 
          value={cardAnswers.suggestion}
          onChange={(e) => handleSuggestion(index, e.target.value)}
          placeholder="Enter your suggestions here..."
        />
      </CardComponent>
    );
  };

  // Calculate progress
  const totalCards = selectedCards.length;
  const currentCard = currentPage > 0 && currentPage <= totalCards + 1 ? currentPage : 0;
  const progress = totalCards > 0 ? (currentCard / (totalCards + 1)) * 100 : 0;
  
  // Pages for the survey
  const pages = [
    // Welcome page (page 0)
    <SurveyPage key="welcome">
      <WelcomeText>
        We're creating a party card game that transforms ordinary gatherings into unforgettable experiences without interrupting the natural flow of the night.
      </WelcomeText>
      
      <WelcomeCall>
        HOW THE GAME WORKS
      </WelcomeCall>
      
      <WelcomeText>
        <ul>
          <li>When you arrive at a party, you receive 2-4 cards</li>
          <li>Each card has a <span className="retro-box-green">SPOT</span> (something that happens at a party) and a <span className="retro-box-orange">CHALLENGE</span> (a fun action to perform)</li>
          <li>When you <span className="retro-box-green">SPOT</span> someone matching your card, you call it out and challenge them</li>
          <li>If they complete the challenge, they steal your card. If they refuse, you steal one of theirs</li>
        </ul>
      </WelcomeText>
      
      <WelcomeText>
        The key to making this game work is finding the perfect balance—situations that aren't too rare or too obvious and challenges that are actually funny and make the party better, not just random dares.
      </WelcomeText>
      
      <WelcomeText>
        Please imagine yourself at a party while answering. Your insights will directly shape how this game plays out in real life. We want this to be a game that keeps the party going, creates great stories, and makes every night more memorable.
      </WelcomeText>
      
      <WelcomeCall>
        LET'S GET THIS PARTY STARTED!
      </WelcomeCall>
      
      <FeedbackAppreciation>
        Have fun giving us the feedback and we really appreciate it! :)
      </FeedbackAppreciation>
      
      <FormGroup>
        <InputLabel htmlFor="userName">Your Name:</InputLabel>
        <Input 
          type="text" 
          id="userName" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Enter your name"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <InputLabel htmlFor="userEmail">Your Email:</InputLabel>
        <Input 
          type="email" 
          id="userEmail" 
          value={userEmail} 
          onChange={(e) => setUserEmail(e.target.value)} 
          placeholder="Enter your email"
          required
        />
      </FormGroup>
      
      <ButtonContainer>
        <StartButton onClick={handleStart}>Start Survey</StartButton>
      </ButtonContainer>
    </SurveyPage>,
    
    // Card pages (pages 1 to n)
    ...selectedCards.map((card, index) => {
      return renderCardContent(card, index);
    }),
    
    // User suggestion page (before thank you page)
    <SurveyPage key="user-suggestions">
      <WelcomeCall>
        Suggest Your Own Cards
      </WelcomeCall>
      
      <WelcomeText>
        Do you have ideas for <span className="retro-box-green">SPOT</span> scenarios or <span className="retro-box-orange">CHALLENGE</span> actions that would be fun at a party? Share them with us!
      </WelcomeText>
      
      {userSuggestions.map((suggestion, index) => (
        <SuggestionItem key={suggestion.id}>
          {index > 0 && (
            <RemoveButton onClick={() => handleRemoveSuggestion(suggestion.id)}>×</RemoveButton>
          )}
          
          <SuggestionType>
            <TypeOption 
              selected={suggestion.type === 'spot'} 
              onClick={() => handleSuggestionTypeChange(suggestion.id, 'spot')}
            >
              SPOT
            </TypeOption>
            <TypeOption 
              selected={suggestion.type === 'challenge'} 
              onClick={() => handleSuggestionTypeChange(suggestion.id, 'challenge')}
            >
              CHALLENGE
            </TypeOption>
          </SuggestionType>
          
          <TextArea 
            value={suggestion.content}
            onChange={(e) => handleSuggestionContentChange(suggestion.id, e.target.value)}
            placeholder={suggestion.type === 'spot' 
              ? "Describe something that happens at parties..." 
              : "Describe a fun challenge for party-goers..."
            }
          />
        </SuggestionItem>
      ))}
      
      <ButtonContainer>
        <AddButton onClick={handleAddSuggestion}>
          + Add Another Suggestion
        </AddButton>
      </ButtonContainer>
    </SurveyPage>,
    
    // Thank you page (last page)
    <SurveyPage key="thank-you">
      <ThankYouTitle>Thank You For Your Feedback!</ThankYouTitle>
      <ThankYouText>
        Your input is incredibly valuable and will help us improve our party card game.
      </ThankYouText>
      <ThankYouText>
        We might reach out to you for additional feedback or to invite you to playtest future versions.
      </ThankYouText>
    </SurveyPage>
  ];

  return (
    <SurveyContainer>
      {/* Main survey content */}
      {!isCompleted ? (
        <>
          {/* Progress bar */}
          {currentPage > 0 && (
            <ProgressBar>
              <ProgressFill width={`${progress}%`} />
            </ProgressBar>
          )}
          
          {/* Page content */}
          {pages[currentPage]}
          
          {/* Navigation buttons */}
          {currentPage > 0 && currentPage <= totalCards + 1 && (
            <ButtonContainer>
              <Button onClick={handlePrevious} disabled={currentPage === 1}>Previous</Button>
              <Button onClick={currentPage === totalCards + 1 ? handleComplete : handleNext}>
                {currentPage === totalCards ? 'Continue to Suggestions' : 
                 currentPage === totalCards + 1 ? 'Complete' : 'Next'}
              </Button>
            </ButtonContainer>
          )}
        </>
      ) : (
        // Thank you page
        <SurveyPage>
          <ThankYouTitle>Thank You For Your Feedback!</ThankYouTitle>
          <ThankYouText>
            Your responses have been recorded and will help us improve the game.
          </ThankYouText>
          <ThankYouText>
            Feel free to take the survey again to rate more cards!
          </ThankYouText>
          <Button onClick={() => window.location.reload()}>Take Survey Again</Button>
        </SurveyPage>
      )}
    </SurveyContainer>
  );
};

export default SimpleSurvey; 