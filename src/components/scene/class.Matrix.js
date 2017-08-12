const thisModule = {};

class Matrix {

  getMultipication(pos) {
    return [
      this._matrix[0][0] * pos[0] +
      this._matrix[0][1] * pos[1] +
      this._matrix[0][2] * pos[2] +
      this._matrix[0][3] * pos[3],

      this._matrix[1][0] * pos[0] +
      this._matrix[1][1] * pos[1] +
      this._matrix[1][2] * pos[2] +
      this._matrix[1][3] * pos[3],

      this._matrix[2][0] * pos[0] +
      this._matrix[2][1] * pos[1] +
      this._matrix[2][2] * pos[2] +
      this._matrix[2][3] * pos[3],

      this._matrix[3][0] * pos[0] +
      this._matrix[3][1] * pos[1] +
      this._matrix[3][2] * pos[2] +
      this._matrix[3][3] * pos[3],
    ];
  }

  get matrix() {
    return this._matrix;
  }

  constructor(
    x0,
    y0,
    z0,
    w0,
    x1,
    y1,
    z1,
    w1,
    x2,
    y2,
    z2,
    w2,
    x3,
    y3,
    z3,
    w3
  ) {
    this._matrix = [
      [x0, y0, z0, w0],
      [x1, y1, z1, w1],
      [x2, y2, z2, w2],
      [x3, y3, z3, w3],
    ];
  }
}

thisModule.Matrix = Matrix;

thisModule.getTranslationMatrix = (x, y, z) => {
  return new Matrix(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  );
}

thisModule.getRotationMatrix = (axel, rad) => {
  switch (axel) {
    case 'x':
      return new Matrix(
        1, 0, 0,
        0, cos(rad), -sin(rad),
        0, sin(rad), cos(rad)
      );
      break;
    case 'y':
      return new Matrix(
        cos(rad), 0, sin(rad),
        0, 1, 0,
        -sin(rad), 0, cos(rad)
      );
      break;
    case 'z':
      return new Matrix(
        Math.cos(rad), -Math.sin(rad), 0,
        Math.sin(rad), Math.cos(rad), 0,
        0, 0, 1
      );
      break;
  }
}

thisModule.getScalingMatrix = (x, y, z) => {
  return new Matrix(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  );
}

thisModule.getProjectionMatrix = (x, y, z) => {
  return new Matrix(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  );
}

thisModule.multiply = (a, b) => {
  const aNumRows = a.length, aNumCols = a[0].length,
  bNumRows = b.length, bNumCols = b[0].length,
  m = new Array(aNumRows);
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols);
    for (let c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;
      for (let i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

module.exports = thisModule;
