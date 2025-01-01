import axios from 'axios';
import createRandomName from './gameNames.js';
import icons from './icons.js';
import Player from './Player.js';

const QUESTIONS_API_URL = '';

class Game {
  constructor(gameName = null, sessionId = null) {
    this.players = [];
    this.currentPlayer = 0; // Index of the current player in the players array
    this.startTime = null;
    this.endTime = null;
    this.gameOver = false;
    this.questions = []; // Array to store questions
    this.attemptedQuestions = []; // Questions that have been played in session
    this.currentQuestion = null; // To hold the currently active question
    this.sessionId = sessionId || this.generateSessionId();
    this.chosenIcons = [];
    this.name = gameName || createRandomName();
  }

  // TODO: create Question class

  async start() {
    // Fetch 100 random questions from the questions bank via API call
    await this.fetchQuestions(100);
    const firstPlayer = this.nextTurn();
    if (firstPlayer) {
      this.playTurn(firstPlayer);
    }
    return false;
  }

  startGame() {
    this.startTime = Date.now();
  }

  async playTurn(player) {
    await player.playerToRollDice();
    await player.movePlayerToSlot();
    await this.determineSlotDetails();
    await this.presentQuestion();
    await player.answerQuestion();
    await player.scoreQuestion();
    const nextPlayer = this.nextTurn();
    if (nextPlayer) {
      await this.playTurn(nextPlayer);
    }
    return null;
  }

  generateSessionId() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 15);
    this.sessionId = timestamp + randomString;
    return this.sessionId;
  }

  setPlayerName(name, id) {
    const thePlayer = this.findPlayer(id);
    if (thePlayer) {
      thePlayer.setName(name);
    }
    return;
  }

  /**
   * Updates a player's Icon
   * @param {String} iconName name of the icon
   * @param {String} id Player's ID
   * @returns
   */
  setPlayerIcon(iconName, id) {
    const thePlayer = this.findPlayer(id);
    if (thePlayer && this.iconAvailable(iconName)) {
      thePlayer.setIcon(iconName);
      this.updateChosenIcons();
    }
    return;
  }

  iconAvailable(iconName) {
    const foundIcon = this.chosenIcons.find(icon => icon === iconName);
    if (!foundIcon) {
      return true;
    }
    console.log(`${iconName} already in use.`);
    return false;
  }

  updateChosenIcons() {
    this.chosenIcons = [];
    this.players.forEach(player => {
      this.chosenIcons.push(player.icon);
    });
  }

  chooseRandomIcon() {
    const iconNames = Object.keys(icons);
    const availableIcons = iconNames.filter(icon =>
      !this.chosenIcons.includes(icon)
    );
    const randomIcon = Math.floor(Math.random() * availableIcons.length);
    return availableIcons[randomIcon];
  }

  addPlayer(name) {
    if (this.playerExists(name)) { return false; }
    const player = new Player(name);
    const iconName = this.chooseRandomIcon();
    this.players.push(player);
    this.setPlayerIcon(iconName, player.id);
    return player;
  }

  playerExists(name) {
    if (this.players.length === 0) { return false; }
    const foundPlayer = this.players.find(player => player.name === name);
    if (foundPlayer) {
      console.log(`${foundPlayer.name} (${foundPlayer.id}) already exists.`);
      return true;
    }
    return false;
  }

  removePlayer(id) {
    this.players = this.players.filter(player => player.id !== id);
    if (this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    this.updateChosenIcons();
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  setNextPlayerAsCurrent() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  }

  nextTurn() {
    // TODO: implement game over logic
    // this.isGameOver();
    // if (this.gameOver) {
    //   return false;
    // }
    const player = this.players[this.currentPlayer];
    player.incrementTurns(); // Increment turns for the current player
    // If a player gets extra turn, then give this player extra turn
    if (player.extraTurn === true) {
      player.endExtraTurn();
      return player;
    }
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length; // Move to next player
    // Get a new question for the next player
    this.currentQuestion = this.getNextQuestion();
    const nextPlayer = this.players[this.currentPlayer];
    return nextPlayer;
  }

  /**
   * Adds questions and answers to the list of questions
   * @param {Array} questions Array of Questions and their answers
   */
  addQuestions(questions) {
    this.questions = [...this.questions, ...questions];
  }

  async fetchQuestions(numOfQuestions) {
    const questions = axios.get(`${QUESTIONS_API_URL}?num=${numOfQuestions}`);
    this.addQuestions(questions);
    return true;
  }

  getNextQuestion() {
    if (!this.questions.length) {
      // Handle the case where there are no questions left (e.g., game over or fetch more questions)
      this.gameOver = true;
      this.endTime = Date.now();
      return null;
    }
    // Get the last question in the Questions list (list already randomized)
    const question = this.questions.pop();
    this.attemptedQuestions.push(question);
    return question;
  }

  isGameOver() {
    if (this.questions.length === 0) {
      const message = 'No questions.';
      console.log(message);
      this.gameOver = true;
      this.endTime = Date.now();
    }
    if (this.players.length === 0) {
      const message = 'No Players.';
      console.log(message);
      this.gameOver = true;
      this.endTime = Date.now();
    }
    return this.gameOver;
  }

  resetGame() {
    this.players.forEach(player => player.resetScore());
    this.currentPlayer = 0;
    this.gameOver = false;
    this.questions = [];
    this.attemptedQuestions = [];
    this.currentQuestion = null;
  }

  getPlayers() {
    return this.players; // Returns array of player objects
  }

  findPlayer(id) {
    console.log(`finding Player: ${id}`);
    const thePlayer = this.players.find(player => {
      return player.id === id;
    });
    return thePlayer;
  }

  getSessionId() {
    return this.sessionId;
  }

  // Exports player data in importable format
  exportPlayersData() {
    return this.players.map(player => {
      return player.exportData();
    });
  }

  importPlayersData(playersData) {
    return playersData.map(playerData => {
      const newPlayer = new Player(playerData.name, playerData.id);
      newPlayer.importData(playerData);
      return newPlayer;
    });
  }

  saveGameData() {
    const gameData = {
      players: this.exportPlayersData(),
      currentPlayer: this.currentPlayer,
      startTime: this.startTime,
      endTime: this.endTime,
      gameOver: this.gameOver,
      questions: this.questions,
      attemptedQuestions: this.attemptedQuestions,
      sessionId: this.sessionId,
      chosenIcons: this.chosenIcons,
      name: this.name,
    };
    return gameData;
  }

  loadGameData(gameData) {
    if (!gameData) {
      return;
    }
    this.players = this.importPlayersData(gameData);
    this.currentPlayer = gameData.currentPlayer;
    this.startTime = gameData.startTime;
    this.endTime = gameData.endTime;
    this.gameOver = gameData.gameOver;
    this.questions = gameData.questions;
    this.attemptedQuestions = gameData.attemptedQuestions;
    this.sessionId = gameData.sessionId;
    this.chosenIcons = gameData.chosenIcons;
    this.name = gameData.name;
  }
}

export default Game;
