import PropTypes from 'prop-types';

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

export default PlayerContextMenu;
