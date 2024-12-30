import { v7 as uuidv7 } from 'uuid';

class Player {
  constructor(name) {
    this.setName(name);
    this.id = this._generatePlayerId();
    this.icon = null;
    this.sprite = null;
    this.score = 0;
    this.location = 0;
    this.slot = 0;
    this.sprite = null;
    this.extraTurn = false;
    this.turnsTaken = 0;
    this.answers = [];
  }

  _generatePlayerId() {
    return uuidv7();
  }

  /**
   * Increases the players score by amount of points defined (default: 1)
   * @param {Int} points increase score by this many points (default: 1)
   */
  incrementScore(points = 1) {
    this.score = this.score + points;
  }

  getId() {
    return this.id;
  }

  setName(name) {
    if (typeof name !== 'string') { return false; }
    let newName = name;
    if (name.length > 16) { newName = name.slice(0, 16); }
    this.name = newName;
  }

  setIcon(iconName) {
    this.icon = iconName;
  }

  /**
   * Gives this player gets additional turn or not based on the game logic.
   */
  giveExtraTurn() {
    this.extraTurn = true;
  }

  endExtraTurn() {
    this.extraTurn = false;
  }

  incrementTurns() {
    this.turnsTaken++;
  }

  updateLocation(numOfSlotsToMove) {
    this.location = this.location + numOfSlotsToMove;
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

  async playerToRollDice() {
  }

  async movePlayerToSlot() {}

  async answerQuestion() {}

  async scoreQuestion() {}
}

export default Player;
