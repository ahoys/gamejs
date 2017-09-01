class Tile {

  get material() {
    return this._material;
  }

  get texture() {
    return this._texture;
  }

  get vertices() {
    return this._vertices;
  }

  get indices() {
    return this._indices;
  }

  constructor(vertices, indices) {
    this._vertices = vertices;
    this._indices = indices;
    this._material = undefined;
    this._texture = undefined;
  }
}

module.exports = Tile;
