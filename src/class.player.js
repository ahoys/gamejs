class Player {

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
