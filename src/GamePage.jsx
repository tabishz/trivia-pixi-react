import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function GamePage({ game }) {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const addPlayer = () => {
    if (game && playerName) {
      game.addPlayer(playerName, game.getPlayers().length + 1);
      setPlayerName('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addPlayer();
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Game Session: {sessionId}</h1>
      <input
        type='text'
        placeholder='Player Name'
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
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

// Define the prop types for GamePage
GamePage.propTypes = {
  game: PropTypes.object, // Define 'game' as an object (or you can use a more specific shape)
};

export default GamePage;
