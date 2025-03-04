# Spotlight Survey

A simple React application for collecting survey data about the Spotlight card game.

## Features

- Collects user feedback on game cards and features
- Stores data in localStorage
- Automatically creates a downloadable JSON file with results after survey completion
- No server or database required - works entirely in the browser

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Application

Start the development server:
```
npm start
```
or
```
yarn start
```

The application will open in your default browser at http://localhost:3000.

### Building for Production

To create a production build:
```
npm run build
```
or
```
yarn build
```

The build files will be created in the `build` directory and can be deployed to any static hosting service.

## How it Works

1. Users complete the survey form in the browser
2. Upon submission, the data is saved to localStorage
3. A JSON file containing all survey responses is automatically downloaded
4. This JSON file can be used for further analysis or processing

## Project Structure

- `src/components/SimpleSurvey.tsx` - Main survey component
- `src/api/surveyData.js` - Handles saving and loading survey data
- `src/App.tsx` - Main application component

## License

This project is licensed under the MIT License - see the LICENSE file for details.
