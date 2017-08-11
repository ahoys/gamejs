class Viewport {

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

  set sizeX(n) {
    this._sizeX = n;
  }

  get sizeX() {
    return this._sizeX;
  }

  set sizeY(n) {
    this._sizeY = n;
  }

  get sizeY() {
    return this._sizeY;
  }

  constructor(x = 0, y = 0, z = 0, yaw = 0, pitch = 0, roll = 0, sizeX, sizeY) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._yaw = yaw; // Axis of rotation: x.
    this._pitch = pitch; // Axis of rotation: y.
    this._roll = roll; // Axis of rotation: z.
    this._sizeX = sizeX;
    this._sizeY = sizeY;
  }
}

module.exports = Viewport;
