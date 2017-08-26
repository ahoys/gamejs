module.exports = {
  init: require('./parts/func.drawFrames'),
  cancel: () => {
    if (gl_tick) {
      gl_tick.cancel();
      gl_tick = undefined;
    }
  }
};
