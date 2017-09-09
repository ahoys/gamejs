/**
 * StaticProp
 * 
 * An in-game object that does not move and cannot
 * be interacted with. Eg. a rock.
 * @extends position
 * @extends rotation
 * @extends graphics
 */
module.exports = Object.assign(
  {
    type: 'static',
  },
  require('./modules/position'),
  require('./modules/rotation'),
  require('./modules/graphics'),
);
