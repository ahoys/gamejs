class Player {

  setInput(input) {
    this.input = input;
  }

  setNickname(nickname) {
    this.nickname = nickname;
  }

  getNickname() {
    return this.nickname;
  }

  constructor(nickname) {
    this.nickname = nickname;
  }
}

module.exports = Player;
