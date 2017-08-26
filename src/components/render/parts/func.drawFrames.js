const log = debug('components/render/parts/func.drawScene');
const drawBunny = require('./func.drawBunny');

module.exports = () => {
  log('Start drawing...');
  gl_tick = gl_regl.frame(() => {
    gl_regl.clear({
      depth: 1,
      color: [0.05, 0.05, 0.05, 1]
    })
    drawBunny();
  });
};
