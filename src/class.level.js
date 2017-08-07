const c = require('./constants.json');
const EntityTile = require('./class.entityTile');

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
    const payload = [];
    for (let x = 0; x < this._mapW; x++) {
      for (let y = 0; y < this._mapH; y++) {
        payload.push(this._worldTiles[x][y]);
      }
    }
    return payload;
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
          this._worldTiles[x] = [new EntityTile(type, x * 100, y * 100, 100, 100)];
        } else {
          this._worldTiles[x][y] = new EntityTile(type, x * 100, y * 100, 100, 100);
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
        this._worldTiles[lt.x][lt.y] = new EntityTile(lt.type, lt.x * 100, lt.y * 100, 100, 100);
      }
    });
  }

  constructor(name) {
    const Data = require(`./levels/${name}.json`);
    this._mapW = Data.width;
    this._mapH = Data.height;
    this._worldTiles = [];
    this._worldEntities = [];
    this.initWorldTiles(Data.tiles);
  }
}

module.exports = Level;
