const c = require('./constants.json');
const Floor = require('./components/world/entities/class.Floor');
const Wall = require('./components/world/entities/class.Wall');
const Virtual = require('./components/world/entities/class.Virtual');

class Level {

  /**
   * Returns the world in a single list.
   */
  get worldObjects() {
    return this._3Dmatrix;
  }

  /**
   * Returns world's camera.
   */
  get worldCamera() {
    return this._virtualCamera;
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
      "dt_virtual": Virtual,
    }
    return new types[dataType](type, x, y, z);
  }

  /**
   * Initializes the entire level.
   * Should be ran only once.
   * @param {object} data
   */
  init3Dlevel(data) {
    const virtuals = [];
    const entities = data.filter(x => {
      if (x.dataType === 'dt_virtual') {
        virtuals.push(x);
        return false;
      }
      return true;
    });
    // Handle entities.
    this._3Dmatrix = entities.map(x => this.getWorldComponent(
      x.dataType,
      x.type,
      x.x,
      x.y,
      x.z,
    ));
    // Handle virtual entities.
    virtuals.forEach(x => {
      if (x.type === 'v_virtualCamera') {
        this._virtualCamera = this.getWorldComponent(
          x.dataType,
          x.type,
          x.x,
          x.y,
          x.z,
        );
      }
    });
    console.log(`Level ${this._name} read. Entities: ${this._3Dmatrix.length}, camera: ${this._virtualCamera !== undefined}`);
  }

  constructor(name) {
    const res = require(`./levels/${name}.json`);
    this._name = name;
    this._3Dmatrix = [];
    this.init3Dlevel(res.data);
    this._virtualCamera = undefined;
  }
}

module.exports = Level;
