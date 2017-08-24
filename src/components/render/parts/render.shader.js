module.exports = {
  
  /**
   * Returns a shader based on an id.
   * The shader must exist in the document.
   */
  getOfElementId: (gl, id) => {
    // Read the shader.
    const { text, type } = document.getElementById(id);
    // Text holds the shader code. Must have.
    if (!text) {
      console.log(`Error: unknown shader id: ${id}.`);
      throw 0;
    }
    // Type must exist so that we can select a corresponding shader.
    if (!type) {
      console.log(`Error: unknown shader type: ${type}.`);
      throw 0;
    }
    // Select the shader type.
    let glType;
    if (type === 'x-shader/x-fragment') {
      glType = gl.FRAGMENT_SHADER;
    } else if (type === 'x-shader/x-vertex') {
      glType = gl.VERTEX_SHADER;
    }
    // Create the shader.
    const shader = gl.createShader(glType);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(`Error: unable to compile the shader: ${gl.getShaderInfoLog(shader)}.`);
      gl.deleteShader(shader);
      throw 0;
    }
    return shader;
  }
};
