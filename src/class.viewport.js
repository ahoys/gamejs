class Viewport {

  doMove(dir, amount) {
    switch (dir) {
      case 'up':
        this._x -= (amount * this._hScale) * Math.sin(this._rotation);
        this._y -= (amount * this._vScale) * Math.cos(this._rotation);
        break;
      case 'right':
        this._x += (amount * this._hScale) * Math.cos(this._rotation);
        this._y -= (amount * this._vScale) * Math.sin(this._rotation);
        break;
      case 'down':
        this._x += (amount * this._hScale) * Math.sin(this._rotation);
        this._y += (amount * this._vScale) * Math.cos(this._rotation);
        break;
      case 'left':
        this._x -= (amount * this._hScale) * Math.cos(this._rotation);
        this._y += (amount * this._vScale) * Math.sin(this._rotation);
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

  togglePerspective() {
    this._vScale = this._vScale < 1 ? 1.0 : 0.5;
  }

  get x() {
    return this._x;
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

  get hScale() {
    return this._hScale;
  }

  get vScale() {
    return this._vScale;
  }

  /**
   * Set the center of the viewport.
   * @param {object} pos Holds x and y values in pixels.
   */
  set origin(pos) {
    this._x = pos.x - this._width/2;
    this._y = pos.y + this._height/2;
  }

  get origin() {
    return {
      x: (this._x / this._hScale) + this._width/2,
      y: (this._y / this._vScale) + this._height/2,
    }
  }

  constructor(x = 0, y = 0, width, height, rotation = 0.785398, hScale, vScale) {
    this._x = x;
    this._y = y;
    this._width = width; // Size of the viewport (px).
    this._height = height;
    this._rotation = rotation; // In radians
    this._distance = 100; // Distance in pixels
    this._hScale = hScale;
    this._vScale = vScale;
  }
}

module.exports = Viewport;
