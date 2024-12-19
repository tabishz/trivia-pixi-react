class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id; // UID for the player
    this.score = 0;
    this.turnsTaken = 0;
    this.answers = [];
  }

  /**
   * Increases the players score by amount of points defined (default: 1)
   * @param {Int} points increase score by this many points (default: 1)
   */
  incrementScore(points = 1) {
    this.score = this.score + points;
  }

  incrementTurns() {
    this.turnsTaken++;
  }

  /**
   * Records the question, answer and the whether the answer was correct
   * @param {String} question The Question
   * @param {String} answer The Answer by Player
   * @param {Boolean} correct Whether answer was marked correct or not
   */
  recordAnswer(question, answer, correct) {
    this.answers.push({ question, answer, correct });
  }

  /**
   * Resets the all the recorded values for a player.
   */
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
