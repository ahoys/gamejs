/**
 * Tile
 * 
 * The primary world building item.
 * Ground, walls, etc. can be made of WorldTiles.
 * @extends position
 * @extends rotation
 */
module.exports = Object.assign(
  {
    type: null,
    setType: function (v) {
      this.type = String(v);
    }
  },
  require('./modules/position'),
  require('./modules/rotation'),
  require('./modules/graphics'),
);
