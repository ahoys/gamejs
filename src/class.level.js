const Viewport = require('./class.viewport');
const Tile = require('./class.entity.tile');

class Level {

  get size_w() {
    return this.data.w;
  }

  get size_h() {
    return this.data.h;
  }

  get render() {
    const payload = this.lvlTiles;
    return payload;
  }

  get viewport() {
    return this.vp;
  }

  /**
   * Generate the level.
   * @param {*} tiles 
   * @param {*} w 
   * @param {*} h 
   */
  initLevel(tiles, w, h) {
    for (let x = 0; x < w; x++) {
      // Rows.
      for (let y = 0; y < h; y++) {
        // Columns.
        this.tiles[x][y] = new Tile('w_stone');
      }
    }
    tiles.forEach((tile) => {
      this.tiles[x][y] = new Tile(tile.type);
    });
  }

  constructor(name) {
    const data = require(`./levels/${name}.json`);
    this._w = data.w;
    this._h = data.h;
    this.tiles = [];
    this.entities = [];
    this.initLevel(data.tiles, data.w, data.h);
    this.vp = new Viewport(0, 0, 8, 6);
  }
}

module.exports = Level;
