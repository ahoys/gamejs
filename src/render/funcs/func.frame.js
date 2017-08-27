const log = debug('render/funcs/func.frame');

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
    // Draw props.
    if (staticProps) {
      drawProp(staticProps);
    }
  });
};
