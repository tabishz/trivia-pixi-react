import Player from './Player';

class Game {
  constructor() {
    this.players = [];
    this.currentTurn = 0; // Index of the current player in the players array
    this.startTime = Date.now();
    this.endTime = null;
    this.gameOver = false;
    this.questions = []; // Array to store questions
    this.currentQuestion = null; // To hold the currently active question
    this.sessionId = null;
  }

  generateSessionId() {
    const timestamp = this.startTime.toString();
    const randomString = Math.random().toString(36).substring(2, 15);
    this.sessionId = timestamp + randomString;
    return this.sessionId;
  }

  addPlayer(name, id) {
    const player = new Player(name, id);
    this.players.push(player);
    return player;
  }

  removePlayer(id) {
    this.players = this.players.filter(player => player.id !== id);
    if (this.currentTurn >= this.players.length) {
      this.currentTurn = 0;
    }
  }

  nextTurn() {
    if (this.gameOver || this.players.length === 0) {
      return;
    }
    this.players[this.currentTurn].incrementTurns(); // Increment turns for the current player
    this.currentTurn = (this.currentTurn + 1) % this.players.length; // Move to next player
    // Get a new question for the next player
    this.currentQuestion = this.getNextQuestion();
    return this.players[this.currentTurn];
  }

  // Method to add questions to the game
  addQuestions(questions) {
    this.questions = [...this.questions, ...questions];
  }

  getNextQuestion() {
    if (!this.questions.length) {
      // Handle the case where there are no questions left (e.g., game over or fetch more questions)
      this.gameOver = true;
      return null;
    }
    // Randomly pick a question index
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    const question = this.questions.splice(randomIndex, 1)[0];
    return question;
  }

  getCurrentPlayer() {
    if (this.gameOver || this.players.length === 0) {
      return null;
    }
    return this.players[this.currentTurn];
  }

  // TODO: update game over logic
  isGameOver() {
    return this.gameOver || this.questions.length === 0;
  }

  resetGame() {
    this.players.forEach(player => player.resetScore());
    this.currentTurn = 0;
    this.gameOver = false;
    this.questions = [];
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
