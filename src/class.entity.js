const res = require('./resources/tiles.json');

class Entity {

  get type() {
    return this._type;
  }

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

  set width(px) {
    this._width = px;
  }

  get width() {
    return this._width;
  }

  set height(px) {
    this._height = px;
  }

  get height() {
    return this.height;
  }

  get renderPayload() {
    return {
      type: this._type,
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      color: this._color,
    }
  }

  constructor(type, x, y, width, height) {
    this._type = type;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._color = res[type].color;
  }
}

module.exports = Entity;
