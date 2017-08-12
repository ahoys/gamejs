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

  isFacing(target, arr) {
    let c = 0;
    arr.forEach(d => {
      if (target < d) {
        c++;
      }
    });
    return c >= 2;
  }

  /**
   * Builds a two dimensional scene
   * of the world.
   */
  build2Dscene(matrix, w, l, h) {
    const vp = this._viewport;
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    const vpo = {
      x: vp.x + vp.width/2,
      y: vp.y + vp.length/2,
    };
    const scale = this.get2Dscale();
    // Top
    this._ctx.setTransform(scale.h, 0, 0, scale.v, vp.x * -1, vp.y * -1);
    this._ctx.translate(vpo.x, vpo.y);
    this._ctx.rotate(vp.yaw);
    this._ctx.translate(-vpo.x, -vpo.y);
    matrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          if (!obj.height) {
            this._ctx.fillStyle = `rgb(100,100,100)`;
            this._ctx.fillRect(obj.x * 100, obj.y * 100, obj.width * 100, obj.length * 100);
          }
        });
      });
    });
    // Voisikohan nämä laskea sillä matrixillä, pointteja käyttäen?
    // Left
    this._ctx.setTransform(scale.v,0.5,0,scale.h,vp.x * -1, (vp.y + 200) * -1);
    this._ctx.translate(vpo.x, vpo.y);
    this._ctx.rotate(vp.yaw);
    this._ctx.translate(-vpo.x, -vpo.y);
    matrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          if (obj.height) {
            this._ctx.fillStyle = `rgb(75,75,75)`;
            this._ctx.fillRect(obj.x * 100, obj.y * 100, obj.width * 100, obj.length * 100);
          }
        });
      });
    });
    // Right
    this._ctx.setTransform(scale.h,0,0,scale.h,vp.x * -1, (vp.y + 100) * -1);
    this._ctx.translate(vpo.x, vpo.y);
    this._ctx.rotate(vp.yaw);
    this._ctx.translate(-vpo.x, -vpo.y);
    matrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          if (obj.height) {
            this._ctx.fillStyle = `rgb(75,75,75)`;
            this._ctx.fillRect(obj.x * 100, obj.y * 100, obj.width * 100, obj.length * 100);
          }
        });
      });
    });
  }

  /**
   * Draws a rectangle.
   * @param {*} lines [[x0,y0] [x1,y1], [x2,y2], [x3,y3]]
   * @param {*} color {r:n,g:n,b:n}
   */
  draw3D(lines, color) {
    this._ctx.beginPath();
    lines.forEach(l => {
      this._ctx.lineTo(l[0], l[1]);
    });
    this._ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    this._ctx.fill();
  }

  /**
   * Builds a three dimensional scene
   * of the world.
   */
  build3Dscene(objectMatrix, w, l, h) {
    let str0 = '';
    const vp = this._viewport;
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    // Calculate matrices.
    const tMatrix = Matrix.getTranslationMatrix(vp.x, vp.y, vp.z);
    const sMatrix = Matrix.getScalingMatrix(vp.z, vp.z, vp.z);
    const rMatrixRoll = Matrix.getRotationMatrix('roll', vp.roll);
    const rMatrixPitch = Matrix.getRotationMatrix('pitch', vp.pitch);
    const rMatrixYaw = Matrix.getRotationMatrix('yaw', vp.yaw);
    objectMatrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          const rot = Matrix.multiply(Matrix.multiply(rMatrixRoll, rMatrixPitch), rMatrixYaw);
          const M = Matrix.multiply(Matrix.multiply(tMatrix, rot), sMatrix);
          if (obj.height) {
            const distances = [-1, -1 -1];
            const side0 = true, side1 = true, side2 = false, side3 = false, top = true;

            // top
            const tmid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length/2], [obj.z + obj.height], [1]]);
            const std = this.getDistance3D(tmid, [[vp.x], [vp.y], [vp.z]]);
            const t = [
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
            ];

            // front
            const s0mid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y], [obj.z + obj.height/2], [1]]);
            const s0d = this.getDistance3D(s0mid, [[vp.x], [vp.y], [vp.z]]);
            const s0 = [
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
            ];

            // right
            const s1mid = Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length/2], [obj.z + obj.height/2], [1]]);
            const s1d = this.getDistance3D(s1mid, [[vp.x], [vp.y], [vp.z]]);
            const s1 = [
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]),
            ];

            // back
            const s2mid = Matrix.multiply(M, [[obj.x + obj.width/2], [obj.y + obj.length], [obj.z + obj.height/2], [1]]);
            const s2d = this.getDistance3D(s2mid, [[vp.x], [vp.y], [vp.z]]);
            const s2 = [
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]),
            ];

            // left
            const s3mid = Matrix.multiply(M, [[obj.x], [obj.y + obj.length/2], [obj.z + obj.height/2], [1]]);
            const s3d = this.getDistance3D(s3mid, [[vp.x], [vp.y], [vp.z]]);
            const s3 = [
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]),
              Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]),
            ];

            if (this.isFacing(tmid, [s0mid, s1mid, s2mid, s3mid])) {
              this.draw3D(t, obj.baseColor);
            }

            if (this.isFacing(s0mid, [tmid, s1mid, s2mid, s3mid])) {
              this.draw3D(s0, obj.baseColor);
            }

            if (this.isFacing(s1mid, [tmid, s0mid, s2mid, s3mid])) {
              this.draw3D(s1, obj.baseColor);
            }

            if (this.isFacing(s2mid, [tmid, s0mid, s1mid, s3mid])) {
              this.draw3D(s2, obj.baseColor);
            }

            if (this.isFacing(s3mid, [tmid, s0mid, s1mid, s2mid])) {
              this.draw3D(s3, obj.baseColor);
            }
          } else {
            const vA0 = Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]);
            const vA1 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]);
            const vA2 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]);
            const vA3 = Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]);
            this._ctx.beginPath();
            this._ctx.moveTo(vA0[0], vA0[1]);
            this._ctx.lineTo(vA1[0], vA1[1]);
            this._ctx.lineTo(vA2[0], vA2[1]);
            this._ctx.lineTo(vA3[0], vA3[1]);
            this._ctx.fillStyle = `rgb(50,50,50)`;
            this._ctx.fill();
            str0 = `vA0[${vA0}], vA1[${vA1}], vA2[${vA2}], vA3[${vA3}]`;
          }
        });
      });
    });
    const str1 = `[VIEWPORT] POS[${vp.x}.${vp.y}.${vp.z}] ROLL[${vp.roll}] PITCH[${vp.pitch}] YAW[${vp.yaw}]`;
    this._ctx.translate(0,0);
    this._ctx.setTransform(1,0,0,1,0,0);
    this._ctx.fillStyle = 'white';
    this._ctx.fillText(str0, 16, 16);
    this._ctx.fillText(str1, 16, 32);
  }

  set stage(stage) {
    this._stage = stage;
    this._ctx = stage.getContext('2d');
  }
  
  constructor(stage, viewport) {
    this._stage = stage;
    this._ctx = this._stage.getContext('2d');
    this._viewport = viewport;
  }
}

module.exports = Renderer;
