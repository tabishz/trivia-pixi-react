class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id; // UID for the player
    this.score = 0;
    this.turnsTaken = 0;
    this.answers = [];
  }

  incrementScore() {
    this.score++;
  }

  incrementTurns() {
    this.turnsTaken++;
  }

  recordAnswer(question, answer) {
    this.answers.push({ question, answer });
  }

  // You can add other helpful methods here, like resetting score:
  resetScore() {
    this.score = 0;
    this.turnsTaken = 0;
    this.answers = [];
  }

  getScore() {
    return this.score;
  }

  getTurns() {
    return this.turnsTaken;
  }
}

export default Player;
