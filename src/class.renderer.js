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
    return (
      objX >= vpX &&
      objX + objW <= vpX + vpW &&
      objY >= vpY &&
      objY + objH <= vpY + vpH
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
    textBuffer.forEach(text => {
      const { x, y, str, color, isFps } = text;
      if (isFps) {
        this._ctx.fillStyle = color;
        this._ctx.fillText(`Spread: ${spread.toFixed(2)} Latency: ${(performance.now() - perf0).toFixed(2)}`, x, y);
      }
      this._ctx.fillStyle = color;
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
