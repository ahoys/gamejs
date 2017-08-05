class Viewport {

  set pos(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.z = pos.z;
  }

  get pos() {
    return {
      x: this.x,
      y: this.x,
      z: this.z,
    };
  }

  constructor() {
    this.x = 0; // Top-left corner.
    this.y = 0; // Top-right corner.
    this.z = 1; // Height of the viewport (px).
  }
}

module.exports = Viewport;
