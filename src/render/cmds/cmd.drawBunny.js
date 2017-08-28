const log = debug('render/cmds/cmd.drawBunny');
const mat4 = require('gl-mat4');
const bunny = require('bunny');
const normals = require('angle-normals');

module.exports = gl_regl({
  vert: `
  precision mediump float;
  attribute vec3 position, normal;
  uniform mat4 view, projection;
  varying vec3 fragNormal, fragPosition;
  void main() {
    fragNormal = normal;
    fragPosition = position;
    gl_Position = projection * view * vec4(position, 1);
  }`,

  frag: `
  precision mediump float;
  struct Light {
    vec3 color;
    vec3 position;
  };
  uniform Light lights[4];
  varying vec3 fragNormal, fragPosition;
  void main() {
    vec3 normal = normalize(fragNormal);
    vec3 light = vec3(0, 0, 0);
    for (int i = 0; i < 4; ++i) {
      vec3 lightDir = normalize(lights[i].position - fragPosition);
      float diffuse = max(0.0, dot(lightDir, normal));
      light += diffuse * lights[i].color;
    }
    gl_FragColor = vec4(light, 1);
  }`,

  attributes: {
    position: bunny.positions,
    normal: normals(bunny.cells, bunny.positions)
  },

  elements: bunny.cells,
});
