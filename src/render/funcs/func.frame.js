const log = debug('render/funcs/func.frame');

module.exports = () => {
  // const drawBunny = require('../cmds/cmd.drawBunny');
  const drawProp = require('../cmds/cmd.drawProp');
  log('Drawing...');
  gl_tick = gl_regl.frame(() => {
    gl_regl.clear({
      depth: 1,
      color: [0.05, 0.05, 0.05, 1]
    });
    if (staticProps && staticProps.length) {
      drawProp(staticProps);
    }
    // drawBunny();
  });
};
