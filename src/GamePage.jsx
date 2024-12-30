import { Container, Sprite, Stage } from '@pixi/react';
import { gsap } from 'gsap';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icons from './components/icons';

function GamePage({ game }) {
  const stageRef = useRef(null); // Ref for the PIXI.js Stage
  const [iconScale, setIconScale] = useState(0.1);
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [readyForNextTurn, setReadyForNextTurn] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
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

  // const handlePlayerMove = (player, moveBy = 1) => {
  //   setPlayerPositions({
  //     ...playerPositions,
  //     [player.id]: {
  //       ...playerPositions[player.id],
  //       location: playerPositions[player.id].location + moveBy,
  //     },
  //   });
  //   console.log(`Increasing Player ${player.name} location by +${moveBy}.`);
  // };

  const animatePlayerMovement = (player, moveBy) => {
    setReadyForNextTurn(false); // Disable Next Turn button

    let currentLocation = playerPositions[player.id].location;

    // GSAP timeline for the animation
    const tl = gsap.timeline({
      onComplete: () => {
        setReadyForNextTurn(true); // Enable Next Turn button after animation
      },
    });

    for (let i = 1; i <= moveBy; i++) {
      const newLocation = currentLocation + i;
      const [xPos, yPos] = calculatePositionFromSlotLocation(newLocation);

      tl.to(player, {
        duration: 0.2, // 200ms per slot
        x: xPos,
        y: yPos,
        onUpdate: () => {
          // Update playerPositions state during the animation
          setPlayerPositions(prevPositions => ({
            ...prevPositions,
            [player.id]: { ...prevPositions[player.id], location: newLocation },
          }));
        },
      });
    }
  };

  const handlePlayerTurn = () => {
    // 1. Roll the die (generate a random number between 1 and 6)
    const newDiceResult = Math.floor(Math.random() * 6) + 1;
    setDiceResult(newDiceResult);
    // 2. Update player location based on die roll (using your existing logic)
    // handlePlayerMove(players[currentPlayer], newDiceResult);
    // Animate the player movement over the slots
    animatePlayerMovement(players[currentPlayer], newDiceResult);
    // 3. Enable Next Turn Button
    setReadyForNextTurn(true);
  };

  const handleNextTurn = () => {
    setCurrentPlayer(prevPlayer => (prevPlayer + 1) % game.players.length);
    setDiceResult(null);
    setReadyForNextTurn(false);
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
        x: player.x,
        y: player.y,
      };
    });
    setPlayerPositions(playerPos);
    setPlayers(initialPlayers);
  }, []);

  const calculateIconOffset = (indexInSlot, numPlayers) => {
    if (numPlayers == 2) {
      return {
        xOff: (indexInSlot - (numPlayers - 1) / 2) * (baseLength * 0.04),
        yOff: 0,
      };
    }
    if (numPlayers > 2 && numPlayers < 7) {
      let yOff = 0;
      if ([0, 1].includes(indexInSlot)) {
        yOff = baseLength * 0.05;
      }
      if ([2, 3].includes(indexInSlot)) {
        yOff = -0.3 * baseLength * 0.05;
      }
      if ([4, 5].includes(indexInSlot)) {
        yOff = -0.1 * baseLength * 0.5;
      }
      return {
        xOff: (indexInSlot % 2) * (baseLength * 0.05),
        yOff: yOff,
      };
    }
    if (numPlayers >= 7) {
      return {
        xOff: 0,
        yOff: 0,
      };
    }
  };

  useEffect(() => {
    // Update icon positions when playerPositions change
    setPlayers(prevPlayers => {
      const playersByLocation = {};
      prevPlayers.forEach(player => {
        const location = playerPositions[player.id]?.location || 0;
        if (!playersByLocation[location]) {
          playersByLocation[location] = [];
        }
        playersByLocation[location].push(player.id);
      });
      return prevPlayers.map(player => {
        const newLocation = playerPositions[player.id]?.location || 0;
        const playersInSlot = playersByLocation[newLocation]; // Array of players in the slot
        const numPlayers = playersInSlot.length;
        let newScale = iconScale;
        // Adjust position to distribute players evenly in the slot
        const indexInSlot = playersInSlot.indexOf(player.id);
        let xOff = 0;
        let yOff = 0;
        if (numPlayers > 1) {
          const offset = calculateIconOffset(indexInSlot, numPlayers);
          xOff = offset.xOff;
          yOff = offset.yOff;
          newScale = newScale * Math.sqrt(numPlayers / 5);
        }
        const [xPos, yPos] = calculatePositionFromSlotLocation(newLocation);
        return {
          ...player,
          sprite: React.cloneElement(player.sprite, { scale: newScale }),
          location: newLocation,
          x: xPos + xOff,
          y: yPos + yOff,
        };
      });
    });
  }, [playerPositions, baseLength]);

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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [readyForNextTurn, diceResult]);

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

  const handleKeyDown = (event) => {
    if (event.key === ' ' && readyForNextTurn) {
      console.log(`[SPACEBAR] pressed. Next Turn? ${readyForNextTurn}`);
      if (readyForNextTurn) {
        handleNextTurn();
      }
    }
    if ((event.key === 'r' || event.key === 'R') && !readyForNextTurn) {
      console.log(`[${event.key}] pressed. Next Turn? ${readyForNextTurn}`);
      handlePlayerTurn();
    }
  };

  return (
    <div className='gamePage'>
      <div className='score-matrix'>
        {/* Add a container for the score matrix */}
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th></th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map(player => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>
                  <img className='mini-icons' src={icons[player.icon]} />
                </td>
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
      <div className='game-ui'>
        <div>
          <p>
            Current Player: {game.players[currentPlayer]?.name}{' '}
            <img
              className='mini-icons'
              src={icons[game.players[currentPlayer]?.icon]}
            />
          </p>
          {diceResult && <p>Dice Roll: {diceResult}</p>}
          {readyForNextTurn && (
            <button onClick={handleNextTurn}>
              Next Turn
            </button>
          )}
          {!readyForNextTurn && (
            <button onClick={handlePlayerTurn}>Roll Dice</button>
          )}
        </div>
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
