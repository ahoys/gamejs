const res = require('./resources/tiles.json');

class Tile {

  isWall() {
    return res[this._type].isWall;
  }

  get type() {
    return this._type;
  }

  get material() {
    return res[this._type].material;
  }

  get renderType() {
    return 'world_tile';
  }

  get renderColor() {
    return res[this._type].color;
  }

  constructor(type, x, y) {
    this._type = type;
  }
}

module.exports = Tile;
