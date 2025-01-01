class Question {
  constructor({ category = null, question = null, answer = null } = {}) {
    this.category = category;
    this.question = question;
    this.answer = answer;
    this.responded = false;
    this.responseCorrect = null;
  }

  respond() {
    this.responded = true;
  }

  correct() {
    this.respond();
    this.responseCorrect = true;
  }

  wrong() {
    this.respond();
    this.responseCorrect = false;
  }
}

export default Question;
