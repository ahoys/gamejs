const Entity = require('../class.Entity');

/**
 * StaticProp
 * 
 * Objects like walls and floors. Cannot be altered.
 * Ari Höysniemi, 10.8.2017
 */
class StaticProp extends Entity {
  constructor(type, x, y, z, roll, pitch, yaw) {
    super(type, x, y, z, roll, pitch, yaw);
  }
}

module.exports = StaticProp;