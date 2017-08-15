const Matrix = require('../../utilities/util.matrix');

class Renderer {

  /**
   * Returns a distance of two points in a 3D-space.
   * @param {*} v1 
   * @param {*} v2 
   */
  getDistance3D(v1, v2) {
    const dx = v1[0][0] - v2[0][0];
    const dy = v1[1][0] - v2[1][0];
    const dz = v1[2][0] - v2[2][0];
    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  /**
   * Returns a surface normal.
   * @param {*} p 
   */
  getSurfaceNormal(p) {
    const normal = [0,0,0];
    for (let i = 0; i < p.length; i++) {
      const j = (i + 1) % p.length;
      normal[0] += (p[i][1] - p[j][1]) * (p[i][2] + p[j][2]);
      normal[1] += (p[i][2] - p[j][2]) * (p[i][2] + p[j][2]);
      normal[2] += (p[i][1] - p[j][1]) * (p[i][1] + p[j][1]);
    }
    return normal;
  }

  /**
   * Draws debug information about objects.
   * @param {*} obj 
   */
  drawObjDebug2D(obj) {
    obj[1].forEach((origin, i) => {
      if (obj[3] < 700) {
        this.drawText2D((obj[2][i]).toFixed(2), origin[0][0], origin[1][0], 'black');
        this.drawText2D(
          `[${(obj[1][i][0][0]).toFixed(0)}.` +
          `${(obj[1][i][1][0]).toFixed(0)}.` +
          `${(obj[1][i][2][0]).toFixed(0)}]`,
          origin[0][0], origin[1][0] + 16, 'blue');
      }
    });
  }

  /**
   * Draws debug information about the viewport.
   */
  drawViewportDebug2D(x = 16, y = 16, color = 'white') {
    const vp = this._viewport;
    this.drawText2D(`${vp.x}, ${vp.y}, ${vp.z}, ${vp.roll}, ${vp.pitch}, ${vp.yaw}`, x, y, color);
    this.drawText2D(`ORIGIN`, vp.x, vp.y, 'red');
    this.drawText2D(`OFFSET ${vp.origin}`, x, y + 16, 'white');
    this.drawText2D(`OFFSET`, vp.origin[0], vp.origin[1], 'red');
    this.drawText2D(`CAMERA ${vp.camera.z}`, x, y + 32, 'white');
    this.drawText2D(`CAMERA`, vp.camera.x, vp.camera.y, 'white');
  }

  /**
   * Draws a plane.
   * @param {*} pV 
   * @param {*} r 
   * @param {*} g 
   * @param {*} b 
   * @param {*} a 
   */
  drawPlane2D(pV, r, g, b, a = 1) {
    this._ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    pV.forEach(v => {
      this._ctx.lineTo(v[0], v[1]);
    });
    this._ctx.fill();
  }

  /**
   * Draws a text string to the canvas.
   * @param {string} str 
   * @param {number} x 
   * @param {number} y 
   * @param {string} color 
   */
  drawText2D(str, x, y, color) {
    this._ctx.fillStyle = color;
    this._ctx.fillText(str, x, y);
  }

  /**
   * Draws a scene.
   * @param {*} buffer 
   */
  drawScene(buffer, debug = true, wireframe = false) {
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    buffer.forEach(obj => {
      // Draw all planes.
      this._ctx.beginPath();
      const cDepth = Math.floor(obj[3] / 100);
      obj[0].forEach(plane => this.drawPlane2D(
        plane, obj[4].r + cDepth, obj[4].g + cDepth, obj[4].b + cDepth));
      if (debug) this.drawObjDebug2D(obj);
    });
    if (debug) this.drawViewportDebug2D();
  }

  /**
   * Builds a scene for scene drawing.
   * @param {*} objects 
   */
  buildScene(objects, camera, debug) {
    const d_performance = performance.now();
    let d_string = '';

    // Initialize the viewport.
    const vp = this._viewport;
    const vpo = [[vp.camera.x], [vp.camera.y], [vp.camera.z]];

    // Calculate matrices.
    const tM = Matrix.getTransformationMatrix(vp.x, vp.y, vp.z);
    const tMoffset = Matrix.getTransformationMatrix(vp.origin[0], vp.origin[1], 1); // Translation matrix.
    const sM = Matrix.getScalingMatrix(vp.z, vp.z, vp.z); // Scaling matrix.
    const rMR = Matrix.getRotationMatrixRoll(-vp.roll); // Rotation roll matrix.
    const rMP = Matrix.getRotationMatrixPitch(-vp.pitch); // Rotation pitch matrix.
    const rMY = Matrix.getRotationMatrixYaw(-vp.yaw); // Rotation yaw matrix.
    const Rm = Matrix.multiply(Matrix.multiply(rMR, rMP), rMY); // Rotation.
    const M = Matrix.multiply(Matrix.multiply(Matrix.multiply(tMoffset, Rm), sM), tM); // Final matrix.

    // Initialize buffers.
    const pBuffer = []; // All vertices for constructing planes.
    const tBuffer = []; // Textual strings.
    let draw = false;

    // Objects are in a 3D space.
    objects.forEach(obj => {
      draw = true;
      const planeObject = [[], [], [], 0, obj.baseColor]; // 0: vertices, 1: origins, 2: distances, 3, closest, 4: color.

      // Calculate primary (top) plane. Every object (2D/3D) has one.
      planeObject[1].push(Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length/2], [obj.z + obj.height], [1]]));
      planeObject[2].push(this.getDistance3D(planeObject[1][0], vpo));
      planeObject[0].push(
        [
          Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
          Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
          Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
          Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
        ]
      );
      planeObject[3] = planeObject[2][0];
      if (obj.height) {
        // 3-dimensional object.
        // Front.
        planeObject[1].push(Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y], [obj.z + obj.height/2], [1]]));
        planeObject[2].push(this.getDistance3D(planeObject[1][1], vpo));
        planeObject[0].push(
          [
            Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
          ]
        );
        // Right.
        planeObject[1].push(Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length/2], [obj.z + obj.height/2], [1]]));
        planeObject[2].push(this.getDistance3D(planeObject[1][2], vpo));
        planeObject[0].push(
          [
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
          ]
        );
        // Back.
        planeObject[1].push(Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length], [obj.z + obj.height/2], [1]]));
        planeObject[2].push(this.getDistance3D(planeObject[1][3], vpo));
        planeObject[0].push(
          [
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
          ]
        );
        // Left.
        planeObject[1].push(Matrix.multiply(M, [[obj.x], [obj.y + obj.length/2], [obj.z + obj.height/2], [1]]));
        planeObject[2].push(this.getDistance3D(planeObject[1][4], vpo));
        planeObject[0].push(
          [
            Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
          ]
        );
        // Bottom.
        planeObject[1].push(Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length/2], [obj.z], [1]]));
        planeObject[2].push(this.getDistance3D(planeObject[1][5], vpo));
        planeObject[0].push(
          [
            Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
            Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
          ]
        );
        planeObject[3] = Math.min(planeObject[2][0], planeObject[2][1], planeObject[2][2], planeObject[2][3], planeObject[2][4], planeObject[2][5]);
      }
      pBuffer.push(planeObject);
    });

    // The next step is to re-order the planes based on distance between plane origo and the viewport.
    // TODO: calculate surface normals.
    pBuffer.sort((a, b) => b[3] - a[3]);
    if (draw) this.drawScene(pBuffer);
  }
  
  constructor(stage, viewport) {
    this._stage = stage;
    this._ctx = this._stage.getContext('2d');
    this._viewport = viewport;
  }
}

module.exports = Renderer;
