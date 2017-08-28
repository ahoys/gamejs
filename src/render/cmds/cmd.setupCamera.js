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
      const { x, y, z, rX, rY, rZ, fov } = props.camera;
      const m = mat4.create();
      const m_t = mat4.translate([], m, [x, y, z, 1]);
      const m_rX = mat4.rotateX([], m, rX);
      const m_rY = mat4.rotateY([], m, rY);
      const m_rZ = mat4.rotateZ([], m, rZ);
      return mat4.multiply([], mat4.multiply([], mat4.multiply([], m_rZ, m_rY), m_rX), m_t);
    },
    eye: gl_regl.prop('eye'),
  },
  uniforms: {
    view: gl_regl.context('view'),
    projection: gl_regl.context('projection'),
  }
});
