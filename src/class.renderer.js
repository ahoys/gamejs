const c = require('./constants.json');

class Renderer {

  /**
   * Width of the viewport.
   * @param {number} px
   */
  set width(px) {
    this._stage.width = px;
  }

  /**
   * Height of the viewport.
   * @param {number} px
   */
  set height(px) {
    this._stage.height = px;
  }

  shouldRender(objX, objY, objW, objH, sX, sY, vp) {
    // x = 0, y = 0, width = 100, height = 100, vpX = -400, vpY = -300, vpW = 800, vpH = 600.
    return (
      objX/2 + vp.x >= vp.x && // 0 >= 800 | 100 >= 800
      objX/2 + vp.x + objW <= vp.x + vp.width && // 100 <= 800
      objY/2 + vp.y >= vp.y && // 0 >= 600 | 50 >= 600
      objY/2 + vp.y + objH <= vp.y + vp.height // 100 <= 300 | -250 <= 300
    );
  }

  drawText(str = '', x = 0, y = 0, color = 'white') {
    this._ctx.fillStyle = color;
    this._ctx.fillText(str, x, y);
  }

  /**
   * Draw a new scene.
   * @param {number} tick: Current tick.
   * @param {number} hScale: Horizontal scaling of tiles.
   * @param {number} vScale: Vertical scaling of tiles.
   * @param {array} entityBuffer: Drawable game objects.
   * @param {array} textBuffer: Drawable text objects.
   */
  draw(tick, hScale = 1, vScale = 1, entityBuffer = [], textBuffer = []) {
    const perf0 = performance.now();
    // Time (ms) since the previous draw.
    const spread = tick - this.pTick;
    // Clear the screen.
    const rotationX = this._viewport.origin.x;
    const rotationY = this._viewport.origin.y;
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    this._ctx.setTransform(hScale, 0, 0, vScale, this._viewport.x * -1, this._viewport.y * -1);
    this._ctx.translate(rotationX, rotationY);
    this._ctx.rotate(this._viewport.rotation);
    this._ctx.translate(-rotationX, -rotationY);
    // Render entities.
    entityBuffer.forEach(obj => {
      const { type, x, y, width, height, color } = obj.renderPayload;
      if (true) {
        // The object origin is inside the viewport.
        this._ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._ctx.fillRect(x, y, width, height);
      }
    });
    if (c.DEBUG) {
      this._ctx.fillStyle = `rgb(255, 0, 0)`;
      this._ctx.fillRect(rotationX-10, rotationY-10, 20, 20);
    }
    // Render text.
    this._ctx.translate(0,0);
    this._ctx.setTransform(1,0,0,1,0,0);
    textBuffer.forEach(text => {
      const { x, y, str, color } = text;
      this._ctx.fillStyle = color || 'white';
      this._ctx.fillText(str, x, y);
    });
    this.pTick = tick;
  }

  constructor(stage, w, h, viewport) {
    this._stage = stage;
    this._stage.width = w;
    this._stage.height = h;
    this._ctx = stage.getContext('2d');
    this._viewport = viewport;
    this.pTick = 0;
  }
}

module.exports = Renderer;
