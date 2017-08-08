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

  shouldRender(objX, objY, objW, objH, vpX, vpY, vpW, vpH) {
    // x = 0, y = 0, width = 100, height = 100, vpX = -400, vpY = -300, vpW = 800, vpH = 600.
    return (
      objX >= vpX && // 0 > -400
      objX + objW <= vpX + vpW && // 100 <= 400
      objY >= vpY && // 0 >= -300
      objY + objH <= vpY + vpH // 100 <= 300
    );
  }

  drawText(str = '', x = 0, y = 0, color = 'white') {
    this._ctx.fillStyle = color;
    this._ctx.fillText(str, x, y);
  }

  /**
   * Draw a new scene.
   * @param {number} tick: Current tick.
   * @param {array} entityBuffer: Drawable game objects.
   * @param {array} textBuffer: Drawable text objects.
   */
  draw(tick, entityBuffer = [], textBuffer = []) {
    const perf0 = performance.now();
    // Time (ms) since the previous draw.
    const spread = tick - this.pTick;
    // Clear the screen.
    this._ctx.clearRect(0, 0, this._stage.width, this._stage.height);
    this._ctx.setTransform(1,0,0,0.5, this._viewport.origin.x, this._viewport.origin.y);
    this._ctx.rotate(0.785398);
    // Render entities.
    entityBuffer.forEach(obj => {
      const { type, x, y, width, height, color } = obj.renderPayload;
      if (this.shouldRender(
        x,
        y,
        width,
        height,
        this._viewport.x,
        this._viewport.y,
        this._viewport.width,
        this._viewport.height
      )) {
        // The object origin is inside the viewport.
        this._ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._ctx.fillRect(x, y, width, height);
      }
    });
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
