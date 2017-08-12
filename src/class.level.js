const c = require('./constants.json');
const Floor = require('./components/world/entities/class.Floor');
const Wall = require('./components/world/entities/class.Wall');

class Level {

  /**
   * Returns width of the map in grids.
   */
  get width() {
    return this._gridW;
  }

  /**
   * Returns length of the map in grids.
   */
  get length() {
    return this._gridL;
  }

  /**
   * Returns height of the map in grids.
   */
  get height() {
    return this._gridH;
  }

  /**
   * Returns the world matrix.
   * This includes the entire level.
   */
  get world() {
    return this._3Dmatrix;
  }

  /**
   * Returns a world component based on dataType.
   * @param {*} dataType 
   * @param {*} type 
   * @param {*} x 
   * @param {*} y 
   * @param {*} z 
   */
  getWorldComponent(dataType, type, x, y, z) {
    const types = {
      "dt_wall": Wall,
      "dt_floor": Floor,
    }
    return new types[dataType](type, x, y, z);
  }

  /**
   * Initializes the entire level.
   * Should be ran only once.
   * @param {object} data
   */
  initLevel(data) {
    // Structure: [[x[y[z]]], [x[y[z]]], [x[y[z]]]].
    for (let x = 0; x < this._gridW; x++) {
      // Width.
      for (let y = 0; y < this._gridL; y++) {
        // Length.
        if (y === 0) this._3Dmatrix[x] = [];
        for (let z = 0; z < this._gridH; z++) {
          // Height.
          if (z === 0) {
            this._3Dmatrix[x][y] = [this.getWorldComponent(
              'dt_wall',
              'w_bedrock',
              x,
              y,
              z
            )];
          }
        } 
      }
    }
    // Level specific items.
    data.forEach((item) => {
      this._3Dmatrix[item.x][item.y][item.z] = this.getWorldComponent(
        item.dataType,
        item.type,
        item.x,
        item.y,
        item.z
      );
    });
  }

  constructor(name, worldScale) {
    const res = require(`./levels/${name}.json`);
    this._gridW = res.dimensions.w;
    this._gridL = res.dimensions.l;
    this._gridH = res.dimensions.h;
    this._3Dmatrix = [];
    this._worldScale = worldScale;
    this.initLevel(res.data);
  }
}

module.exports = Level;
