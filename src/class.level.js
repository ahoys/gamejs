const Viewport = require('./class.viewport');
const Tile = require('./class.tile');

class Level {

  /**
   * Returns the viewport.
   */
  get viewport() {
    return this._vp;
  }

  /**
   * Returns tile objects.
   */
  get tiles() {
    return this._tiles;
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
        this._tiles.push(new Tile('w_stone', x * 100, y * 100));
      }
    }
    tiles.forEach((tile) => {
      this._tiles.push(new Tile(tile.type, tile.x * 100, tile.y * 100));
    });
  }

  constructor(name) {
    const data = require(`./levels/${name}.json`);
    this._w = data.w;
    this._h = data.h;
    this._tiles = [];
    this._entities = [];
    this.initLevel(data.tiles, data.w, data.h);
    this._vp = new Viewport(0, 0, 8, 6);
  }
}

module.exports = Level;
