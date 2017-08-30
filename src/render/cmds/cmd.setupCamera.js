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
      const m_rX = mat4.rotateX([], m, rX);
      const m_rY = mat4.rotateY([], m, rY);
      const m_rZ = mat4.rotateZ([], m, rZ);
      const m_t = mat4.translate([], m, [x, y, z, 1]);
      const rotation = mat4.multiply([], mat4.multiply([], m_rZ, m_rY), m_rX);
      return mat4.multiply([], rotation, m_t);
    },
    eye: gl_regl.prop('eye'),
  },
  uniforms: {
    view: gl_regl.context('view'),
    projection: gl_regl.context('projection'),
    'lights[0].color': [1, 0, 0],
    'lights[1].color': [0, 1, 0],
    'lights[2].color': [0, 0, 1],
    'lights[3].color': [1, 1, 0],
    'lights[0].position': ({tick}) => {
      const t = 0.1 * tick
      return [
        10 * Math.cos(0.09 * (t)),
        10 * Math.sin(0.09 * (2 * t)),
        10 * Math.cos(0.09 * (3 * t))
      ]
    },
    'lights[1].position': ({tick}) => {
      const t = 0.1 * tick
      return [
        10 * Math.cos(0.05 * (5 * t + 1)),
        10 * Math.sin(0.05 * (4 * t)),
        10 * Math.cos(0.05 * (0.1 * t))
      ]
    },
    'lights[2].position': ({tick}) => {
      const t = 0.1 * tick
      return [
        10 * Math.cos(0.05 * (9 * t)),
        10 * Math.sin(0.05 * (0.25 * t)),
        10 * Math.cos(0.05 * (4 * t))
      ]
    },
    'lights[3].position': ({tick}) => {
      const t = 0.1 * tick
      return [
        10 * Math.cos(0.1 * (0.3 * t)),
        10 * Math.sin(0.1 * (2.1 * t)),
        10 * Math.cos(0.1 * (1.3 * t))
      ]
    }
  }
});
