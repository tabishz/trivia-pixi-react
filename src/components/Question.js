class Question {
  constructor({ category = null, question = null, answer = null } = {}) {
    this.category = category;
    this.question = question;
    this.answer = answer;
    this.answeredBy = null;
    this.responded = false;
    this.responseCorrect = null;
  }

  respond(isCorrect = null) {
    this.responded = true;
    this.responseCorrect = isCorrect;
  }

  /**
   * Assigns user's User ID to question
   * @param {String} playerId UUID of player who answered the questions
   */
  setAnsweredBy(playerId) {
    this.answeredBy = playerId;
  }
}

export default Question;
