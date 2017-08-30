const log = debug('render/cmds/cmd.drawGrid');
const mat4 = require('gl-mat4');

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

  primitive: 'lines',

  count: gl_regl.prop('v').length,

  uniforms: {
    model: mat4.identity([]),
  }
});
