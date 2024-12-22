import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Game from './components/Game.js';
import GamePage from './GamePage.jsx'; //
import './App.css';

function App() {
  const [game, setGame] = useState(null); // Lift the game state up to here
  const [sessionId, setSessionId] = useState(null); // Session ID
  const [gameSessions, setGameSessions] = useState([]); // game sessions

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
        <Route path='/game/:sessionId' element={<GamePage game={game} />} />
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

  return (
    <div className='App'>
      <div>
        <ul>
          {gameSessions.map((gameSession) => (
            <li
              key={gameSession.sessionId}
              onClick={() => navigate(`/game/${gameSession.sessionId}`)}
              className='gameSessionLink'
            >
              {gameSession.sessionId}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={startNewGame}>Start a New Game</button>
    </div>
  );
}

// Define prop types for HomePage component
HomePage.propTypes = {
  setGame: PropTypes.func.isRequired, // 'setGame' is a function
  setGameSessions: PropTypes.func.isRequired, // 'setGameSessions' is a function
  gameSessions: PropTypes.array.isRequired, // 'gameSessions' is an array
  setSessionId: PropTypes.func.isRequired,
};

export default App;
