const log = debug('render/cmds/cmd.drawProp');
const mat4 = require('gl-mat4');
const normals = require('angle-normals');

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
    view: () => gl_camera.view(),
    projection: () => gl_camera.projection(),
  },
});
