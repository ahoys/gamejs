const Calc = require('../../utilities/util.calc');

class Viewport {

  doMove2D(dir, amount) {
    switch (dir) {
      case 'up':
        this._x += amount * Math.sin(this._yaw);
        this._y += amount * Math.cos(this._yaw);
        break;
      case 'right':
        this._x -= amount * Math.cos(this._yaw);
        this._y += amount * Math.sin(this._yaw);
        break;
      case 'down':
        this._x -= amount * Math.sin(this._yaw);
        this._y -= amount * Math.cos(this._yaw);
        break;
      case 'left':
        this._x += amount * Math.cos(this._yaw);
        this._y -= amount * Math.sin(this._yaw);
        break;
    }
  }

  doRotate(axel, amount) {
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
        this._z -= amount;
        break;
      case 'down':
        this._z += amount;
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

  set roll(n) {
    this._roll = n;
  }

  get roll() {
    return this._roll;
  }

  set pitch(n) {
    this._pitch = n;
  }

  get pitch() {
    return this._pitch;
  }

  set yaw(n) {
    this._yaw = n;
  }

  get yaw() {
    return this._yaw;
  }

  set width(n) {
    this._width = n;
  }

  get width() {
    return this._width;
  }

  set length(n) {
    this._length = n;
  }

  get length() {
    return this._length;
  }

  constructor(x = 0, y = 0, z = 0, roll = 0, pitch = 0, yaw = 0, width, length) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._roll = roll; // Axis of rotation: x.
    this._yaw = yaw; // Axis of rotation: z.
    this._pitch = pitch; // Axis of rotation: y.
    this._width = width;
    this._length = length;
  }
}

module.exports = Viewport;
