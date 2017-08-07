const Entity = require('./class.entity');

class EntityTile extends Entity {

  constructor(type, x, y, width, height) {
    super(type, x, y, width, height);
  }
}

module.exports = EntityTile;
