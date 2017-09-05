// const Position = require('./position');
// const Rotation = require('./rotation');

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

function Tile(material, vertices, indices) {
  this.material = material;
  this.vertices = vertices;
  this.indices = indices;
};

Tile.prototype.getMaterial = function getMaterial() {
  return this.material;
}

Tile.prototype.getVertices = function getVertices() {
  return this.vertices;
}

Tile.prototype.getIndices = function getIndices() {
  return this.indices;
}

Object.assign(Tile, ...Position)

module.exports = Tile;
