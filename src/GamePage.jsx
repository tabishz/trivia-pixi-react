import { useEffect, useState, } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import Game from './components/Game';

function GamePage() {
  const { sessionId, } = useParams();
  const [playerName, setPlayerName,] = useState('',);
  const [game, setGame,] = useState(null,);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the game object using the sessionId here.
    // For now, I'm creating a placeholder as you will need backend or global state to persist data
    const newGame = new Game();
    newGame.generateSessionId(); // To avoid id collisions but we will ignore this
    setGame(newGame,);
  }, [sessionId,],);

  const addPlayer = () => {
    if (game && playerName) {
      game.addPlayer(playerName, game.getPlayers().length + 1,);
      setPlayerName('',);
    }
  };

  const handleKeyDown = (event,) => {
    if (event.key === 'Enter') {
      addPlayer();
    }
  };

  const goHome = () => {
    navigate('/',);
  };

  return (
    <div>
      <h1>Game Session: {sessionId}</h1>
      <input
        type='text'
        placeholder='Player Name'
        value={playerName}
        onChange={e => setPlayerName(e.target.value,)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={addPlayer} disabled={!playerName}>Add Player</button>
      <ul>
        {game?.getPlayers().map(player => <li key={player.id}>{player.name}
        </li>)}
      </ul>

      <div className='bottom'>
        <button onClick={goHome}>Back to Home</button>
      </div>
    </div>
  );
}

export default GamePage;
