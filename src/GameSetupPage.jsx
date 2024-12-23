import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function GameSetupPage({ game }) {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Use ref to track the menu DOM element
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

  const handlePlayerOptions = (action) => {
    if (action === 'edit') {
      console.log(`Editing player: ${selectedPlayer.name}`);
      // Add your edit logic here
    } else if (action === 'delete') {
      console.log(`Deleting player: ${selectedPlayer.name}`);
      game.removePlayer(selectedPlayer.id);
    } else if (action === 'profile') {
      console.log(`Viewing profile of player: ${selectedPlayer.name}`);
      // Add your profile logic here
    }
    setShowMenu(false); // Hide the menu after action
  };

  const editPlayerRightClick = (event, player) => {
    event.preventDefault(); // Prevent default right-click menu
    setMenuPosition({ x: event.pageX, y: event.pageY }); // Set menu position near the click
    setSelectedPlayer(player); // Set the player whose tile was clicked
    setShowMenu(true); // Show the menu
  };

  // Close the menu if clicked outside
  const handleClickAnywhere = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false); // Close the menu if clicked outside
    }
  };

  // Add event listener to detect clicks outside the menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, []);

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Game Session: {sessionId}</h1>
      <div id='setup'>
        <input
          type='text'
          placeholder='Player Name'
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyDown={handleKeyDown}
          className='input-30'
        />
        <button
          onClick={addPlayer}
          disabled={!playerName}
          className='button-30'
        >
          Add Player
        </button>
        <ul className='players'>
          {game?.getPlayers().map(player => (
            <li
              className='players'
              key={player.id}
              onContextMenu={(e) => editPlayerRightClick(e, player)}
            >
              {player.name}
            </li>
          ))}
        </ul>
        {showMenu && (
          <div
            ref={menuRef} // Attach the ref to the menu element
            className='popup-menu'
            style={{
              position: 'absolute',
              top: menuPosition.y,
              left: menuPosition.x,
              background: '#fff',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 1000,
            }}
          >
            <ul>
              <li onClick={() => handlePlayerOptions('edit')}>Edit</li>
              <li onClick={() => handlePlayerOptions('delete')}>Delete</li>
              <li onClick={() => handlePlayerOptions('profile')}>
                View Profile
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className='bottom'>
        <button onClick={goHome} className='button-30'>Back to Home</button>
      </div>
    </div>
  );
}

// Define the prop types for GameSetupPage
GameSetupPage.propTypes = {
  game: PropTypes.object, // Define 'game' as an object (or you can use a more specific shape)
};

export default GameSetupPage;