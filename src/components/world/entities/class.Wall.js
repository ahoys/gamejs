const StaticEntity = require('../class.StaticEntity');

/**
 * Wall
 * Ari Höysniemi, 10.8.2017
 */
class Wall extends StaticEntity {

  /**
   * Can the wall be broken?
   * @returns {boolean}
   */
  get isBreakable() {
    return this._attributes.isBreakable;
  }

  /**
   * How much health the wall has.
   * @returns {number} 1: maximum, 0: the wall is broken.
   */
  get health() {
    return this._attributes.health;
  }

  constructor(type, x, y, z) {
    super(type, x, y, z);
  }
}

module.exports = Wall;
