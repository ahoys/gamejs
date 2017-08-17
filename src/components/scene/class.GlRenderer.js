class GlRenderer {

  /**
   * Refreshes viewport size.
   * @param {number} width
   * @param {number} height
   */
  setViewportSize(width, height) {
    this._gl.viewport(0, 0, Number(width), Number(height));
  }

  /**
   * Initializes the WebGL renderer by providing
   * a suitable webGL context. Also makes sure that
   * rendering requirements are met.
   * @param {*} canvas 
   */
  initWebGL(canvas) {
    const nGl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!nGl) {
      console.log('Unable to initialize WebGL.');
      throw 0;
    }
    return nGl;
  }

  /**
   * Initializes shaders.
   */
  initShaders() {
    const fragmentShader = this.getShader(this._gl, 'shader-fs');
    const vertexShader = this.getShader(this._gl, 'shader-vs');
    this._shaderProgram = this._gl.createProgram();
    this._gl.attachShader(this._shaderProgram, vertexShader);
    this._gl.attachShader(this._shaderProgram, fragmentShader);
    this._gl.linkProgram(this._shaderProgram);
    if (!this._gl.getProgramParameter(this._shaderProgram, this._gl.LINK_STATUS)) {
      console.log(`Unable to initialize the shader program. ` +
      `${this._gl.getProgramInfoLog(this._shaderProgram)}`);
      throw 0;
    }
    this._gl.useProgram(this._shaderProgram);
    this._gl.enableVertexAttribArray(
      this._gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
    );
  }

  /**
   * Returns a shader.
   * @param {*} gl 
   * @param {*} id 
   * @param {*} type 
   */
  getShader(gl, id, type) {
    // Once the element is found, read its text.
    const shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }
    const theSource = shaderScript.text;
    // Create appropriate type of shader from the retrieved source code.
    if (!type) {
      if (shaderScript.type === 'x-shader/x-fragment') {
        type = gl.FRAGMENT_SHADER;
      } else if (shaderScript.type == 'x-shader/x-vertex') {
        type = gl.VERTEX_SHADER;
      } else {
        return null;
      }
    }
    const shader = gl.createShader(type);
    // Pass the source into the shader and compile.
    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(`Unable to compile the shaders. ` +
      `${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  initBuffers() {
    this._squareVerticesBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._squareVerticesBuffer);
    const vertices = [
      1.0,  1.0,  0.0,
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
  }

  loadIdentity() {
    this._mvMatrix = Matrix.I(4);
  }

  multMatrix(m) {
    this._mvMatrix = this._mvMatrix.x(m);
  }

  mvTranslate(v) {
    this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
  }

  setMatrixUniforms() {
    const pUniform = this._gl.getUniformLocation(this._shaderProgram, 'uPMatrix');
    this._gl.uniformMatrix4fv(pUniform, false, new Float32Array(this._perspectiveMatrix.flatten()));
    const mvUniform = this._gl.getUniformLocation(this._shaderProgram, "uMVMatrix");
    this._gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this._mvMatrix.flatten()));
  }

  drawScene() {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
    this.loadIdentity();
    this.mvTranslate([-0.0, 0.0, -6.0]);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._squareVerticesBuffer);
    this._gl.vertexAttribPointer(this._vertexPositionAttribute, 3, this._gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
  }

  constructor(canvas, viewport) {
    this._mvMatrix;
    this._shaderProgram;
    this._squareVerticesBuffer;
    this._perspectiveMatrix;
    this._vertexPositionAttribute;
    this._gl = this.initWebGL(canvas);
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this.initShaders();
    this.initBuffers();
    this.drawScene();
  }
}

module.exports = GlRenderer;
