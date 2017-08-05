const c = require('./constants.json');
const Viewport = require('./class.viewport');
const Tile = require('./class.tile');

class Level {

  /**
   * Returns width of the map in grids.
   */
  get width() {
    return this._mapW;
  }

  /**
   * Returns height of the map in grids.
   */
  get height() {
    return this._mapH;
  }

  /**
   * Returns the current world tiles.
   */
  get worldTiles() {
    return this._worldTiles;
  }

  /**
   * Generates the level.
   * @param {*} loadedTiles
   */
  initWorldTiles(loadedTiles) {
    // Generate basic tiles.
    for (let x = 0; x < this._mapW; x++) {
      for (let y = 0; y < this._mapH; y++) {
        // Borders should be made of bedrock.
        // Don't want anyone to get into void, right?
        const type = x === 0 || y === 0 || x === this._mapW - 1 || y === this._mapH - 1
          ? 'w_bedrock' : 'w_stone';
        if (y === 0) {
          this._worldTiles[x] = [new Tile(type)];
        } else {
          this._worldTiles[x][y] = new Tile(type);
        }
      }
    }
    // Load custom tiles.
    loadedTiles.forEach(lt => {
      if (
        c.AVAILABLE_WORLDTILES.indexOf(lt.type) !== -1 &&
        lt.x && // Can't override bedrock borders.
        lt.y &&
        lt.x < this._mapW - 1 &&
        lt.y < this._mapH - 1
      ) {
        this._worldTiles[lt.x][lt.y] = new Tile(lt.type);
      }
    });
  }

  constructor(name) {
    const Data = require(`./levels/${name}.json`);
    this._mapW = Data.width;
    this._mapH = Data.height;
    this._worldTiles = [];
    this._entities = [];
    this.initWorldTiles(Data.tiles);
    // this._vp = new Viewport(0, 0, 8, 6);
  }
}

module.exports = Level;
