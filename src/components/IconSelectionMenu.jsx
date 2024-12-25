import PropTypes from 'prop-types';

// --- IconSelectionMenu Component ---
function IconSelectionMenu(
  { showIconMenu, setShowIconMenu, icons, chosenIcons, handleIconSelect },
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

export default IconSelectionMenu;
