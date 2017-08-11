module.exports = {

  /**
   * Degrees to radians.
   * @param {number} deg
   */
  toRadians: (deg) => {
    return deg * Math.PI / 180
  },

  /**
   * Radians to degrees.
   * @param {number} rad
   */
  toDegrees: (rad) => {
    return rad * 180 / Math.PI;
  },

  /**
   * Returns angle in radians of two points.
   * @param {number} cx
   * @param {number} cy
   * @param {number} ex
   * @param {number} ey
   */
  getAngle: (cx, cy, ex, ey) => {
    return Math.atan2((ey - cy), (ex - cx));
  },

  /**
   * Returns new position for a point after a turn in
   * radians.
   * @param {number} x
   * @param {number} y
   * @param {number} amount
   * @param {number} rad
   */
  getTurnedPos: (x, y, amount, rad) => {
    return {
      x: x + amount * Math.sin(rad),
      y: y + amount * Math.cos(rad),
    }
  },
};
