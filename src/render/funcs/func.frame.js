const log = debug('render/funcs/func.frame');
const mat4 = require('gl-mat4');

module.exports = () => {
  log('Drawing...');
  // Require drawing functions.
  const drawProp = require('../cmds/cmd.drawProp');
  // Draw loop.
  gl_tick = gl_regl.frame(() => {
    // Clear the scene before the draw.
    gl_regl.clear({
      depth: 1,
      color: [0.2, 0.1, 0.1, 1]
    });
    // Use camera context and draw.
    gl_camera({
      eye: [game_camera.x, game_camera.y, game_camera.z],
      target: [0, 0, 0],
      fov: game_camera.fov,
    }, () => {
      drawProp(staticProps);
    });
  });
};
