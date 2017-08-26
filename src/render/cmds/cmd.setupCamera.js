const log = debug('render/cmds/cmd.setupCamera');
const regl = require('regl');
const mat4 = require('gl-mat4');

module.exports = regl({
  context: {
    projection: (context) => {
      return mat4.perspective(
        [],
        Math.PI / 4,
        context.viewportWidth / context.viewportHeight,
        0.01,
        1000.0
      );
    },

    view: (context, props) => {
      return mat4.lookAt(
        [],
        props.eye,
        props.target,
        [0, 1, 0]
      );
    },

    eye: regl.props('eye'),
  },

  uniforms: {
    view: regl.context('view'),
    invView: (context) => {
      return mat4.inverse([], context.view)
    },
    projection: regl.context('projection'),
  }
});
