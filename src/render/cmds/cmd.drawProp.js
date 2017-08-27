const log = debug('render/cmds/cmd.drawProp');
const mat4 = require('gl-mat4');
const normals = require('angle-normals');
const bunny = require('bunny');

module.exports = gl_regl({
  vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 model, view, projection;
    void main() {
      gl_Position = projection * view * model * vec4(position, 1);
    }
  `,

  frag: `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `,
  
  attributes: {
    // Position === vertices relative to the world.
    // Eg. three points: [[x, y, z], [x, y, z], [x, y, z]].
    position: gl_regl.prop('v'),
  },

  // Elements === faces.
  // Eg. [[0,1,2]] means 1 face, using vertices 0, 1 and 2.
  // Vertices must be formatted as [[x, y, z], [x, y, z], [x, y, z]].
  elements: gl_regl.prop('vI'),

  uniforms: {
    model: mat4.identity([]),
    view: ({tick}) => {
      const t = 0.01 * tick
      return mat4.lookAt([],
        [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
        [0, 2.5, 0],
        [0, 1, 0])
    },
    projection: ({viewportWidth, viewportHeight}) =>
    mat4.perspective([],
      Math.PI / 4,
      viewportWidth / viewportHeight,
      0.01,
      1000)
  },
});