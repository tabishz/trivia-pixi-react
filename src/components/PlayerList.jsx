import PropTypes from 'prop-types';
import icons from './icons.js';

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

export default PlayerList;
