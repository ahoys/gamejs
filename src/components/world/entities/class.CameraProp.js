const mat4 = require('gl-mat4');
const Entity = require('../class.Entity');

/**
 * CameraProp
 * Ari Höysniemi, 14.8.2017
 * 
 * Used in rendering.
 */
class CameraProp extends Entity {

  view() {
    return mat4.lookAt([], [this._x, this._y, this._z], [0, 0, 0], [0, 1, 0]);
  }

  projection() {
    return mat4.perspective([], this._fov * (180/Math.PI), gl_canvas.width / gl_canvas.height, 0.01, 1000);
  }

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
