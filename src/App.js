import { useState, } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Game from './components/Game';
import GamePage from './GamePage'; //
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/game/:sessionId' element={<GamePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const [game, setGame,] = useState(null,); // Lift the game state up to here
  const [sessionId, setSessionId,] = useState(null,); // Session ID
  const navigate = useNavigate(); // Initialize useNavigate

  const startGame = () => {
    const newGame = new Game();
    const id = newGame.generateSessionId();
    setGame(newGame,); // Store in state.
    setSessionId(id,); // Store in state.
    navigate(`/game/${id}`,); // Redirect to the game page
  };

  return (
    <div className='App'>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default App;
