const Entity = require('../class.Entity');

/**
 * CameraProp
 * Ari Höysniemi, 14.8.2017
 * 
 * Used in rendering to determine distance to the viewport.
 */
class CameraProp extends Entity {

  doFov(v) {
    this._fov += Number(v);
  }

  set enabled(v) { this._enabled = Boolean(v); }
  set fov(v) { this._fov = Number(v); }
  get enabled() { return this._enabled; }
  get fov() { return this._fov; }

  constructor(id, type, x, y, z, rX, rY, rZ, fov, enabled) {
    super(id, type, x, y, z, rX, rY, rZ);
    this._fov = Number(fov);
    this._enabled = Boolean(enabled);
  }
}

module.exports = CameraProp;
