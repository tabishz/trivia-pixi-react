import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Game from './components/Game.js';
import GamePage from './GamePage.jsx';
import GameSetupPage from './GameSetupPage.jsx';
import './App.css';

function App() {
  const [game, setGame] = useState(null); // Lift the game state up to here
  const [, setSessionId] = useState(null); // Session ID
  const [gameSessions, setGameSessions] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <HomePage
              setGame={setGame}
              setGameSessions={setGameSessions}
              gameSessions={gameSessions}
              setSessionId={setSessionId}
            />
          }
        />
        <Route
          path='/game/:sessionId'
          element={<GameSetupPage game={game} />}
        />
        <Route
          path='/game/:sessionId'
          element={<GamePage game={game} />}
        />
      </Routes>
    </Router>
  );
}

function HomePage({ setGame, setGameSessions, gameSessions, setSessionId }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const startNewGame = () => {
    const newGame = new Game();
    setGame(newGame); // Store in state.
    setSessionId(newGame.sessionId); // Store in state.
    setGameSessions([...gameSessions, newGame]);
    navigate(`/game/${newGame.sessionId}`); // Redirect to the game page
  };

  const goToGameSession = (gameSessionId) => {
    const foundGame = gameSessions.find(gameSession => {
      return gameSession.sessionId === gameSessionId;
    });
    if (foundGame?.sessionId) {
      console.log(`Found game: ${foundGame.sessionId}`);
      setGame(foundGame);
      navigate(`/game/${gameSessionId}`);
    }
  };

  return (
    <div className='App'>
      <div className='title'>
        <h1>Return to Him</h1>
      </div>
      <div className='main'>
        <div className='gameSessions'>
          <ul className='gameSessions'>
            {gameSessions?.map((gameSession) => (
              <li
                key={gameSession.sessionId}
                onClick={() => goToGameSession(gameSession.sessionId)}
                className='gameSessions'
              >
                {gameSession.name}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={startNewGame} className='button-retro'>
          Start a New Game
        </button>
      </div>
    </div>
  );
}

// Define prop types for HomePage component
HomePage.propTypes = {
  setGame: PropTypes.func.isRequired, // 'setGame' is a function
  setGameSessions: PropTypes.func.isRequired, // 'setGameSessions' is a function
  gameSessions: PropTypes.array.isRequired, // 'gameSessions' is an array
  sessionId: PropTypes.string,
  setSessionId: PropTypes.func.isRequired,
};

export default App;
