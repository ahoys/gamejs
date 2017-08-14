const VirtualEntity = require('../class.VirtualEntity');

/**
 * VirtualCamera
 * Ari Höysniemi, 14.8.2017
 * 
 * Used in rendering to determine distance to the viewport.
 */
class VirtualCamera extends VirtualEntity {

  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(v) {
    this._isEnabled = Boolean(v);
  }

  constructor(type, x = 0, y = 0, z = 0, roll = 0, pitch = 0, yaw = 0) {
    super(type, x, y, z, roll, pitch, yaw);
    this._isEnabled = true;
  }
}

module.exports = VirtualCamera;
