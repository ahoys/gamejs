const Game = require('./class.game');

class Engine {

  drawCube() {
    const x = Math.floor((Math.random() * this._vw) + 1);
    const y = Math.floor((Math.random() * this._vh) + 1);
    this._context2d.fillStyle = 'rgb(200, 0, 0)';
    this._context2d.fillRect(x, y, 5, 5);
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    if (this.mainmenu) {
      this.drawBuffer.push(this.drawCube);
      this.mainmenu = false;
    }
  }

  /**
   * Renders the stored logic.
   * @param {number} tFrame 
   */
  render(tFrame) {
    this._context2d.clearRect(0, 0, this._vw, this._vh);
    this.drawBuffer.forEach((t) => {
      this.drawCube();
    });
  }

  /**
   * Buffer for updates.
   * @param {number} numTicks 
   */
  queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
      this.lastTick = this.lastTick + this.tickLength;
      this.update(this.lastTick);
    }
  }

  /**
   * The main game loop.
   * @param {number} tFrame 
   */
  main(tFrame) {
    this.stopMain = window.requestAnimationFrame(() => this.main(performance.now()));
    const nextTick = this.lastTick + this.tickLength;
    let numTicks = 0;
    if (tFrame > nextTick) {
      const timeSinceTick = tFrame - this.lastTick;
      numTicks = Math.floor(timeSinceTick / this.tickLength);
    }
    this.queueUpdates(numTicks);
    this.render(tFrame);
    this.lastRender = tFrame;
  }

  constructor() {
    this._canvas = document.getElementById('canvas');
    if (this._canvas && this._canvas.getContext) {
      this._vw = 1280;
      this._vh = 720;
      this._canvas.width = this._vw;
      this._canvas.height = this._vh;
      this._context2d = canvas.getContext('2d');
      this.lastTick = performance.now();
      this.lastRender = this.lastTick;
      this.tickLength = 50;
      // Initial logic
      this.drawBuffer = [];
      this.mainmenu = true;
      // Start the main loop.
      this.main(performance.now());
    }
  }
}

new Engine();
