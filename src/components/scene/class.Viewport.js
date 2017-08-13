const Matrix = require('./class.Matrix');

class Viewport {

  /**
   * Calculates 3D matrices for movement.
   * @param {number} tM
   */
  get3Dmovement(tM) {
    const rMR = Matrix.getRotationMatrixRoll(this._roll); // Rotation roll matrix.
    const rMY = Matrix.getRotationMatrixYaw(this._yaw); // Rotation yaw matrix.
    const Rm = Matrix.multiply(rMR, rMY); // Rotation.
    const M = tM;
    return Matrix.multiply(M, [[this._x], [this._y], [this._z], [1]]);
  }

  /**
   * Moves on all axels.
   * Basically means moving forward and backwards.
   * @param {number} v
   */
  doMoveXYZ(v) {
    const pos = this.get3Dmovement(
      Matrix.getTransformationMatrix(Number(v), Number(v), Number(v)));
    this._x = pos[0][0].toFixed(2);
    this._y = pos[1][0].toFixed(2);
    this._z = pos[2][0].toFixed(2);
  }

  /**
   * Moves on x-axel.
   * @param {number} v
   */
  doMoveX(v) {
    const pos = this.get3Dmovement(Matrix.getTransformationMatrix(Number(v), 0, 0));
    this._x = pos[0][0].toFixed(2);
    this._y = pos[1][0].toFixed(2);
  }

  /**
   * Moves on y-axel.
   * @param {number} v
   */
  doMoveY(v) {
    const pos = this.get3Dmovement(Matrix.getTransformationMatrix(0, Number(v), 0));
    this._x = pos[0][0].toFixed(2);
    this._y = pos[1][0].toFixed(2);
  }

  /**
   * Roll on x-axel.
   * @param {*} v 
   */
  doRoll(v) {
    this._yaw += Number(v.toFixed(2));
  }

  /**
   * Pich on y-axel.
   * @param {*} v 
   */
  doPitch(v) {
    this._pitch += Number(v.toFixed(2));
  }

  /**
   * Yaw on z-axel.
   * @param {*} v 
   */
  doYaw(v) {
    this._yaw += Number(v.toFixed(2));
  }

  /**
   * Resets the viewport back to the original values.
   */
  doReset() {
    this._x = this._resetValues.x;
    this._y = this._resetValues.y;
    this._z = this._resetValues.z;
    this._roll = this._resetValues.roll;
    this._pitch = this._resetValues.pitch;
    this._yaw = this._resetValues.yaw;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  get roll() {
    return this._roll;
  }

  get pitch() {
    return this._pitch;
  }

  get yaw() {
    return this._yaw;
  }

  set width(n) {
    this._width = Number(n);
  }

  get width() {
    return this._width;
  }

  set length(n) {
    this._length = Number(n);
  }

  get length() {
    return this._length;
  }

  constructor(x = 0, y = 0, z = 0, roll = 0, pitch = 0, yaw = 0, width, length) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._roll = roll; // Axis of rotation: x.
    this._yaw = yaw; // Axis of rotation: z.
    this._pitch = pitch; // Axis of rotation: y.
    this._width = width;
    this._length = length;
    this._resetValues = {x, y, z, roll, pitch, yaw};
  }
}

module.exports = Viewport;
