class Question {
  constructor(
    {
      category = null,
      question = null,
      answer = null,
      answeredBy = null,
      responded = false,
      responseCorrect = null,
    } = {},
  ) {
    this.category = category;
    this.question = question;
    this.answer = answer;
    this.answeredBy = answeredBy;
    this.responded = responded;
    this.responseCorrect = responseCorrect;
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
