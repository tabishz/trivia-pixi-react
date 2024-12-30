import { Container, Sprite, Stage } from '@pixi/react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icons from './components/icons';

function GamePage({ game }) {
  const stageRef = useRef(null); // Ref for the PIXI.js Stage
  const [iconScale, setIconScale] = useState(0.1);
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState({});
  const [baseHeight, setBaseHeight] = useState(window.innerHeight);
  const [baseWidth, setBaseWidth] = useState(window.innerWidth);
  const [baseLength, setBaseLength] = useState(
    Math.min(window.innerHeight, window.innerWidth),
  );
  // const { sessionId } = useParams();
  const navigate = useNavigate();

  /**
   * Returns the center coordinate for given rectable with corners coordinates
   * @param {Int8Array} coordinates x1, x2, y1, y2 coordinates in array
   * @return {Array} of [x, y] coordinates for center of the slot
   */
  const slotCenters = (coordinates) => {
    const [x1, x2, y1, y2] = coordinates;
    const x = (x1 + ((x2 - x1) / 2)) * baseLength;
    const y = (y1 + ((y2 - y1) / 2)) * baseLength;
    // Adjusted coordinates from center
    const xCenter = x - (baseLength / 2);
    const yCenter = y - (baseLength / 2);
    return [xCenter, yCenter];
  };

  /**
   * @param {Number} location An integer of player location (which is based on turns)
   * @returns {Array} [x,y] cordinates for player position on board
   */
  const calculatePositionFromSlotLocation = (location) => {
    const slot = location % 28; // Number of boxes on board
    const grid = [
      0,
      35 / 216,
      5 / 18,
      3 / 8,
      1 / 2,
      11 / 18,
      155 / 216,
      5 / 6,
      1,
    ];
    const topRow = grid.slice(0, 2);
    const second = grid.slice(1, 3);
    const third = grid.slice(2, 4);
    const fourth = grid.slice(3, 5);
    const fifth = grid.slice(4, 6);
    const sixth = grid.slice(5, 7);
    const seventh = grid.slice(6, 8);
    const bottomRow = grid.slice(7, 9);
    const rightCol = grid.slice(7, 9);
    const leftCol = grid.slice(0, 2);
    const slotCorners = [
      [...leftCol, ...bottomRow], // First Slot (0)
      [...second, ...bottomRow], // Second Slot (1)
      [...third, ...bottomRow], // Third Slot (2)
      [...fourth, ...bottomRow],
      [...fifth, ...bottomRow],
      [...sixth, ...bottomRow],
      [...seventh, ...bottomRow],
      [...rightCol, ...bottomRow], // Right Corner Slot (7)
      [...rightCol, ...seventh],
      [...rightCol, ...sixth],
      [...rightCol, ...fifth],
      [...rightCol, ...fourth],
      [...rightCol, ...third],
      [...rightCol, ...second],
      [...rightCol, ...topRow], // Top Right Slot (14)
      [...seventh, ...topRow],
      [...sixth, ...topRow],
      [...fifth, ...topRow],
      [...fourth, ...topRow],
      [...third, ...topRow],
      [...second, ...topRow],
      [...leftCol, ...topRow], // Top Left Slot (21)
      [...leftCol, ...second],
      [...leftCol, ...third],
      [...leftCol, ...fourth],
      [...leftCol, ...fifth],
      [...leftCol, ...sixth],
      [...leftCol, ...seventh], // Last Slot before Square One Slot (27)
    ];
    const centerCoords = slotCenters(slotCorners[slot]);
    return centerCoords;
  };

  const handlePlayerMove = (player) => {
    setPlayerPositions({
      ...playerPositions,
      [player.id]: {
        ...playerPositions[player.id],
        location: playerPositions[player.id].location + 1,
      },
    });
    console.log(`Increasing Player ${player.name} location by +1.`);
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
    // Initialize players with sprites and positions
    const playerPos = {};
    const initialPlayers = game.players.map(player => ({
      ...player,
      sprite: (
        <Sprite key={player.id} image={icons[player.icon]} anchor={0.5} />
      ),
      x: 0,
      y: 0,
    }));
    initialPlayers.forEach(player => {
      playerPos[player.id] = {
        location: player.location,
        slot: 0,
        x: player.x,
        y: player.y,
      };
    });
    setPlayerPositions(playerPos);
    setPlayers(initialPlayers);
  }, []);

  useEffect(() => {
    // Update icon positions when playerPositions change
    setPlayers(prevPlayers => (
      prevPlayers.map(player => {
        const newLocation = playerPositions[player.id]?.location || 0;
        const [xPos, yPos] = calculatePositionFromSlotLocation(newLocation);
        return { ...player, location: newLocation, x: xPos, y: yPos };
      })
    ));
  }, [playerPositions]);

  useEffect(() => {
    game.players = players;
  }, [players]);

  useEffect(() => {
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
    // Update sprite positions and sizes when players array changes
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({
        ...player,
        sprite: React.cloneElement(player.sprite, {
          scale: iconScale,
        }),
      }))
    );
  }, [iconScale]);

  const goHome = () => {
    window.removeEventListener('resize', handleWindowResize);
    navigate('/');
  };

  return (
    <div>
      <div className='score-matrix'>
        {/* Add a container for the score matrix */}
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map(player => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              anchor={0.5}
              height={baseLength}
              width={baseLength}
            />
            {players.map(player => (
              <Container
                key={player.id}
                position={[player.x, player.y]}
              >
                {player.sprite}
              </Container>
            ))}
          </Container>
        </Stage>
      </div>
      <div className='playerButtons'>
        {players.map((player) => (
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
