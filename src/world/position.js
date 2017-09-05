function Position(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Position.prototype.getX = function getX() {
  return this.x;
}

Position.prototype.getY = function getY() {
  return this.y;
}

Position.prototype.getZ = function getZ() {
  return this.z;
}

module.exports = Position;
