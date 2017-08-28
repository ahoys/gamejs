const staticJSON = require('./resources/res.static.json');
const Obj = require('../../utilities/util.obj');
const mat4 = require('gl-mat4');

/**
 * StaticEntity
 * Ari Höysniemi, 08.10.2017
 * 
 * The base entity that every other entity extends.
 * Implements position, dimensions and other resources.
 */
class Entity {

  /**
   * Moves the entity in a 3D-space (forward / backward).
   * The entity will move to the direction it is facing (or directly away from it).
   * @param {number} v 
   */
  doMoveXYZ(v) {
    this._x += Number(v) * Math.sin(-this._rY);
    this._y += Number(v) * Math.sin(this._rX) * Math.cos(this._rZ);
    this._z += Number(v) * Math.cos(this._rY);
  }

  doMoveX(v) {
    this._x += Number(v);
  }

  doMoveY(v) {
    this._y += Number(v);
  }

  doMoveZ(v) {
    this._z += Number(v);
  }

  doRotateX(v) {
    this._rX += Number(v);
  }

  doRotateY(v) {
    this._rY += Number(v);
  }

  doRotateZ(v) {
    this._rZ += Number(v);
  }

  set x(v) { this._x = Number(v); }
  set y(v) { this._y = Number(v); }
  set z(v) { this._z = Number(v); }
  set rX(v) { this._rX = Number(v); }
  set rY(v) { this._rY = Number(v); }
  set rZ(v) { this._rZ = Number(v); }
  set width(v) { this._width = Number(v); }
  set length(v) { this._length = Number(v); }
  set height(v) { this._height = Number(v); }
  set color(v) { this._color = Number(v); }
  get id() { return this._id; }
  get type() { return this._type; }
  get x() { return this._x; }
  get y() { return this._y; }
  get z() { return this._z; }
  get rX() { return this._rX; }
  get rY() { return this._rY; }
  get rZ() { return this._rZ; }
  get width() { return this._width; }
  get length() { return this._length; }
  get height() { return this._height; }
  get color() { return this._color; }
  get v() { return this._reglModel.v; }
  get vt() { return this._model.vt; }
  get vn() { return this._model.vn; }
  get vp() { return this._model.vp; }
  get f() { return this._model.f; }
  get fP() { return this._model.fP; }
  get vP() { return this._model.vP; }
  get vI() { return this._reglModel.vI; }
  get vC() { return this._model.vC; }
  get vCount() { return this._model.vCount; }
  get texture() { return this._texture; }

  constructor (id, type, x = 0, y = 0, z = 0, rX = 0, rY = 0, rZ = 0) {
    this._id = id;
    this._type = type;
    this._x = x;
    this._y = y;
    this._z = z;
    this._rX = rX;
    this._rY = rY;
    this._rZ = rZ;
    this._width = staticJSON[type] ? staticJSON[type].width : 0;
    this._length = staticJSON[type] ? staticJSON[type].length : 0;
    this._height = staticJSON[type] ? staticJSON[type].height : 0;
    this._color = staticJSON[type] ? staticJSON[type].color : '0,0,0';
    this._model = Obj.importObj(`./src/assets/models/${type}.obj`);
    this._reglModel = Obj.importForRegl(`./src/assets/models/${type}.obj`);
    this._texture = staticJSON[type] ? staticJSON[type].texture : '';
  }
}

module.exports = Entity;
