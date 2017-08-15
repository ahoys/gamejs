const Matrix = require('../../utilities/util.matrix');

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
    return Matrix.multiply(M, [[this._x], [this._y], [this._z], [this._w]]);
  }

  /**
   * Moves on all axels.
   * Basically means moving forward and backwards.
   * @param {number} v
   */
  doMoveXYZ(v) {
    const pos = this.get3Dmovement(
      Matrix.getTransformationMatrix(Number(v), Number(v), Number(v)));
    this._x = pos[0][0];
    this._y = pos[1][0];
    this._z = pos[2][0];
    this.refreshOrigin();
    this.refreshCamera();
  }

  /**
   * Moves on x-axel.
   * @param {number} v
   */
  doMoveX(v) {
    const pos = this.get3Dmovement(Matrix.getTransformationMatrix(Number(v), 0, 0));
    this._x = pos[0][0];
    this._y = pos[1][0];
    this.refreshOrigin();
    this.refreshCamera();
  }

  /**
   * Moves on y-axel.
   * @param {number} v
   */
  doMoveY(v) {
    const pos = this.get3Dmovement(Matrix.getTransformationMatrix(0, Number(v), 0));
    this._x = pos[0][0];
    this._y = pos[1][0];
    this.refreshOrigin();
    this.refreshCamera();
  }

  /**
   * Roll on x-axel.
   * @param {*} v 
   */
  doRoll(v) {
    this._yaw += Number(v);
  }

  /**
   * Pich on y-axel.
   * @param {*} v 
   */
  doPitch(v) {
    this._pitch += Number(v);
  }

  /**
   * Yaw on z-axel.
   * @param {*} v 
   */
  doYaw(v) {
    this._yaw += Number(v);
  }

  /**
   * Updates the origin (the center point of the viewport).
   * This should basically mirror the vp.
   */
  refreshOrigin() {
    const pos = this.get3Dmovement(
      Matrix.getTransformationMatrix(
        -this._x + document.body.clientWidth / 2,
        -this._y + document.body.clientHeight / 2,
        -this._z,
      )
    );
    this._origin = [pos[0][0], pos[1][0]];
  }

  /**
   * Updates virtual camera position based on the viewport.
   * Virtual camera is used to calculate in-game distances to the camera.
   */
  refreshCamera() {
    const pos = this.get3Dmovement(Matrix.getTransformationMatrix(-this._x, -this._y, -this._z));
    this._camera.x = pos[0][0] + document.body.clientWidth/2;
    this._camera.y = pos[1][0] + document.body.clientHeight;
    this._camera.z = document.body.clientHeight / this._z || 1;
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
    refreshOrigin();
    refreshCamera();
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

  get origin() {
    return this._origin;
  }

  constructor(x = 0, y = 0, z = 0, roll = 0, pitch = 0, yaw = 0, width, length, camera) {
    this._x = x;
    this._y = y;
    this._w = 1;
    this._roll = roll;
    this._pitch = pitch;
    this._yaw = yaw;

    // Translate required height to camera scale.
    this._z = 1000 / camera.z;
    this._camera = camera;
    this.refreshCamera();

    // Calculate the center position.
    this.refreshOrigin();

    // Save reset values after everything is calculated.
    this._resetValues = {
      x: this._x,
      y: this._y,
      z: this._z,
      roll: this._roll,
      pitch: this._pitch,
      yaw: this._yaw,
    };
  }
}

module.exports = Viewport;
