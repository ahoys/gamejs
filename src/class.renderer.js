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
   * @param {array} worldScale: Scale of the world.
   * @param {array} worldBuffer: Drawable game objects.
   * @param {array} textBuffer: Drawable text objects.
   */
  draw(tick, worldScale, worldBuffer = [], textBuffer = []) {
    const perf0 = performance.now();
    // Time (ms) since the previous draw.
    const spread = tick - this.pTick;
    // Clear the screen.
    const hScale = 1;
    const vScale = 0.5;
    const hSkew = 0;
    const vSkew = -0.5;
    const rotationX = this._viewport.x + this._viewport.width/2;
    const rotationY = this._viewport.y + this._viewport.height/2;
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    this._ctx.setTransform(hScale, 0, 0, vScale, this._viewport.x * -1, this._viewport.y * -1);
    this._ctx.translate(rotationX, rotationY);
    this._ctx.rotate(this._viewport.yaw);
    this._ctx.translate(-rotationX, -rotationY);
    // Render entities.
    worldBuffer.forEach(wObject => {
      if (true) {
        // The object origin is inside the viewport.
        this._ctx.fillStyle = `rgb(${wObject.baseColor.r}, ` +
        `${wObject.baseColor.g}, ` +
        `${wObject.baseColor.b})`;
        this._ctx.fillRect(wObject.x, wObject.y, wObject.width * worldScale, wObject.length * worldScale);
        if (wObject.height) {
          // const h = 100;
          // this._ctx.fillStyle = `rgb(${wObject.baseColor.r + 25}, ` +
          // `${wObject.baseColor.g + 25}, ` +
          // `${wObject.baseColor.b + 25})`;
          // this._ctx.fillRect(wObject.x - h, wObject.y - h, wObject.width * worldScale, wObject.length * worldScale);
        }
      }
    });
    if (c.DEBUG) {
      this._ctx.fillStyle = `rgb(255, 0, 0)`;
      this._ctx.fillRect(rotationX-10, rotationY-10, 20, 20);
      this._ctx.fillStyle = 'white';
      this._ctx.fillText(`${Math.floor(rotationX)}.${Math.floor(rotationY)}`, rotationX-20, rotationY+24);
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
