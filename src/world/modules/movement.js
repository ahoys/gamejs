module.exports = {
  moveForward: function(v) {
    this.x += Number(v) * Math.sin(-this.rY);
    this.y += Number(v) * Math.sin(this.rX) * Math.cos(this.rZ);
    this.z += Number(v) * Math.cos(this.rY);
  },
  moveBackward: function(v) {
    this.x += Number(-v) * Math.sin(-this.rY);
    this.y += Number(-v) * Math.sin(this.rX) * Math.cos(this.rZ);
    this.z += Number(-v) * Math.cos(this.rY);
  },
  strafeLeft: function(v) {
    this.x += Number(v) * Math.cos(-this.rY);
    this.y += Number(v) * Math.cos(this.rX) * Math.sin(this.rZ);
    this.z += Number(v) * Math.sin(this.rY);
  },
  strafeRight: function(v) {
    this.x += Number(-v) * Math.cos(-this.rY);
    this.y += Number(-v) * Math.cos(this.rX) * Math.sin(this.rZ);
    this.z += Number(-v) * Math.sin(this.rY);
  },
  moveX: function(v) {
    this.x += Number(v);
  },
  moveY: function(v) {
    this.y += Number(v);
  },
  moveZ: function(v) {
    this.z += Number(v);
  },
  rotateX: function(v) {
    this.rx += Number(v);
  },
  rotateY: function(v) {
    this.ry += Number(v);
  },
  rotateZ: function(v) {
    this.rz += Number(v);
  },
}
