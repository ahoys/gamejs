class Viewport {

  set pos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  constructor(w, h, z) {
    this.x = 0; // Top-left corner.
    this.y = 0; // Top-right corner.
    this.w = w; // Width of the viewport (px).
    this.h = h; // Height of the viewport (px).
    this.z = z; // Height from the ground (px).
  }
}

module.exports = Viewport;
