class Viewport {

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

  set width(value) {
    this._width = value;
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
  }

  get height() {
    return this._height;
  }

  constructor(x, y, width, height) {
    this._x = x; // Position of the viewport (px).
    this._y = y;
    this._width = width; // Size of the viewport (px).
    this._height = height;
  }
}

module.exports = Viewport;
