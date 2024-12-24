import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import icons from './components/icons.js';

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

  // --- PlayerList Component ---
  function PlayerList({ players, onPlayerRightClick }) {
    return (
      <ul className='players'>
        {players.map(player => (
          <li
            className='players'
            key={player.id}
            onContextMenu={(e) => onPlayerRightClick(e, player)}
          >
            <img
              className='players'
              src={icons[player.icon]}
              alt={player.name}
            />
            {player.name}
          </li>
        ))}
      </ul>
    );
  }

  PlayerList.propTypes = {
    players: PropTypes.array.isRequired,
    onPlayerRightClick: PropTypes.func.isRequired,
  };

  // --- PlayerContextMenu Component ---
  function PlayerContextMenu({
    showMenu,
    menuPosition,
    handlePlayerOptions,
    menuRef,
  }) {
    if (!showMenu) { return null; }

    return (
      <div
        ref={menuRef}
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
          <li onClick={() => handlePlayerOptions('icon')}>Select Icon</li>
        </ul>
      </div>
    );
  }

  PlayerContextMenu.propTypes = {
    showMenu: PropTypes.bool.isRequired,
    menuPosition: PropTypes.object.isRequired,
    handlePlayerOptions: PropTypes.func.isRequired,
    menuRef: PropTypes.object.isRequired,
  };

  // --- EditPlayerPopup Component ---
  function EditPlayerPopup(
    { isEditing, playerName, handleNameChange, saveNewName },
  ) {
    if (!isEditing) { return null; }

    return (
      <div className='edit-popup'>
        <div className='popup-content'>
          <h3>Edit Player Name</h3>
          <input
            type='text'
            value={playerName}
            onChange={handleNameChange}
            maxLength={16}
          />
          <button onClick={saveNewName}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  EditPlayerPopup.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    playerName: PropTypes.string.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    saveNewName: PropTypes.func.isRequired,
  };

  // --- IconSelectionMenu Component ---
  function IconSelectionMenu(
    { showIconMenu, icons, chosenIcons, handleIconSelect },
  ) {
    if (!showIconMenu) { return null; }

    return (
      <div className='icon-menu'>
        <h3>Select an Icon</h3>
        <div className='icon-grid'>
          {Object.keys(icons).filter(icon => !chosenIcons.includes(icon)).map((
            iconName,
          ) => (
            <img
              key={iconName}
              src={icons[iconName]}
              alt={iconName}
              onClick={() => handleIconSelect(iconName)}
            />
          ))}
        </div>
        <button onClick={() => setShowIconMenu(false)} className='button-30'>
          Cancel
        </button>
      </div>
    );
  }

  IconSelectionMenu.propTypes = {
    showIconMenu: PropTypes.bool.isRequired,
    icons: PropTypes.object.isRequired,
    chosenIcons: PropTypes.array.isRequired,
    handleIconSelect: PropTypes.func.isRequired,
  };

  return (
    <div>
      <h1>{game.name}</h1>
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
          playerName={playerName}
          handleNameChange={handleNameChange}
          saveNewName={saveNewName}
        />

        <IconSelectionMenu
          showIconMenu={showIconMenu}
          icons={icons}
          chosenIcons={game?.chosenIcons || []}
          handleIconSelect={handleIconSelect}
        />
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
