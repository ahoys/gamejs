const Matrix = require('./class.Matrix');

class Renderer {

  get2Dscale() {
    return {
      h: 1,
      v: 0.5,
    }
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
   * Builds a three dimensional scene
   * of the world.
   */
  build3Dscene(objectMatrix, w, l, h) {
    let str0 = '';
    const vp = this._viewport;
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    const tMatrix = Matrix.getTranslationMatrix(vp.x, vp.y, vp.z);
    // const rMatrixRoll = Matrix.getRotationMatrix('roll', vp.roll);
    // const rMatrixPitch = Matrix.getRotationMatrix('pitch', vp.pitch);
    // const rMatrixYaw = Matrix.getRotationMatrix('yaw', vp.yaw);
    //const rMatrix = Matrix.getRotation(vp.x, vp.y, vp.z);
    //const rMatrix = Matrix.getRotation();
    const sMatrix = Matrix.getScalingMatrix(vp.z, vp.z, vp.z);
    //const pMatrix = Matrix.getProjection();
    objectMatrix.forEach(x => {
      x.forEach(y => {
        y.forEach(obj => {
          if (obj.height) {
            const M = Matrix.multiply(tMatrix, sMatrix);

            // Bottom
            const vA0 = Matrix.multiply(M, [[obj.x], [obj.y], [obj.z], [1]]);
            const vA1 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z], [1]]);
            const vA2 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z], [1]]);
            const vA3 = Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z], [1]]);

            // Top
            const vB0 = Matrix.multiply(M, [[obj.x], [obj.y], [obj.z + obj.height], [1]]);
            const vB1 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y], [obj.z + obj.height], [1]]);
            const vB2 = Matrix.multiply(M, [[obj.x + obj.width], [obj.y + obj.length], [obj.z + obj.height], [1]]);
            const vB3 = Matrix.multiply(M, [[obj.x], [obj.y + obj.length], [obj.z + obj.height], [1]]);

            this._ctx.beginPath();
            this._ctx.moveTo(vA0[0], vA0[1]);
            this._ctx.lineTo(vA1[0], vA1[1]);
            this._ctx.lineTo(vA2[0], vA2[1]);
            this._ctx.lineTo(vA3[0], vA3[1]);
            this._ctx.fillStyle = `rgb(75,75,75)`;
            this._ctx.fill();
            str0 = `vA0[${vA0}], vA1[${vA1}], vA2[${vA2}], vA3[${vA3}]`;
          } else {
            // this._ctx.fillStyle = `rgb(75,75,75)`;
            // this._ctx.beginPath();
            // this._ctx.moveTo(1, -1);
            // this._ctx.lineTo(2, -1);
            // this._ctx.lineTo(1, -2);
            // this._ctx.lineTo(2, -2);
            // this._ctx.fill();
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
