class Viewport {

  set posX(value) {
    this.x = value;
  }

  get posX() {
    return this.x;
  }

  set posY(value) {
    this.y = value;
  }

  get posY() {
    return this.y;
  }

  set width(value) {
    this.w = value;
  }

  get width() {
    return this.w;
  }

  set height(value) {
    this.h = value;
  }

  get height() {
    return this.h;
  }

  constructor(x, y, w, h) {
    this.x = x; // Top-left corner.
    this.y = y; // Top-right corner.
    this.w = w; // How many tiles is the width.
    this.h = h; // How many tiles is the height.
  }
}

module.exports = Viewport;
