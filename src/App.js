import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { v7 as uuidv7 } from 'uuid';

import Game from './components/Game.js';
import GamePage from './GamePage.jsx';
import GameSetupPage from './GameSetupPage.jsx';
import './App.css';

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
    if (c.indexOf(nameEQ) == 0) { return c.substring(nameEQ.length, c.length); }
  }
  return null;
}

const getOrCreateCookie = () => {
  // Check if a user_id cookie already exists
  const existingUUID = getCookie('user_id');

  if (!existingUUID) {
    // If no cookie exists, generate a new UUID
    const userUUID = uuidv7();

    // Set the new UUID cookie
    document.cookie = `user_id=${userUUID}; expires=${
      new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString()
    }; path=/`;
    return userUUID;
  } else {
    // Use the existing UUID
    console.log('Using existing UUID:', existingUUID);
    return existingUUID;
  }
};

function App() {
  const [game, setGame] = useState(null); // Lift the game state up to here
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
            />
          }
        />
        <Route
          path='/game/:sessionId'
          element={<GameSetupPage game={game} />}
        />
        <Route
          path='/play/:sessionId'
          element={<GamePage game={game} />}
        />
      </Routes>
    </Router>
  );
}

function HomePage({ setGame, setGameSessions, gameSessions }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const startNewGame = () => {
    const userCookieID = getOrCreateCookie();
    const newGame = new Game({ createdBy: userCookieID });
    setGame(newGame); // Store in state.
    setGameSessions([...gameSessions, newGame]);
    navigate(`/game/${newGame.sessionId}`); // Redirect to the game page
  };

  const goToGameSession = (gameSessionId) => {
    const foundGame = gameSessions.find(gameSession =>
      gameSession.sessionId === gameSessionId
    );
    if (foundGame?.sessionId) {
      setGame(foundGame);
      navigate(`/game/${foundGame.sessionId}`);
    }
  };

  return (
    <div className='App'>
      <div className='title'>
        <h1>
          Thaqlain <span id='challenge'>Challenge</span>
        </h1>
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
};

export default App;
