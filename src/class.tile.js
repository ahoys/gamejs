const res = require('./resources/tiles.json');

class Tile {

  isWall() {
    return this._assets.isWall;
  }

  get type() {
    return this._type;
  }

  getRenderType() {
    return 'world_tile';
  }

  getRenderColor() {
    return this._assets.color;
  }

  constructor(type) {
    this._type = type;
    this._assets = res[type];
  }
}

module.exports = Tile;
