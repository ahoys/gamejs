/**
 * DynamicProp
 * 
 * An in-game object that can be interacted with.
 * Eg. a breakable crate.
 * @extends position
 * @extends rotation
 * @extends graphics
 * @extends movement
 */
module.exports = Object.assign(
  {
    type: 'dynamic',
  },
  require('./modules/position'),
  require('./modules/rotation'),
  require('./modules/graphics'),
  require('./modules/movement'),
);
