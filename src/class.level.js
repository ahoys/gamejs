const Floor = require('./components/world/entities/class.Floor');
const Wall = require('./components/world/entities/class.Wall');
const VirtualCamera = require('./components/world/entities/class.VirtualCamera');

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
  getWorldComponent(dataType, type, x, y, z, roll = 0, pitch = 0, yaw = 0) {
    const types = {
      "dt_wall": Wall,
      "dt_floor": Floor,
      "dt_virtual": VirtualCamera,
    }
    return new types[dataType](type, x, y, z, roll, pitch, yaw);
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
          x.roll,
          x.pitch,
          x.yaw,
        );
      }
    });
    console.log(`Level ${this._name} read. Entities: ${this._3Dmatrix.length}, camera: ${this._virtualCamera !== undefined}`);
  }

  constructor(name) {
    const res = require(`./levels/${name}.json`);
    this._name = name;
    this._3Dmatrix = [];
    this._virtualCamera = undefined;
    this.init3Dlevel(res.data);
  }
}

module.exports = Level;
