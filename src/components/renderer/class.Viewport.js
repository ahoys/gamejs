class Viewport {

  doMove2D(dir, distance) {
    switch (dir) {
      case 'up':
        break;
      case 'right':
        break;
      case 'down':
        break;
      case 'left':
        break;
    }
  }

  doMove3D(dir, amount) {
    switch (dir) {
      case 'forward':
        break;
      case 'right':
        break;
      case 'backward':
        break;
      case 'left':
        break;
      case 'up':
        break;
      case 'down':
        break;
      case 'roll-left':
        this._roll -= amount;
        break;
      case 'roll-right':
        this._roll += amount;
        break;
      case 'pitch-forward':
        this._pitch += amount;
        break;
      case 'pitch-backward':
        this._pitch -= amount;
        break;
      case 'yaw-left':
        this._yaw -= amount;
        break;
      case 'yaw-right':
        this._yaw += amount;
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
