class Entity {

  set x(value) {
    this.posX = value;
  }

  get x() {
    return this.posX;
  }

  set y(value) {
    this.posY = value;
  }

  get y() {
    return this.posY;
  }

  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }
}

module.exports = Entity;
