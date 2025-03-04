import React from 'react';
import { Squares } from './ui/squares-background';

interface SquaresBackgroundProps {
  children?: React.ReactNode;
}

const SquaresBackground: React.FC<SquaresBackgroundProps> = ({ children }) => {
  return (
    <div className="squares-background-container" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1,
      pointerEvents: 'auto',
      backgroundColor: '#000000'
    }}>
      <Squares
        direction="down"
        speed={0.5}
        squareSize={40}
        borderColor="#454545

"
        hoverFillColor="#222"
      />
      {children}
    </div>
  );
};

export default SquaresBackground; 