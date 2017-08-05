const res = require('./resources/tiles.json');

class Tile {

  set x(value) {
    this._x = value;
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;
  }

  get y() {
    return this._y;
  }

  get type() {
    return this._type;
  }

  get material() {
    return res[this._type].material;
  }

  get texture() {
    return res[this._type].texture;
  }

  get color() {
    return res[this._type].color;
  }

  constructor(type, x, y) {
    this._type = type;
    this._x = x;
    this._y = y;
  }
}

module.exports = Tile;
