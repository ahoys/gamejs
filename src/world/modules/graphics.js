const log = debug('world/modules/graphics');
const obj = require('../../utilities/util.obj');

module.exports = {
  vertices: [],
  indices: [],
  scale: 1.0,

  /**
   * Sets vertices that are used in drawing.
   */
  setVertices: function(v) {
    this.vertices = v;
  },

  /**
   * Indices tell the renderer in which order
   * the vertices should be rendered.
   */
  setIndices: function(v) {
    this.indices = v;
  },

  /**
   * Processes a new model.
   */
  setModel: function(v) {
    try {
      const model = obj.importForRegl(`./src/assets/models/${v}.obj`);
      this.vertices = model.v;
      this.indices = model.vI;
    } catch (err) {
      log(`Failed to load a model: ${err}`);
    }
  },

  /**
   * Sets scale of the object.
   */
  setScale: function(v) {
    this.scale = Number(v);
  },
}
