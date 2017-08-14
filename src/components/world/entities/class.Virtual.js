const DynamicEntity = require('../class.DynamicEntity');

/**
 * Virtual
 * Used in rendering to determine distance to the viewport.
 * Ari Höysniemi, 10.8.2017
 */
class Virtual extends DynamicEntity {

  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(v) {
    this._isEnabled = Boolean(v);
  }

  constructor(type, x, y, z) {
    super(type, x, y, z);
    this._isEnabled = true;
  }
}

module.exports = Virtual;
