const StaticProp = require('./components/world/entities/class.StaticProp');
const DynamicProp = require('./components/world/entities/class.DynamicProp');
const CameraProp = require('./components/world/entities/class.CameraProp');

class Level {

  get staticProps() { return this._staticProps; }
  get dynamicProps() { return this._dynamicProps; }
  get cameraProps() { return this._cameraProps; }
  get grid() { return this._grid; }

  /**
   * Returns a world component based on dataType.
   * @param {*} dataType 
   * @param {*} type 
   * @param {*} x 
   * @param {*} y 
   * @param {*} z 
   */
  getWorldComponent(id, dataType, type, x, y, z, rX, rY, rZ, fov, enabled) {
    const types = {
      "dt_static": StaticProp,
      "dt_dynamic": DynamicProp,
      "dt_camera": CameraProp,
    }
    return new types[dataType](id, type, x, y, z, rX, rY, rZ, fov, enabled);
  }

  /**
   * Initializes the entire level.
   * Should be ran only once.
   * @param {object} data
   */
  init3Dlevel(data) {
    data.filter(x => {
      const obj = this.getWorldComponent(
        x.id,
        x.dataType,
        x.type,
        x.x,
        x.y,
        x.z,
        x.rX,
        x.rY,
        x.rZ,
        x.fov,
        x.enabled,
      );
      if (x.dataType === 'dt_static' && obj) {
        this._staticProps.push(obj);
      } else if (x.dataType === 'dt_dynamic' && obj) {
        this._dynamicProps.push(obj);
      } else if (x.dataType === 'dt_camera' && obj) {
        this._cameraProps.push(obj);
      }
    });
    console.log(`Level ${this._name} read. StaticProps: ${this._staticProps.length}, ` +
    `dynamicProps: ${this._dynamicProps.length}, cameraProps: ${this._cameraProps.length}`);
  }

  constructor(name) {
    const res = require(`./levels/${name}.json`);
    this._name = name;
    this._staticProps = [];
    this._dynamicProps = [];
    this._cameraProps = [];
    this._gridSize = res.gridSize;
    this._grid = { v: [] };
    for (let i = 0; i < this._gridSize; i++) {
      for (let r = 0; r < this._gridSize; r++) {
        this._grid.v.push([i, r, 0]);
      }
    }
    this.init3Dlevel(res.data);
  }
}

module.exports = Level;
