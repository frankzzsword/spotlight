import React from 'react';
import styled from 'styled-components';

// Define props interface
interface ChallengeCardProps {
  title: string;
  content: string;
  cardNumber?: number;
}

// Create styled components
const CardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 2/3;
  background-color: #f5f5f5;
  border: 4px solid #000000;
  border-radius: 15px;
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.8);
  margin: 20px auto;
  overflow: hidden;
  transform: rotate(2deg);
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(0deg) translate(-5px, -5px);
    box-shadow: 15px 15px 0 rgba(0, 0, 0, 0.8);
  }
`;

const CardHeader = styled.div`
  width: 100%;
  padding: 15px;
  background-color: #FF5A5F;
  border-bottom: 4px solid #000000;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 24px;
  text-align: center;
`;

const CardContent = styled.div`
  padding: 30px 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 60px);
`;

const CardPip = styled.div`
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #000000;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  color: #FF5A5F;

  &.top-left {
    top: 10px;
    left: 10px;
  }

  &.bottom-right {
    bottom: 10px;
    right: 10px;
    transform: rotate(180deg);
  }
`;

const CardNumber = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #000000;
  color: #FF5A5F;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 800;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
`;

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, content, cardNumber }) => {
  return (
    <CardContainer>
      <CardHeader>{title}</CardHeader>
      <CardContent>{content}</CardContent>
      <CardPip className="top-left">C</CardPip>
      <CardPip className="bottom-right">C</CardPip>
      {cardNumber && <CardNumber>{cardNumber}</CardNumber>}
    </CardContainer>
  );
};

export default ChallengeCard; 