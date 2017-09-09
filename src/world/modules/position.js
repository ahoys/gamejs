/**
 * Position
 * Properties for following object position relative to the world.
 */
const position = {
  x: 0,
  y: 0,
  z: 0,
};

position.setX = function(v) {
  this.x = Number(v);
};

position.setY = function(v) {
  this.y = Number(v);
};

position.setZ = function(v) {
  this.z = Number(v);
};

/**
 * Set all values at once.
 * @param {array} pos [x, y, z].
 */
position.setPosition = function(pos) {
  if (pos[0] !== undefined) {
    this.x = Number(pos[0]);
  }
  if (pos[1] !== undefined) {
    this.y = Number(pos[1]);
  }
  if (pos[2] !== undefined) {
    this.z = Number(pos[2]);
  }
};

/**
 * Return all values at once.
 * @returns {array} [x, y, z].
 */
position.getPosition = function() {
  return [this.x, this.y, this.z];
};

module.exports = position;
