const StaticEntity = require('./class.StaticEntity');

/**
 * DynamicEntity
 * Ari Höysniemi, 10.8.2017
 * 
 * Implements ability to move.
 */
class DynamicEntity extends StaticEntity {

  set x(v) {
    this._x = v;
  }

  set y(v) {
    this._y = v;
  }

  set z(v) {
    this._z = v;
  }

  constructor(type, x, y, z) {
    super(type, x, y, z);
  }
}

module.exports = DynamicEntity;
