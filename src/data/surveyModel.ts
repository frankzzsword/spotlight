import { Model } from 'survey-core';

// Create a simplified survey model to debug navigation issues
export const createSurveyModel = (): Model => {
  const json = {
    title: "SIMPLIFIED TEST SURVEY",
    description: "Testing survey navigation",
    showProgressBar: "top",
    firstPageIsStarted: true,
    startSurveyText: "START GAME",
    showNavigationButtons: true, // Explicitly show navigation buttons
    goNextPageAutomatic: false, // Disable automatic navigation
    focusFirstQuestionAutomatic: false, // Prevent focus issues
    checkErrorsMode: "onValueChanged", // More lenient error checking
    pages: [
      // Start page
      {
        name: "introPage",
        title: "Welcome to the Test Survey",
        description: "Please click the START button below to begin",
        elements: [
          {
            type: "html",
            name: "intro_text",
            html: `<div style="text-align: center; padding: 20px; background-color: white; border: 3px solid black; margin: 20px;">
              <h2 style="color: black; font-size: 24px;">Welcome to the Test Survey</h2>
              <p style="color: black; font-size: 18px;">This is a simplified survey to test navigation.</p>
              <p style="color: black; font-size: 18px; margin-top: 30px;">Click the START button below to begin.</p>
            </div>`
          }
        ]
      },
      // Question page 1
      {
        name: "page1",
        title: "Page 1",
        elements: [
          {
            type: "radiogroup",
            name: "question1",
            title: "This is question 1 on page 1",
            isRequired: false,
            choices: [
              "Option 1",
              "Option 2",
              "Option 3"
            ]
          }
        ]
      },
      // Question page 2
      {
        name: "page2",
        title: "Page 2",
        elements: [
          {
            type: "radiogroup",
            name: "question2",
            title: "This is question 2 on page 2",
            isRequired: false,
            choices: [
              "Option A",
              "Option B",
              "Option C"
            ]
          }
        ]
      },
      // Final page
      {
        name: "finalPage",
        title: "Final Page",
        elements: [
          {
            type: "html",
            name: "final_text",
            html: `<div style="text-align: center; padding: 20px; background-color: white; border: 3px solid black; margin: 20px;">
              <h2 style="color: black; font-size: 24px;">Thank you!</h2>
              <p style="color: black; font-size: 18px;">You have completed the test survey.</p>
            </div>`
          }
        ]
      }
    ]
  };

  // Create the model
  const survey = new Model(json);
  
  // Add event handlers for debugging
  survey.onValueChanged.add((sender, options) => {
    console.log(`Value of ${options.name} changed to:`, options.value);
  });
  
  survey.onCurrentPageChanging.add((sender, options) => {
    console.log(`Page changing from ${sender.currentPageNo} to ${options.newCurrentPage.visibleIndex}`);
  });
  
  survey.onCurrentPageChanged.add((sender) => {
    console.log(`Page changed to ${sender.currentPageNo}`);
  });

  return survey;
}; 