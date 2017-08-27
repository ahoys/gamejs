const log = debug('render/funcs/func.frame');

module.exports = () => {
  let drawProp;
  log('Drawing...');
  gl_tick = gl_regl.frame(() => {
    gl_regl.clear({
      depth: 1,
      color: [0.2, 0.1, 0.1, 1]
    });
    if (gl_camera) {
      if (!drawProp) {
        drawProp = require('../cmds/cmd.drawProp');
      }
      if (staticProps && staticProps.length) {
        drawProp(staticProps);
      }
    }
  });
};
