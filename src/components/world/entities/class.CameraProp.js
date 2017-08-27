const mat4 = require('gl-mat4');
const Entity = require('../class.Entity');

/**
 * CameraProp
 * Ari Höysniemi, 14.8.2017
 * 
 * Used in rendering.
 */
class CameraProp extends Entity {

  doFov(v) {
    if (this._fov + Number(v) >= 135) {
      this._fov = 135;
    } else if (this._fov + Number(v) <= 65) {
      this._fov = 65;
    } else {
      this._fov += Number(v);
    }
  }

  set enabled(v) { this._enabled = Boolean(v); }
  set fov(v) { this._fov = Number(v); }
  get enabled() { return this._enabled; }
  get fov() { return this._fov * (Math.PI / 180); }

  constructor(id, type, x, y, z, rX, rY, rZ, fov, enabled) {
    super(id, type, x, y, z, rX, rY, rZ);
    this._fov = Number(fov);
    this._enabled = Boolean(enabled);
  }
}

module.exports = CameraProp;
