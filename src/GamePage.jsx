import { Container, Sprite, Stage } from '@pixi/react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import icons from './components/icons';

function GamePage({ game }) {
  const { sessionId } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;

    // ... (add the box, grid, and text elements to app.stage)
  }, []);

  const loadSprites = () => {
    game.players.forEach(player => {
      player.sprite = <Sprite image={icons[player.icon]} />;
    });
  };
  loadSprites();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          options={{ backgroundColor: 0xeef1f5 }}
        >
          <Container position={[400, 400]}>
            {game.players[1].sprite}
          </Container>
        </Stage>
      </div>
      <div className='bottom'>
        <button onClick={goHome} className='button-retro'>Back to Home</button>
      </div>
    </div>
  );
}

// Define the prop types for GamePage
GamePage.propTypes = {
  game: PropTypes.object, // Define 'game' as an object (or you can use a more specific shape)
};

export default GamePage;
