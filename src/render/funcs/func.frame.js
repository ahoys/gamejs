const log = debug('render/funcs/func.frame');

module.exports = () => {
  log('Drawing...');
  // Require drawing functions.
  drawProp = require('../cmds/cmd.drawProp');
  drawBunny = require('../cmds/cmd.drawBunny');
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
      // drawProp(staticProps);
      drawBunny();
    });
    // Real-time data for debuggers.
    gl_cpuTime = (drawBunny.stats.cpuTime / performance.now()).toFixed(4);
    gl_gpuTime = (drawBunny.stats.gpuTime / performance.now()).toFixed(4);
  });
};
