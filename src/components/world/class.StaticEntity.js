const resJSON = require('./resources/res.static.json');

/**
 * StaticEntity
 * Ari Höysniemi, 08.10.2017
 * 
 * The base entity that every other entity extends.
 * Implements position, dimensions and other resources.
 */
class StaticEntity {

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  get width() {
    return this._dimensions.w;
  }

  get length() {
    return this._dimensions.l;
  }

  get height() {
    return this._dimensions.h;
  }

  get texture() {
    return this._graphics.texture;
  }

  get baseColor() {
    return this._graphics.baseColor;
  }

  get shading() {
    return this._graphics.shading;
  }

  constructor (type, x = 0, y = 0, z = 0) {
    this._x = x; // Position in x-axel.
    this._y = y; // Position in y-axel.
    this._z = z; // Position in z-axel.
    this._dimensions = resJSON[type].dimensions; // Size.
    this._attributes = resJSON[type].attributes; // Features.
    this._sfx = resJSON[type].sfx; // Sounds.
    this._graphics = resJSON[type].graphics; // Textures, colors and shading.
  }
}

module.exports = StaticEntity;
