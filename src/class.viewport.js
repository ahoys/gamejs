class Viewport {

  doMove(dir, amount) {
    switch (dir) {
      case 'up':
        this._y -= amount;
        break;
      case 'right':
        this._x += amount;
        break;
      case 'down':
        this._y += amount;
        break;
      case 'left':
        this._x -= amount;
        break;
    }
  }

  doRotate(dir, amount) {
    switch (dir) {
      case 'left':
        this._rotation -= amount;
        break;
      case 'right':
        this._rotation += amount;
        break;
    }
  }

  doZoom() {

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

  get rotation() {
    return this._rotation;
  }

  /**
   * Set the center of the viewport.
   * @param {object} pos Holds x and y values in pixels.
   */
  set origin(pos) {
    this._x = pos.x - this._width/2;
    this._y = pos.y - this._height/2;
  }

  get origin() {
    return {
      x: this._x + this._width/2,
      y: this._y + this._height/2,
    }
  }

  constructor(x = 0, y = 0, width = 640, height = 480, rotation = 0.785398) {
    this._x = x;
    this._y = y;
    this._width = width; // Size of the viewport (px).
    this._height = height;
    this._rotation = rotation; // In radians
    this._distance = 100; // Distance in pixels
  }
}

module.exports = Viewport;
