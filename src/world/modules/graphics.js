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
   * Sets scale of the object.
   */
  setScale: function(v) {
    this.scale = Number(v);
  },
}
