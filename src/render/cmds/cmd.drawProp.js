const log = debug('render/cmds/cmd.drawProp');
const mat4 = require('gl-mat4');
const normals = require('angle-normals');

module.exports = gl_regl({
  vert: `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    varying lowp vec4 color;
    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      color = aVertexColor;
    }
  `,

  frag: `
    varying lowp vec4 color;
    void main(void) {
      gl_FragColor = color;
    }
  `,
  
  attributes: {
    aVertexPosition: gl_regl.prop.v || [],
    aVertexColor: gl_regl.prop.vC || [],
    // normal: normals(gl_regl.prop.vI, gl_regl.prop.v)
  },

  elements: gl_regl.prop.v || [],

  uniforms: {
    color: gl_regl.prop.vC || [],
    uPMatrix: gl_regl.prop.vC ? gl_regl.prop.v : [],
    uMVMatrix: gl_regl.prop.vC ? gl_regl.prop.v : [],
  },

  count: gl_regl.prop.vI ? gl_regl.prop.vI.length : 0,
});