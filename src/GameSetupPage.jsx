import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EditPlayerPopup from './components/EditPlayerPopup.jsx';
import icons from './components/icons.js';
import IconSelectionMenu from './components/IconSelectionMenu.jsx';
import PlayerContextMenu from './components/PlayerContextMenu.jsx';
import PlayerList from './components/PlayerList.jsx';

function GameSetupPage({ game }) {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if we're editing
  const [showIconMenu, setShowIconMenu] = useState(false);
  const menuRef = useRef(null); // Use ref to track the menu DOM element
  const navigate = useNavigate();

  const addPlayer = () => {
    if (game && playerName) {
      game.addPlayer(playerName);
      setPlayerName('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (isEditing) {
        saveNewName();
      } else {
        addPlayer();
      }
    }
  };

  const handlePlayerOptions = (action) => {
    if (action === 'edit') {
      console.log(`Editing player: ${selectedPlayer.name}`);
      setIsEditing(true);
      setPlayerName(selectedPlayer.name);
    } else if (action === 'delete') {
      console.log(`Deleting player: ${selectedPlayer.name}`);
      game.removePlayer(selectedPlayer.id);
    } else if (action === 'icon') {
      console.log(`Select icon for player: ${selectedPlayer.name}`);
      setShowIconMenu(true);
    }
    setShowMenu(false); // Hide the menu after action
  };

  // Handle the name change
  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  // Save the new player name
  const saveNewName = () => {
    game.setPlayerName(playerName, selectedPlayer.id);
    setIsEditing(false); // Close the edit pop-up
    setPlayerName('');
  };

  const handleIconSelect = (iconName) => {
    game.setPlayerIcon(iconName, selectedPlayer.id);
    setShowIconMenu(false);
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

  const startGame = () => {
    navigate(`/play/${sessionId}`);
  };

  return (
    <div>
      <div id='setup'>
        <h1>{game.name}</h1>
        <input
          type='text'
          placeholder='Player Name'
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyDown={handleKeyDown}
          className='input-flat-shadow'
        />
        <button
          onClick={addPlayer}
          disabled={!playerName}
          className='button-retro'
        >
          Add Player
        </button>

        <PlayerList
          players={game?.getPlayers()}
          onPlayerRightClick={editPlayerRightClick}
        />

        <PlayerContextMenu
          showMenu={showMenu}
          menuPosition={menuPosition}
          handlePlayerOptions={handlePlayerOptions}
          menuRef={menuRef}
        />

        <EditPlayerPopup
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          playerName={playerName}
          setPlayerName={setPlayerName}
          handleNameChange={handleNameChange}
          saveNewName={saveNewName}
        />

        <IconSelectionMenu
          showIconMenu={showIconMenu}
          setShowIconMenu={setShowIconMenu}
          icons={icons}
          chosenIcons={game?.chosenIcons || []}
          handleIconSelect={handleIconSelect}
        />

        {game.players.length > 1 && (
          <button className='button-retro' onClick={startGame}>
            Start Game!
          </button>
        )}
      </div>

      <div className='bottom'>
        <button onClick={goHome} className='button-retro'>Back to Home</button>
      </div>
    </div>
  );
}

// Define the prop types for GameSetupPage
GameSetupPage.propTypes = {
  game: PropTypes.object, // Define 'game' as an object (or you can use a more specific shape)
};

export default GameSetupPage;
