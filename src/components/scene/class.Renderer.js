const _ = require('lodash');
const Matrix = require('./class.Matrix');

class Renderer {

  /**
   * Returns middle point of two points.
   * @param {*} a [x1, y1]
   * @param {*} c [x2, y2]
   */
  getMidPoint(a, c) {
    return [((a[0] + c[0]) / 2), ((a[1] + c[1]) / 2)];
  }

  getDistance3D(v1, v2) {
    const dx = v1[0][0] - v2[0][0];
    const dy = v1[1][0] - v2[1][0];
    const dz = v1[2][0] - v2[2][0];
    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  isFacing(targetDistance, arr) {
    return true;
    // let c = 0;
    // arr.forEach(d => {
    //   if (targetDistance < d) {
    //     c++;
    //   }
    // });
    // return c > 0;
  }

  getNormal(p) {
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
      if (obj[2][i] < 100) {
        this.drawText2D((obj[2][i]).toFixed(2), origin[0][0], origin[1][0], 'black');
        this.drawText2D(
          `${(obj[1][i][0][0]).toFixed(0)}.` +
          `${(obj[1][i][1][0]).toFixed(0)}.` +
          `${(obj[1][i][2][0]).toFixed(0)}`,
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
    this.drawText2D(`VP`, vp.x, vp.y, 'red');
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
      obj[0].forEach(plane => this.drawPlane2D(plane, obj[4].r, obj[4].g, obj[4].b));
      if (debug) this.drawObjDebug2D(obj);
    });
    if (debug) this.drawViewportDebug2D();
  }

  drawMask0(planeBuffer, vp) {
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    planeBuffer.forEach(data => {
      const cVal = (255 * vp.z / data[0]).toFixed(0);
      this._ctx.beginPath();
      data[1].forEach(l => {
        this._ctx.lineTo(l[0], l[1]);
      });
      this._ctx.fillStyle = `rgb(${cVal},${cVal},${cVal})`;
      this._ctx.fill();
    });
  }

  /**
   * Builds a scene for scene drawing.
   * @param {*} objects 
   */
  buildScene(objects, debug) {
    const d_performance = performance.now();
    let d_string = '';

    // Initialize the viewport.
    const vp = this._viewport;
    const vpX = vp.x;
    const vpY = vp.y;
    const vpZ = vp.z;
    const vpo = [vpX, vpY, vpZ];

    // Calculate matrices.
    const tM = Matrix.getTransformationMatrix(vpX, vpY, vpZ); // Translation matrix.
    const sM = Matrix.getScalingMatrix(vpZ, vpZ, vpZ); // Scaling matrix.
    const rMR = Matrix.getRotationMatrixRoll(vp.roll); // Rotation roll matrix.
    const rMP = Matrix.getRotationMatrixPitch(vp.pitch); // Rotation pitch matrix.
    const rMY = Matrix.getRotationMatrixYaw(vp.yaw); // Rotation yaw matrix.
    const Rm = Matrix.multiply(Matrix.multiply(rMR, rMP), rMY); // Rotation.
    const M = Matrix.multiply(Matrix.multiply(tM, Rm), sM); // Final matrix.

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

  /**
   * Builds a three dimensional scene
   * of the world.
   */
  build3Dscene(objectMatrix) {
    const perf0 = performance.now();
    let str0 = '';

    // Initialize the viewport.
    const vp = this._viewport;
    const vpo = [[vp.x + vp.width/2], [vp.y + vp.length/2], [vp.z]];

    // Calculate matrices.
    const tMatrix = Matrix.getTranslationMatrix(vp.x, vp.y, vp.z);
    const sMatrix = Matrix.getScalingMatrix(vp.z, vp.z, vp.z);
    const rMatrixRoll = Matrix.getRotationMatrix('roll', vp.roll);
    const rMatrixPitch = Matrix.getRotationMatrix('pitch', vp.pitch);
    const rMatrixYaw = Matrix.getRotationMatrix('yaw', vp.yaw);

    // Clear the rect as delayed as possible.
    const planeBuffer = [];

    objectMatrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          const rot = Matrix.multiply(Matrix.multiply(rMatrixRoll, rMatrixPitch), rMatrixYaw);
          const M = Matrix.multiply(Matrix.multiply(tMatrix, rot), sMatrix);

          if (obj.height) {
            const distances = [-1, -1 -1];
            const side0 = true, side1 = true, side2 = false, side3 = false, top = true;

            // top
            const tmid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length/2], [obj.z * obj.height], [1]]);
            const std = this.getDistance3D(tmid, vpo);
            const t = [
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            ];

            // front
            const s0mid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y], [obj.z * obj.height/2], [1]]);
            const s0d = this.getDistance3D(s0mid, vpo);
            const s0 = [
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
            ];

            // right
            const s1mid = Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length/2], [obj.z * obj.height/2], [1]]);
            const s1d = this.getDistance3D(s1mid, vpo);
            const s1 = [
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
            ];

            // back
            const s2mid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length], [obj.z * obj.height/2], [1]]);
            const s2d = this.getDistance3D(s2mid, vpo);
            const s2 = [
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
            ];

            // left
            const s3mid = Matrix.multiply(M, [[obj.x], [obj.y + obj.length/2], [obj.z * obj.height/2], [1]]);
            const s3d = this.getDistance3D(s3mid, vpo);
            const s3 = [
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
            ];

            if (this.isFacing(tmid, [s0mid, s1mid, s2mid, s3mid])) {
              planeBuffer.push([std, t, obj.baseColor]);
            }

            if (this.isFacing(s0mid, [tmid, s1mid, s2mid, s3mid])) {
              planeBuffer.push([s0d, s0, obj.baseColor]);
            }

            if (this.isFacing(s1mid, [tmid, s0mid, s2mid, s3mid])) {
              planeBuffer.push([s1d, s1, obj.baseColor]);
            }

            if (this.isFacing(s2mid, [tmid, s0mid, s1mid, s3mid])) {
              planeBuffer.push([s2d, s2, obj.baseColor]);
            }

            if (this.isFacing(s3mid, [tmid, s0mid, s1mid, s2mid])) {
              planeBuffer.push([s3d, s3, obj.baseColor]);
            }
          } else {
            const mid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length/2], [obj.z * obj.height/2], [1]]);
            planeBuffer.push([this.getDistance3D(mid, vpo),
              [
                Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
                Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
                Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
                Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
              ], obj.baseColor]);
          }
          const mask0 = this.drawMask0(planeBuffer, vp);
        });
      });
    });
    const str1 = `VIEWPORT: X${vp.x.toFixed(2)} Y${vp.y.toFixed(2)} Z${vp.z.toFixed(2)} R${vp.roll.toFixed(2)} P${vp.pitch.toFixed(2)} Y${vp.yaw.toFixed(2)}`;
    this._ctx.translate(0,0);
    this._ctx.setTransform(1,0,0,1,0,0);
    this._ctx.fillStyle = 'white';
    this._ctx.fillText(str0, 16, 16);
    this._ctx.fillText(str1, 16, 32);
    this._ctx.fillText(`RENDER DELAY: ${(performance.now() - perf0).toFixed(2)} ms`, 16, 48);
  }
  
  constructor(stage, viewport) {
    this._stage = stage;
    this._ctx = this._stage.getContext('2d');
    this._viewport = viewport;
  }
}

module.exports = Renderer;
