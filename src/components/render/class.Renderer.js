const Canvas = require('./parts/render.canvas');
const Shader = require('./parts/render.shader');
const Debug = require('./parts/render.debug');

let gl, fShader, vShader, sProgram, vPositionAttribute, vColorAttribute, pVerticesBuffer,
pVerticesColorBuffer, pVerticesIndexBuffer, mvUniform, mvMatrix, mvMatrixStack = [],
perspectiveMatrix, camera, props;

/**
 * WebGL renderer.
 * 
 * Written by Ari Höysniemi, 2017.
 * ari.hoysniemi@gmail.com
 */
class Renderer {

  /**
   * Sets an identity point.
   */
  mvIdentity() {
    mvMatrix = Matrix.I(4);
  }

  /**
   * Multiplies the matrix against the main matrix.
   * @param {array} m 
   */
  mvMultiply(m) {
    mvMatrix = mvMatrix.x(m);
  }

  /**
   * Translates a point.
   * @param {array} v 
   */
  mvTranslate(v) {
    this.mvMultiply(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
  }

  /**
   * Rotates the main matrix.
   * @param {*} a Angle.
   * @param {*} v Point.
   */
  mvRotate(a, v) {
    this.mvMultiply(Matrix.Rotation(a, $V([v[0], v[1], v[2]])).ensure4x4());
  }

  /**
   * Sets Matrix uniforms.
   */
  mvMatrixUniforms() {
    const pUniform = gl.getUniformLocation(sProgram, 'uPMatrix');
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    mvUniform = gl.getUniformLocation(sProgram, 'uMVMatrix');
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }

  /**
   * Pushes a matrix into a stack.
   * @param {array} m 
   */
  mvPushMatrix(m) {
    if (m) {
      mvMatrixStack.push(m.dup());
      mvMatrix = m.dup();
    } else {
      mvMatrixStack.push(mvMatrix.dup());
    }
  }

  /**
   * Pops a matrix from the stack.
   */
  mvPopMatrix() {
    if (mvMatrixStack[0]) {
      mvMatrix = mvMatrixStack.pop();
      return mvMatrix;
    }
    throw(`Can't pop from an empty matrix stack.`);
  }

  /**
   * Loads basic shaders.
   */
  initBaseShaders() {
    // Create a new program.
    sProgram = gl.createProgram();
    // Attach shaders to a program.
    gl.attachShader(sProgram, vShader);
    gl.attachShader(sProgram, fShader);
    // Link the program.
    gl.linkProgram(sProgram);
    // Look for problems.
    if (!gl.getProgramParameter(sProgram, gl.LINK_STATUS)) {
      console.log(`Error: unable to initialize the shader program: ` +
      `${gl.getProgramInfoLog(sProgram)}.`);
      throw 0;
    }
    // Use the program.
    gl.useProgram(sProgram);
    // Position.
    vPositionAttribute = gl.getAttribLocation(sProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vPositionAttribute);
    // Color.
    vColorAttribute = gl.getAttribLocation(sProgram, 'aVertexColor');
    gl.enableVertexAttribArray(vColorAttribute);
  }

  /**
   * Creates, binds and populates prop buffers.
   * @param {object} prop 
   */
  createPropBuffers(prop) {
    // Vertices.
    pVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(prop.v), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    // Color.
    pVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(prop.vC), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColorAttribute, 4, gl.FLOAT, false, 0, 0);
    // Indices.
    pVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pVerticesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(prop.vI), gl.STATIC_DRAW);
  }

  /**
   * Draws a new scene
   * @param {number} tick
   * @param {number} tickLength
   * @param {boolean} wf Wireframe true/false.
   */
  drawScene(tFrame, lastTick, tickLength, wf) {
    // Make sure there is something to render.
    if (!props) return null;
    // Start debugging.
    Debug.init();
    // Clear the screen.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Set the perspective.
    perspectiveMatrix = makePerspective(
      camera.fov, Canvas.getCanvasWidth()/Canvas.getCanvasHeight(), 0.1, 100.0
    );
    // Set the drawing position to the identitity point.
    this.mvIdentity();
    // Camera translations.
    this.mvTranslate([camera.x, camera.y, camera.z]);
    this.mvRotate(camera.rX, [1, 0, 0]);
    this.mvRotate(camera.rY, [0, 1, 0]);
    this.mvRotate(camera.rZ, [0, 0, 1]);
    // Handle props.
    props.forEach(prop => {
      // Register for debug.
      Debug.increasePropCount(1);
      Debug.increaseVertexCount(prop.vCount);
      // Create buffers.
      this.createPropBuffers(prop);
      // Save matrix state & translate.
      this.mvPushMatrix();
      this.mvTranslate([prop.x, prop.y, prop.z]);
      this.mvRotate(prop.rX, [1, 0, 0]);
      this.mvRotate(prop.rY, [0, 1, 0]);
      this.mvRotate(prop.rZ, [0, 0, 1]);
      // Draw.
      this.mvMatrixUniforms();
      gl.drawElements(wf ? gl.LINES : gl.TRIANGLES, prop.vI.length, gl.UNSIGNED_SHORT, 0);
      // Revert translation for the next object.
      this.mvPopMatrix();
      // Clear buffers to avoid memory leaks.
      gl.deleteBuffer(pVerticesBuffer);
      gl.deleteBuffer(pVerticesColorBuffer);
      gl.deleteBuffer(pVerticesIndexBuffer);
    });
    // Update debug information.
    Debug.refresh({ camera, tFrame, lastTick, tickLength });
  }

  /**
   * Sets props to be drawn.
   */
  set props(p) {
    props = p;
  }

  constructor(cam) {
    gl = Canvas.getContext();
    gl.clearColor(0.1, 0.05, 0.05, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    fShader = Shader.getOfElementId(gl, 'shader-fs');
    vShader = Shader.getOfElementId(gl, 'shader-vs');
    this.initBaseShaders();
    camera = cam;
  }
}

module.exports = Renderer;
