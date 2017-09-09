module.exports = {
  rx: 0,
  ry: 0,
  rz: 0,
  setRx: function(v) {
    this.rx = Number(v);
  },
  setRy: function(v) {
    this.ry = Number(v);
  },
  setRz: function(v) {
    this.rz = Number(v);
  },
  setRotation: function(rot = []) {
    if (rot[0] !== undefined) {
      this.rx = Number(rot[0]);
    }
    if (rot[1] !== undefined) {
      this.ry = Number(rot[1]);
    }
    if (rot[2] !== undefined) {
      this.rz = Number(rot[2]);
    }
  },
}
