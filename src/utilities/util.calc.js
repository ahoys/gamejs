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
   * Returns relative speed based on a tick length.
   * @param {number} tickLength
   * @param {number} speed
   */
  getRelativeSpeed: (tickLength, speed) => {
    return tickLength / 1000 * speed;
  },
};
