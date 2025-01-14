import { v7 as uuidv7 } from 'uuid';

class Player {
  constructor(name, id = null) {
    this.name = this.filterName(name);
    this.id = id || this._generatePlayerId();
    this.icon = null;
    this.sprite = null;
    this.score = 0;
    this.location = 0;
    this.extraTurn = false;
    this.turnsTaken = 0;
    this.x = 0;
    this.y = 0;
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

  filterName(name) {
    if (typeof name !== 'string') { return false; }
    let filteredName = '';
    if (filteredName.length > 16) {
      filteredName = filteredName.slice(0, 16);
    }
    filteredName = name.replace(/[^a-zA-Z0-9\s\-_']/g, ''); // Remove invalid characters
    return filteredName;
  }

  setName(name) {
    this.name = this.filterName(name);
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

  exportData() {
    const playerData = {
      name: this.name,
      id: this.id,
      icon: this.icon,
      sprite: this.sprite,
      score: this.score,
      location: this.location,
      extraTurn: this.extraTurn,
      turnsTaken: this.turnsTaken,
      answers: this.answers,
    };
    return playerData;
  }

  importData(playerData) {
    this.icon = playerData.icon;
    this.sprite = playerData.sprite;
    this.score = playerData.score;
    this.location = playerData.location;
    this.extraTurn = playerData.extraTurn;
    this.turnsTaken = playerData.turnsTaken;
    this.answers = playerData.answers;
  }

  async playerToRollDice() {
  }

  async movePlayerToSlot() {}

  async answerQuestion() {}

  async scoreQuestion() {}
}

export default Player;
