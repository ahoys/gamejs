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

  /**
   * Set the center of the viewport.
   * @param {object} pos Holds x and y values in pixels.
   */
  set origin(pos) {
    this._x = pos.x - this._width/2;
    this._y = pos.y - this._height/2;
  }

  /**
   * Returns the current center position of the viewport.
   */
  get origin() {
    return {
      x: this._x + this._width/2,
      y: this._y + this._height/2,
    }
  }

  constructor(originX = 0, originY = 0, width = 640, height = 480) {
    this._x = originX - width/2;
    this._y = originY - height/2;
    this._width = width; // Size of the viewport (px).
    this._height = height;
  }
}

module.exports = Viewport;
