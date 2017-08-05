const Viewport = require('./class.viewport');
const Tile = require('./class.tile');

class Level {

  setTiles(tiles) {
    tiles.forEach((tile) => {
      this.lvlTiles.push(new Tile(tile));
    });
  }

  get size_w() {
    return this.data.w;
  }

  get size_h() {
    return this.data.h;
  }

  get tiles() {
    return this.lvlTiles;
  }

  get render() {
    const payload = this.lvlTiles;
    return payload;
  }

  get viewport() {
    return this.vp;
  }

  constructor(name) {
    this.data = require(`./levels/${name}.json`);
    this.lvlTiles = [];
    this.setTiles(this.data.tiles);
    this.vp = new Viewport(0, 0, 100);
  }
}

module.exports = Level;
