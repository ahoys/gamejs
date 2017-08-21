const Entity = require('../class.Entity');

/**
 * StaticProp
 * 
 * Objects like walls and floors. Cannot be altered.
 * Ari Höysniemi, 10.8.2017
 */
class StaticProp extends Entity {
  constructor(id, type, x, y, z, rX, rY, rZ) {
    super(id, type, x, y, z, rX, rY, rZ);
  }
}

module.exports = StaticProp;
