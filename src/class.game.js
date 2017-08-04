const c = require('./constants');
const Player = require('./class.player');

class Game {

  drawCube() {
    const x = Math.floor((Math.random() * this.stage.width) + 1);
    const y = Math.floor((Math.random() * this.stage.height) + 1);
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    this.ctx.fillRect(x, y, 5, 5);
  }

  handleKeyDown(event) {
    const { keyCode } = event;
  }

  handleKeyUp(event) {
    const { keyCode } = event;
  }

  handleClick(event) {
    const { clientX, clientY } = event;
  }

  /**
   * Initializes the game logic and the playable game itself.
   */
  initGameLogic() {
    const players = [new Player('PLAYER 0')]; // An abstract player object.
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
    this.stage.addEventListener("click", this.handleClick, false);
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    this.drawBuffer.push(this.drawCube);
    // Garbage collection
    const len = this.drawBuffer.length;
    for (let i = 512; len > i; i++) {
      this.drawBuffer.shift();
    }
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
   * Renders the stored logic.
   * @param {number} tFrame 
   */
  render(tFrame) {
    this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
    this.drawBuffer.forEach((entity) => {
      this.drawCube();
    });
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

  /**
   * Initializes rendering.
   */
  initRendering() {
    this.stage.width = c.STAGE_W;
    this.stage.height = c.STAGE_H;
    this.ctx = this.stage.getContext('2d');
    this.lastTick = performance.now();
    this.lastRender = this.lastTick;
    this.tickLength = 50;
    this.drawBuffer = [];
    this.main(performance.now());
  }

  constructor() {
    // Init rendering.
    this.stage = document.getElementById('canvas');
    if (this.stage && this.stage.getContext) {
      this.initRendering();
      // Init game logic.
      this.initGameLogic();
    }
  }
}

new Game();
