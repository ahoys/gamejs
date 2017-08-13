const c = require('./constants.json');
const Floor = require('./components/world/entities/class.Floor');
const Wall = require('./components/world/entities/class.Wall');

class Level {

  /**
   * Returns the world in a single list.
   */
  get worldObjects() {
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
  init3Dlevel(data) {
    this._3Dmatrix = data.map(x => this.getWorldComponent(
      x.dataType,
      x.type,
      x.x,
      x.y,
      x.z,
    ));
  }

  constructor(name) {
    const res = require(`./levels/${name}.json`);
    this._3Dmatrix = [];
    this.init3Dlevel(res.data);
  }
}

module.exports = Level;
