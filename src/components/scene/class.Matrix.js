module.exports = {
  getTranslationMatrix(x, y, z) {
    return [
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ];
  },

  getRotationMatrixRoll(rad) {
    return [
      [1, 0, 0, 1],
      [0, Math.cos(rad), -Math.sin(rad), 1],
      [0, Math.sin(rad), Math.cos(rad), 1],
      [0, 0, 0, 1],
    ];
  },

  getRotationMatrixPitch(rad) {
    return [
      [Math.cos(rad), 0, Math.sin(rad), 1],
      [0, 1, 0, 1],
      [-Math.sin(rad), 0, Math.cos(rad), 1],
      [0, 0, 0, 1],
    ];
  },

  getRotationMatrixYaw(rad) {
    return [
      [Math.cos(rad), -Math.sin(rad), 0, 1],
      [Math.sin(rad), Math.cos(rad), 0, 1],
      [0, 0, 1, 1],
      [0, 0, 0, 1],
    ];
  },

  getScalingMatrix(x, y, z) {
    return [
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ];
  },

  getProjectionMatrix(s) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, s],
      [0, 0, 0, s],
    ];
  },

  multiply(a, b) {
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
  },
};
