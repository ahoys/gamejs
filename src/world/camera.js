/**
 * Camera
 * 
 * The camera marks the viewport position and
 * attributes. It is what the player sees.
 * @extends position
 * @extends rotation
 * @extends movement
 */
module.exports = Object.assign(
  {
    fov: 1.5708,

    /**
     * Sets a new fov value that can be
     * between 65 and 135 degres.
     */
    setFov: function (v) {
      if (Number(v) > 2.35619) {
        this.fov = 2.35619;
      } else if (Number(v) < 1.13446) {
        this.fov = 1.13446;
      } else {
        this.fov = Number(v);
      }
    },
  },
  require('./modules/position'),
  require('./modules/rotation'),
  require('./modules/movement'),
);
