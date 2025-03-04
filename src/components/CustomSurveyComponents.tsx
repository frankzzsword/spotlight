import React from 'react';
import { ReactQuestionFactory, SurveyQuestionElementBase } from 'survey-react-ui';
import { Question, PanelModel } from 'survey-core';
import SpotCard from './SpotCard';
import ChallengeCard from './ChallengeCard';

// Interface for question props
interface QuestionProps {
  question: Question;
  css: any;
  isDisplayMode: boolean;
}

// Custom component for rendering Spot Cards
export const SpotCardComponent: React.FC<QuestionProps> = ({ question }) => {
  const content = question.contentPanel?.getQuestionByName("spot_content")?.html || "";
  const cardTitle = question.title || "Spot Card";
  
  // Clean content text from HTML tags
  const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  
  return (
    <div className="custom-spot-card-wrapper">
      <SpotCard 
        title={cardTitle}
        content={cleanContent}
        cardNumber={question.cardNumber as number}
      />
      <div className="survey-questions">
        {question.contentPanel && ReactQuestionFactory.Instance.createQuestion(question.contentPanel, {})}
      </div>
    </div>
  );
};

// Custom component for rendering Challenge Cards
export const ChallengeCardComponent: React.FC<QuestionProps> = ({ question }) => {
  const content = question.contentPanel?.getQuestionByName("challenge_content")?.html || "";
  const cardTitle = question.title || "Challenge Card";
  
  // Clean content text from HTML tags
  const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  
  return (
    <div className="custom-challenge-card-wrapper">
      <ChallengeCard 
        title={cardTitle}
        content={cleanContent}
        cardNumber={question.cardNumber as number}
      />
      <div className="survey-questions">
        {question.contentPanel && ReactQuestionFactory.Instance.createQuestion(question.contentPanel, {})}
      </div>
    </div>
  );
};

// Custom component for rendering custom panel
export const CustomPanelComponent: React.FC<QuestionProps> = ({ question }) => {
  // Detect if it's a spot or challenge card by the panel CSS class
  const isSpotCard = question.cssClasses?.panel?.includes('card-spot');
  const isChallengeCard = question.cssClasses?.panel?.includes('card-challenge');
  
  // Get content HTML from the first HTML element if it exists
  const htmlElements = question.elements?.filter((el: any) => el.getType() === 'html') || [];
  const contentHtml = htmlElements.length > 0 ? htmlElements[0].html : '';
  
  // Clean content text from HTML tags
  const cleanContent = contentHtml.replace(/<div class='card-text'>(.*?)<\/div>/g, '$1');
  
  if (isSpotCard) {
    return (
      <div className="custom-panel-wrapper">
        <SpotCard 
          title={question.title || "Spot Card"}
          content={cleanContent}
        />
        <div className="survey-panel-questions">
          {question.elements?.map((element: any, index: number) => {
            // Skip HTML elements that we already used for the card content
            if (element.getType() !== 'html') {
              return (
                <div key={index} className="panel-question">
                  {ReactQuestionFactory.Instance.createQuestion(element, {})}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  } else if (isChallengeCard) {
    return (
      <div className="custom-panel-wrapper">
        <ChallengeCard 
          title={question.title || "Challenge Card"}
          content={cleanContent}
        />
        <div className="survey-panel-questions">
          {question.elements?.map((element: any, index: number) => {
            // Skip HTML elements that we already used for the card content
            if (element.getType() !== 'html') {
              return (
                <div key={index} className="panel-question">
                  {ReactQuestionFactory.Instance.createQuestion(element, {})}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
  
  // If not a specially styled card, render the default panel
  return <SurveyQuestionElementBase question={question} />;
};

// Register custom components
export const registerCustomComponents = () => {
  // Hack to add a custom renderer - recreate the panel renderer
  const originalCreateQuestion = ReactQuestionFactory.Instance.createQuestion;
  ReactQuestionFactory.Instance.createQuestion = function(question: any, options: any) {
    if (question && typeof question.getType === 'function' && question.getType() === 'panel') {
      const panelQuestion = question as PanelModel;
      const isPanelQuestion = panelQuestion.cssClasses?.panel?.includes('card-spot') || 
                             panelQuestion.cssClasses?.panel?.includes('card-challenge');
      
      if (isPanelQuestion) {
        return <CustomPanelComponent question={panelQuestion as unknown as Question} css={{}} isDisplayMode={false} />;
      }
    }
    return originalCreateQuestion.call(this, question, options);
  };
};

export default registerCustomComponents; 