const Calc = require('../../utilities/util.calc');

class Viewport {

  doMove2D(dir, amount) {
    switch (dir) {
      case 'up':
        this._x -= amount * Math.sin(this._yaw);
        this._y -= amount * Math.cos(this._yaw);
        break;
      case 'right':
        this._x += amount * Math.cos(this._yaw);
        this._y -= amount * Math.sin(this._yaw);
        break;
      case 'down':
        this._x += amount * Math.sin(this._yaw);
        this._y += amount * Math.cos(this._yaw);
        break;
      case 'left':
        this._x -= amount * Math.cos(this._yaw);
        this._y += amount * Math.sin(this._yaw);
        break;
    }
  }

  doTurn(axel, amount) {
    switch (axel) {
      case 'roll':
        this._roll += amount;
        break;
      case 'pitch':
        this._pitch += amount;
        break;
      case 'yaw':
        this._yaw += amount;
        break;
    }
  }

  doMove3D(dir, amount) {
    switch (dir) {
      case 'forward':
        break;
      case 'backward':
        break;
      case 'left':
        break;
      case 'right':
        break;
      case 'up':
        break;
      case 'down':
        break;
    }
  }

  set x(n) {
    this._x = n;
  }

  get x() {
    return this._x;
  }

  set y(n) {
    this._y = n;
  }

  get y() {
    return this._y;
  }

  set z(n) {
    this._z = n;
  }

  get z() {
    return this._z;
  }

  set yaw(n) {
    this._yaw = n;
  }

  get yaw() {
    return this._yaw;
  }

  set pitch(n) {
    this._pitch = n;
  }

  get pitch() {
    return this._pitch;
  }

  set roll(n) {
    this._roll = n;
  }

  get roll() {
    return this._roll;
  }

  set width(n) {
    this._width = n;
  }

  get width() {
    return this._width;
  }

  set height(n) {
    this._height = n;
  }

  get height() {
    return this._height;
  }

  constructor(x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0, width, height) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._yaw = yaw; // Axis of rotation: x.
    this._pitch = pitch; // Axis of rotation: y.
    this._roll = roll; // Axis of rotation: z.
    this._width = width;
    this._height = height;
  }
}

module.exports = Viewport;
