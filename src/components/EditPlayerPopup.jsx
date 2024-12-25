import PropTypes from 'prop-types';

// --- EditPlayerPopup Component ---
function EditPlayerPopup(
  {
    isEditing,
    setIsEditing,
    playerName,
    setPlayerName,
    handleNameChange,
    saveNewName,
  },
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
        <button
          onClick={() => {
            setPlayerName('');
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
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

export default EditPlayerPopup;
