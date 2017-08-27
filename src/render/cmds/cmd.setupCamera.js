const log = debug('render/cmds/cmd.setupCamera');
const mat4 = require('gl-mat4');

module.exports = gl_regl({
  profile: true,
  context: {
    projection: (context, props) => {
      return mat4.perspective(
        [],
        props.fov,
        context.viewportWidth / context.viewportHeight,
        0.01,
        1000.0
      )
    },
    view: (context, props) => {
      return mat4.lookAt(
        [],
        props.eye,
        props.target,
        [0, 1, 0]
      )
    },
    eye: gl_regl.prop('eye'),
  },
  uniforms: {
    view: gl_regl.context('view'),
    projection: gl_regl.context('projection'),
  }
});
