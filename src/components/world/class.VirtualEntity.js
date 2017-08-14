/**
 * VirtualEntity
 * Ari Höysniemi, 14.8.2017
 * 
 * Implements special non-material entities.
 */
class VirtualEntity {

  set x(v) { this._x = Number(v); };
  set y(v) { this._y = Number(v); };
  set z(v) { this._z = Number(v); };
  set roll(v) { this._roll = Number(v); };
  set pitch(v) { this._pitch = Number(v); };
  set yaw(v) { this._yaw = Number(v); };
  get x() { return this._x; };
  get y() { return this._y; };
  get z() { return this._z; };
  get roll() { return this._roll; };
  get pitch() { return this._pitch; };
  get yaw() { return this._yaw; };

  constructor(type, x, y, z, roll, pitch, yaw) {
    this._type = type;
    this._x = x;
    this._y = y;
    this._z = z;
    this._roll = roll;
    this._pitch = pitch;
    this._yaw = yaw;
  }
}

module.exports = VirtualEntity;
