const Entity = require('../class.Entity');

/**
 * CameraProp
 * Ari Höysniemi, 14.8.2017
 * 
 * Used in rendering to determine distance to the viewport.
 */
class CameraProp extends Entity {

  set enabled(v) { this._enabled = Boolean(v); }
  set filter(v) { this._filter = v; }
  get enabled() { return this._enabled; }
  get filter() { return this._filter; }

  constructor(id, type, x, y, z, roll, pitch, yaw, enabled) {
    super(id, type, x, y, z, roll, pitch, yaw);
    this._enabled = Boolean(enabled);
    this._filter = undefined;
  }
}

module.exports = CameraProp;
