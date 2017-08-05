const res = require('./resources/tiles.json');

class Tile {

  get render() {
    return {
      type: "tile",
      material: this.data.material,
      texture: this.data.texture,
    };
  }

  constructor(tile) {
    this.data = res[tile.type];
  }
}

module.exports = Tile;
