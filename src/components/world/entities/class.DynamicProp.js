const Entity = require('../class.Entity');

/**
 * DynamicProp
 * 
 * Interactive objects.
 * Ari Höysniemi, 10.8.2017
 */
class DynamicProp extends Entity {
  constructor(id, type, x, y, z, roll, pitch, yaw) {
    super(id, type, x, y, z, roll, pitch, yaw);
  }
}

module.exports = DynamicProp;
