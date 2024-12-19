import axios from 'axios';
import Player from './Player';

class Game {
  constructor() {
    this.players = [];
    this.currentTurn = 0; // Index of the current player in the players array
    this.startTime = Date.now();
    this.endTime = null;
    this.gameOver = false;
    this.questions = []; // Array to store questions
    this.attemptedQuestions = []; // Questions that have been played in session
    this.currentQuestion = null; // To hold the currently active question
    this.sessionId = null;
  }

  generateSessionId() {
    const timestamp = this.startTime.toString();
    const randomString = Math.random().toString(36).substring(2, 15);
    this.sessionId = timestamp + randomString;
    return this.sessionId;
  }

  addPlayer(name) {
    const id = getNewPlayerId();
    const player = new Player(name, id);
    this.players.push(player);
    return player;
  }

  getNewPlayerId() {
    return this.players.length;
  }

  removePlayer(id) {
    this.players = this.players.filter(player => player.id !== id);
    if (this.currentTurn >= this.players.length) {
      this.currentTurn = 0;
    }
  }

  nextTurn() {
    this.isGameOver();
    if (this.gameOver || this.players.length === 0) {
      return false;
    }
    this.players[this.currentTurn].incrementTurns(); // Increment turns for the current player
    this.currentTurn = (this.currentTurn + 1) % this.players.length; // Move to next player
    // Get a new question for the next player
    this.currentQuestion = this.getNextQuestion();
    return this.players[this.currentTurn];
  }

  /**
   * Adds questions and answers to the list of questions
   * @param {Array} questions Array of Questions and their answers
   */
  addQuestions(questions) {
    this.questions = [...this.questions, ...questions];
  }

  async fetchQuestions(numOfQuestions) {
    const questions = axios.get(`{QUESTIONS_API_URL}?num=${numOfQuestions}`);
    this.addQuestions(questions);
    return true;
  }

  getNextQuestion() {
    if (!this.questions.length) {
      // Handle the case where there are no questions left (e.g., game over or fetch more questions)
      this.gameOver = true;
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
      this.gameOver = true;
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

  getSessionId() {
    return this.sessionId;
  }
}

export default Game;
