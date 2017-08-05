const res = require('./resources/tiles.json');

class Tile {

  get type() {
    return this._type;
  }

  get material() {
    return res[this._type].material;
  }

  get texture() {
    return res[this._type].texture;
  }

  constructor(type) {
    this._type = type;
  }
}

module.exports = Tile;
