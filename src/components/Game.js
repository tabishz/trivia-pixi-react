import axios from 'axios';
import Player from './Player.js';

const QUESTIONS_API_URL = '';

class Game {
  constructor(sessionId = null) {
    this.players = [];
    this.currentTurn = 0; // Index of the current player in the players array
    this.startTime = Date.now();
    this.endTime = null;
    this.gameOver = false;
    this.questions = []; // Array to store questions
    this.attemptedQuestions = []; // Questions that have been played in session
    this.currentQuestion = null; // To hold the currently active question
    this.sessionId = sessionId || this.generateSessionId();
    this.chosenIcons = [];
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

  determineSlotDetails() {}
  presentQuestion() {}

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
    const timestamp = this.startTime.toString();
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

  setPlayerIcon(icon, id) {
    const thePlayer = this.findPlayer(id);
    if (thePlayer && this.iconAvailable(icon)) {
      thePlayer.setIcon(icon);
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

  addPlayer(name) {
    if (this.playerExists(name)) { return false; }
    const player = new Player(name);
    this.players.push(player);
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
    if (this.currentTurn >= this.players.length) {
      this.currentTurn = 0;
    }
  }

  nextTurn() {
    this.isGameOver();
    if (this.gameOver) {
      return false;
    }
    const player = this.players[this.currentTurn];
    player.incrementTurns(); // Increment turns for the current player
    // If a player gets extra turn, then give this player extra turn
    if (player.extraTurn === true) {
      player.endExtraTurn();
      return player;
    }
    this.currentTurn = (this.currentTurn + 1) % this.players.length; // Move to next player
    // Get a new question for the next player
    this.currentQuestion = this.getNextQuestion();
    const nextPlayer = this.players[this.currentTurn];
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

  getCurrentPlayer() {
    if (this.gameOver || this.players.length === 0) {
      return null;
    }
    return this.players[this.currentTurn];
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
    this.currentTurn = 0;
    this.gameOver = false;
    this.questions = [];
    this.attemptedQuestions = [];
    this.currentQuestion = null;
  }

  getPlayers() {
    return this.players; // Returns array of player objects
  }

  findPlayer(id) {
    const thePlayer = this.players.find(player => {
      return player.id === id;
    });
    return thePlayer;
  }

  getSessionId() {
    return this.sessionId;
  }

  // Create functions for
  // TODO: saveGameData: this will storage all game data in JSON format including players info
  // TODO: loadGameData: this will recreated the game session from JSON data
}

export default Game;
