import { Container, Sprite, Stage, Texture } from '@pixi/react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import icons from './components/icons';

function GamePage({ game }) {
  const [iconScale, setIconScale] = useState(0.1);
  const [playerPositions, setPlayerPositions] = useState({ x: 0, y: 0 });
  const [baseLength, setBaseLength] = useState(
    Math.min(window.innerHeight, window.innerWidth),
  );
  // const { sessionId } = useParams();
  const navigate = useNavigate();

  const handlePlayerMove = (player) => {
    setPlayerPositions(prevPositions => ({
      ...prevPositions,
      [player.id]: {
        ...prevPositions[player.id],
        x: (prevPositions[player.id]?.x || 0) + 10,
      },
    }));
    console.log(`Increasing Player ${player.name} x value to: ${player.x}`);
  };

  useEffect(() => {
    // Calculate initial scale on component mount
    setIconScale(Math.min(window.innerWidth, window.innerHeight) / 10000);
    // Function to handle window resize
    const handleResize = () => {
      setIconScale(Math.min(window.innerWidth, window.innerHeight) / 10000);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Load sprites after iconScale is calculated
    game.players.forEach(player => {
      player.sprite = <Sprite image={icons[player.icon]} scale={iconScale} />;
    });
  }, [iconScale]);

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
          <Container
            position={[window.innerWidth / 2, window.innerHeight / 2]}
          >
            <Sprite
              image={'/images/sample-board.png'}
              position={{
                x: 0 - (window.innerHeight / 2),
                y: 0 - (window.innerHeight / 2),
              }}
              height={window.innerHeight}
              width={window.innerHeight}
            />
          </Container>
          <Container position={[window.innerWidth / 2, window.innerHeight / 2]}>
            {game.players.map((player) => (
              <Container
                key={player.id}
                position={playerPositions[player.id]}
              >
                {player.sprite}
              </Container>
            ))}
          </Container>
        </Stage>
      </div>
      <div className='playerButtons'>
        {game.players.map((player) => (
          <button
            key={player.id}
            onClick={() => handlePlayerMove(player)}
          >
            Move Player {player.name}
          </button>
        ))}
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
