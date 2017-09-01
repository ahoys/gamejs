class Prop {

  get x() { return this._x; }
  get y() { return this._y; }
  get z() { return this._z; }
  get rX() { return this._rX; }
  get rY() { return this._rY; }
  get rZ() { return this._rZ; }

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

  constructor(type, x, y, z, rX, rY, rZ) {
    this._type = type;
    this._x = x;
    this._y = y;
    this._z = z;
    this._rX = rX;
    this._rY = rY;
    this._rZ = rZ;
    this._vertices = undefined;
    this._indices = undefined;
    this._material = undefined;
    this._texture = undefined;
  }
}

module.exports = Prop;
