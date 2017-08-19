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

    this._vertexPositionAttribute = this._gl.getAttribLocation(
      this._shaderProgram,
      'aVertexPosition'
    );
    this._gl.enableVertexAttribArray(this._vertexPositionAttribute);

    this._vertexColorAttribute = this._gl.getAttribLocation(this._shaderProgram, 'aVertexColor');
    this._gl.enableVertexAttribArray(this._vertexColorAttribute);
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

  /**
   * Adds props into a buffer, waiting for drawing.
   * @param {*} props 
   */
  addBuffer(props) {
    this._propVerticesBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._propVerticesBuffer);

    // TODO: remove this when props[12].v works.
    const vertices = [
      // Front face
      -0.5, -0.5,  0.5,
       0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,
      -0.5,  0.5,  0.5,
  
      // Back face
      -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,
       0.5,  0.5, -0.5,
       0.5, -0.5, -0.5,
  
      // Top face
      -0.5,  0.5, -0.5,
      -0.5,  0.5,  0.5,
       0.5,  0.5,  0.5,
       0.5,  0.5, -0.5,
  
      // Bottom face
      -0.5, -0.5, -0.5,
       0.5, -0.5, -0.5,
       0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5,
  
      // Right face
       0.5, -0.5, -0.5,
       0.5,  0.5, -0.5,
       0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,
  
      // Left face
      -0.5, -0.5, -0.5,
      -0.5, -0.5,  0.5,
      -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5
    ];

    // TODO: add all vertices.
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(props[12].vP), this._gl.STATIC_DRAW);

    // Colors -----------
    const colors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0]     // Left face: purple
    ];

    let generatedColors = [];
    for (let j=0; j<6; j++) {
      const c = colors[j];
      // Repeat each color four times for the four vertices of the face
      for (let i=0; i<4; i++) {
        generatedColors = generatedColors.concat(c);
      }
    }

    this._propVerticesColorBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._propVerticesColorBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(generatedColors), this._gl.STATIC_DRAW);

    // Indices ----------
    this._propVerticesIndexBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._propVerticesIndexBuffer);

    const propVertexIndices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ];

    this._gl.bufferData(
      this._gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(propVertexIndices),
      this._gl.STATIC_DRAW
    );
  }

  // Replaced by addBuffer!
  initBuffers(objects) {
    console.log('initBuffers', objects);
    objects.forEach(obj => {
      // Read color information.
      let generatedColors = [];
      for (let i = 0; i < 6; i++) {
        const c = obj.colors[j];
        for (let j = 0; j < 4; j++) {
          generatedColors = generatedColors.concat(c);
        }
      }
      this._objectVerticesColorBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._objectVerticesColorBuffer);
      this._gl.bufferData(this._gl, new Float32Array(generatedColors), this._gl.STATIC_DRAW);

      this._objectVerticesIndexBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._objectVerticesIndexBuffer);

      // Defines each face as two triangles.
      const objVertexIndices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
      ];

      this._gl.bufferData(
        this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objVertexIndices),
        this._gl.STATIC_DRAW
      );
    });
  }

  /**
   * For demoing colored block drawing.
   */
  demoInitBuffers() {
    this._squareVerticesBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._squareVerticesBuffer);
    const vertices = [
      1.0,  1.0,  0.0,
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
    // Below is a color example.
    const colors = [
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
      0.0,  1.0,  0.0,  1.0,    // green
      0.0,  0.0,  1.0,  1.0     // blue
    ];
    this._squareVerticesColorBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._squareVerticesColorBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(colors), this._gl.STATIC_DRAW);
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
    // Clear the canvas.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // Establish the perspective.
    this._perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

    // Set the drawing position to the identitity point (center of the scene).
    this.loadIdentity();

    // Position where we start drawing.
    this.mvTranslate([-0.0, 0.0, -6.0]);

    // Draw by binding the array buffer to the cube's vertices array.
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._propVerticesBuffer);
    this._gl.vertexAttribPointer(this._vertexPositionAttribute, 3, this._gl.FLOAT, false, 0, 0);

    // Colors.
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._propVerticesColorBuffer);
    this._gl.vertexAttribPointer(this._vertexColorAttribute, 4, this._gl.FLOAT, false, 0, 0);

    // Draw.
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._propVerticesIndexBuffer);
    this.setMatrixUniforms();
    this._gl.drawElements(this._gl.TRIANGLES, 36, this._gl.UNSIGNED_SHORT, 0);
  }

  constructor(canvas, viewport) {
    this._mvMatrix;
    this._shaderProgram;
    this._squareVerticesBuffer;
    this._squareVerticesColorBuffer;
    this._perspectiveMatrix;
    this._vertexPositionAttribute;
    this._vertexColorAttribute;

    // TODO remove.
    this._objectVerticesColorBuffer;
    this._objectVerticesIndexBuffer;

    this._propVerticesBuffer;
    this._propVerticesColorBuffer;
    this._propVerticesIndexBuffer;

    this._gl = this.initWebGL(canvas);
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this.initShaders();
    // Demo purposes.
    // this.demoInitBuffers();
    // this.drawScene();
  }
}

module.exports = GlRenderer;
