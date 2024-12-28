import { Container, Sprite, Stage } from '@pixi/react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icons from './components/icons';

function GamePage({ game }) {
  const stageRef = useRef(null); // Ref for the PIXI.js Stage
  const [iconScale, setIconScale] = useState(0.1);
  const [playerPositions, setPlayerPositions] = useState({});
  const [baseHeight, setBaseHeight] = useState(window.innerHeight);
  const [baseWidth, setBaseWidth] = useState(window.innerWidth);
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

  // Function to handle window resize
  const handleWindowResize = () => {
    const newBaseLength = Math.min(window.innerHeight, window.innerWidth);
    const newBaseHeight = window.innerHeight;
    const newBaseWidth = window.innerWidth;
    if (
      newBaseLength !== baseLength && Math.abs(newBaseLength - baseLength) > 2
    ) {
      setBaseLength(Math.min(window.innerHeight, window.innerWidth));
    }
    if (
      newBaseHeight !== baseHeight && Math.abs(newBaseHeight - baseHeight) > 2
    ) {
      setBaseHeight(window.innerHeight);
    }
    // console.log(`new baseWidth: ${newBaseWidth} | old: ${baseWidth}`);
    if (
      newBaseWidth !== baseWidth && Math.abs(newBaseWidth - baseWidth) > 2
    ) {
      setBaseWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    if (playerPositions[game.players[0].id] === undefined) {
      const positions = {};
      game.players.forEach(player => {
        positions[player.id] = { x: baseLength / 2, y: baseLength / 2 };
      });
      setPlayerPositions(positions);
      console.log('Setting player positions.');
      return;
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleWindowResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  // useEffect(() => {
  //   // recalculates Player Positions
  //   const newPositions = {};
  //   // Calculate scaling factors
  //   const scaleX = window.innerWidth / baseWidth;
  //   const scaleY = window.innerHeight / baseHeight;
  //   game.players.forEach(player => {
  //     newPositions[player.id] = {
  //       x: playerPositions[player.id].x +
  //         ((window.innerWidth - baseWidth) / 2),
  //       y: playerPositions[player.id].y +
  //         ((window.innerHeight - baseHeight) / 2),
  //     };
  //   });
  //   setPlayerPositions(newPositions);
  // }, [baseLength, baseHeight, baseWidth]);

  // Updates Icon Scale when baseLength changes
  useEffect(() => {
    setIconScale(baseLength / 10000);
  }, [baseLength]);

  useEffect(() => {
    // Load sprites after iconScale is calculated
    // console.log(`new Icon Scale: ${iconScale}`);
    game.players.forEach(player => {
      player.sprite = (
        <Sprite key={player.id} image={icons[player.icon]} scale={iconScale} />
      );
    });
  }, [iconScale]);

  const goHome = () => {
    window.removeEventListener('resize', handleWindowResize);
    navigate('/');
  };

  return (
    <div>
      <div>
        <Stage
          width={baseWidth}
          height={baseHeight}
          options={{ backgroundColor: 0xeef1f5 }}
          raf={false}
          renderOnComponentChange={true}
          ref={stageRef}
        >
          <Container
            position={[baseWidth / 2, baseHeight / 2]}
          >
            <Sprite
              image={'/images/board.jpg'}
              // position={{
              //   x: 0 - (baseHeight / 2),
              //   y: 0 - (baseHeight / 2),
              // }}
              anchor={0.5}
              height={baseLength}
              width={baseLength}
            />
            {game.players.map((player) => (
              <Container
                key={player.id}
                position={playerPositions[player.id] || { x: 0, y: 0 }}
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
        <button onClick={goHome} className='button-retro'>&#127968;</button>
      </div>
    </div>
  );
}

// Define the prop types for GamePage
GamePage.propTypes = {
  game: PropTypes.object, // Define 'game' as an object (or you can use a more specific shape)
};

export default GamePage;
