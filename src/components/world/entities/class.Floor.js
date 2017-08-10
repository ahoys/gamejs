const StaticEntity = require('../class.StaticEntity');

/**
 * Floor
 * Ari Höysniemi, 10.8.2017
 */
class Floor extends StaticEntity {

  get isWalkable() {
    return this._attributes.isWalkable;
  }

  get damage() {
    return this._attributes.damage;
  }

  constructor(type, x, y, z) {
    super(type, x, y, z);
  }
}

module.exports = Floor;
