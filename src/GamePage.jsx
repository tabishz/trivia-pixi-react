import { Container, Sprite, Stage } from '@pixi/react';
import { gsap } from 'gsap';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icons from './components/icons';

const NUM_OF_SLOTS = 28;

function GamePage({ game }) {
  game.startGame();
  const stageRef = useRef(null); // Ref for the PIXI.js Stage
  const [iconScale, setIconScale] = useState(0.1);
  // const [players, setPlayers] = useState(game.players);
  // const [currentPlayer, setCurrentPlayer] = useState(0);
  const [readyForNextTurn, setReadyForNextTurn] = useState(
    game.readyForNextTurn,
  );
  const [diceResult, setDiceResult] = useState(null);
  const [showGameControls, setShowGameControls] = useState(
    game.showGameControls,
  );
  const [showCard, setShowCard] = useState(game.showCard);
  const [showAnswer, setShowAnswer] = useState(game.showAnswer);
  const [cardData, setCardData] = useState(game.cardData);
  const [extraTurn, setExtraTurn] = useState(game.extraTurn);
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
    const slot = location % NUM_OF_SLOTS; // Number of boxes on board
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

  const updatePlayerLocations = () => {
    // TODO: use Game functions to update Player Objects
    // Update icon positions when playerPositions change
    const playersByLocation = {};
    game.players.forEach(player => {
      const newLocation = playerPositions[player.id].location;
      if (!playersByLocation[newLocation]) {
        playersByLocation[newLocation] = [];
      }
      playersByLocation[newLocation].push(player.id);
    });
    game.players.forEach(player => {
      const newLocation = playerPositions[player.id].location;
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
      player.sprite = React.cloneElement(player.sprite, {
        scale: newScale,
      });
      player.location = newLocation;
      player.x = xPos + xOff;
      player.y = yPos + yOff;
    });
  };

  const initPlayerPositions = () => {
    // Initialize players with sprites and positions
    const playerPos = {};
    game.players.forEach(player => {
      player.sprite = (
        <Sprite
          key={player.id}
          image={icons[player.icon]}
          anchor={0.5}
          scale={iconScale}
        />
      );
      const [playerX, playerY] = calculatePositionFromSlotLocation(
        player.location,
      );
      playerPos[player.id] = {
        location: player.location,
        x: playerX,
        y: playerY,
      };
      // player.x = playerX;
      // player.y = playerY;
    });
    return playerPos;
  };
  const [playerPositions, setPlayerPositions] = useState(initPlayerPositions());

  const animatePlayerMovement = async (player, moveBy) => {
    setReadyForNextTurn(false); // Disable Next Turn button
    game.readyForNextTurn = false;
    let currentLocation = playerPositions[player.id].location;

    // GSAP timeline for the animation
    await new Promise(resolve => {
      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
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
              [player.id]: {
                ...prevPositions[player.id],
                location: newLocation,
              },
            }));
          },
        });
      }
    });
  };

  const handleAnswerResult = (isCorrect) => {
    game.question.respond(isCorrect);
    if (isCorrect) {
      game.players[game.currentPlayer].incrementScore();
    }
    game.question.setAnsweredBy(game.players[game.currentPlayer].id);
    game.answerQuestion();
    game.clearQuestion();
    setShowAnswer(false);
    game.showAnswer = false;
    setShowCard(false);
    game.showCard = false;
    setCardData(null);
    game.cardData = null;
    setShowGameControls(true);
    game.showGameControls = true;
  };

  const handleAnswerClick = () => {
    setShowAnswer(true); // Show the answer
  };

  const displayQuestionCard = (player) => {
    // TODO: use slot# to get Card Category
    const slot = player.location % NUM_OF_SLOTS;
    console.log('Slot:', slot);
    setShowGameControls(false);
    game.showGameControls = false;
    game.question = game.getNextQuestion();
    const category = game.question.category;
    const question = game.question.question;
    const answer = game.question.answer;
    const cData = { category: category, question: question, answer: answer };
    setCardData(cData);
    game.cardData = cData;
    setShowCard(true);
    game.showCard = true;
  };

  const handlePlayerTurn = async () => {
    // TODO: use Game class functions to update players.
    // TODO: add function to store player turn history
    const player = game.getCurrentPlayer();
    // 1. Roll the die (generate a random number between 1 and 6)
    const newDiceResult = Math.floor(Math.random() * 6) + 1;
    setDiceResult(newDiceResult);
    if (newDiceResult === 6) {
      setExtraTurn(true);
      player.giveExtraTurn();
    }
    // 2. Update player location based on die roll (using your existing logic)
    // Animate the player movement over the slots
    await animatePlayerMovement(player, newDiceResult);
    // 3. Get Question Card answered
    await displayQuestionCard(player);
    // 4. Enable Next Turn Button
    setReadyForNextTurn(true);
    game.readyForNextTurn = true;
  };

  const handleNextTurn = () => {
    const player = game.getCurrentPlayer();
    player.incrementTurns();
    if (!player.extraTurn) {
      // setCurrentPlayer(prevPlayer => (prevPlayer + 1) % game.players.length);
      game.setNextPlayerAsCurrent();
    } else {
      player.endExtraTurn();
      setExtraTurn(false);
    }
    setDiceResult(null);
    setReadyForNextTurn(false);
    game.readyForNextTurn = false;
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
    updatePlayerLocations();
  }, [playerPositions, baseLength]);

  // useEffect(() => {
  //   players.forEach(p => {
  //     const player = game.findPlayer(p.id);
  //     player.score = p.score;
  //     player.location = p.location;
  //     player.sprite = p.sprite;
  //     player.x = p.x;
  //     player.y = p.y;
  //     player.turnsTaken = p.turnsTaken;
  //     player.extraTurn = p.extraTurn;
  //     player.score = p.score;
  //   });
  // }, [players]);

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
  }, [readyForNextTurn, diceResult, game]);

  // Updates Icon Scale when baseLength changes
  useEffect(() => {
    setIconScale(baseLength / 10000);
  }, [baseLength]);

  useEffect(() => {
    // Update sprite positions and sizes when players array changes
    game.players.forEach(player => {
      player.sprite = React.cloneElement(player.sprite, {
        scale: iconScale,
      });
    });
  }, [iconScale]);

  const goHome = () => {
    window.removeEventListener('resize', handleWindowResize);
    navigate('/');
  };

  const handleKeyDown = (event) => {
    if ((event.key === ' ' || event.key === 'n') && readyForNextTurn) {
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
              <tr
                key={player.id}
                className={(player.id === game.getCurrentPlayer().id)
                  ? 'current-player'
                  : ''}
              >
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
            {game.players.map(player => (
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
      {showGameControls && (
        <div className='game-ui'>
          <div className='game-controls-box'>
            <p>
              Player: <strong>{game.players[game.currentPlayer]?.name}</strong>
              <img
                className='mini-icons'
                src={icons[game.players[game.currentPlayer]?.icon]}
              />
            </p>
            {extraTurn && <p>Extra Turn!</p>}
            {diceResult && <p>Dice Roll: {diceResult}</p>}
            {readyForNextTurn && (
              <button className='game-btn-1' onClick={handleNextTurn}>
                Next Turn
              </button>
            )}
            {!readyForNextTurn && !diceResult && (
              <button className='game-btn-1' onClick={handlePlayerTurn}>
                Roll Dice
              </button>
            )}
          </div>
        </div>
      )}
      {showCard && cardData && (
        <div className='card-container'>
          <div className='wrapper'>
            <div className='card'>
              <question>
                {cardData.question}
              </question>
              {!showAnswer && (
                <button className='game-btn-1' onClick={handleAnswerClick}>
                  Reveal Answer
                </button>
              )}
              <hr />
              {showAnswer && (
                <div>
                  <answer>{cardData.answer}</answer>

                  <ul className='card-button'>
                    <li className='card-button'>
                      <a
                        className='card-button card-button-correct'
                        href='#'
                        onClick={() => handleAnswerResult(true)}
                      >
                        &#10003;
                      </a>
                    </li>
                    <li className='card-button'>
                      <a
                        className='card-button card-button-wrong'
                        href='#'
                        onClick={() => handleAnswerResult(false)}
                      >
                        &#10008;
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              <div className='category'>
                <p>
                  Category | <strong>{cardData.category}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
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
