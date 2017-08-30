const log = debug('render/funcs/func.frame');

module.exports = () => {
  log('Drawing...');
  // Require drawing functions.
  drawProp = require('../cmds/cmd.drawProp');
  drawGrid = require('../cmds/cmd.drawGrid');
  // Draw loop.
  gl_tick = gl_regl.frame(() => {
    // Clear the scene before the draw.
    gl_regl.clear({
      depth: 1,
      color: [0.1, 0.1, 0.1, 1]
    });
    // Use camera context and draw.
    gl_camera({
      camera: game_camera,
      target: [0, 0, 0],
      fov: game_camera.fov,
    }, () => {
      drawProp(staticProps);
      drawGrid(grid);
    });
    // Real-time data for debuggers.
    gl_cpuTime = (drawProp.stats.cpuTime / performance.now()).toFixed(4);
    gl_gpuTime = (drawProp.stats.gpuTime / performance.now()).toFixed(4);
  });
};
