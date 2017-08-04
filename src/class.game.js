const Player = require('./class.player');

class Game {

  drawCube() {
    const x = Math.floor((Math.random() * this.canvas.width) + 1);
    const y = Math.floor((Math.random() * this.canvas.height) + 1);
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    this.ctx.fillRect(x, y, 5, 5);
  }

  /**
   * Sets a new player.
   * @param {number} id 
   */
  setPlayer(id) {
    this.players[id] = new Player('John Doe');
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.ctx = this.canvas.getContext('2d');
    this.lastTick = performance.now();
    this.lastRender = this.lastTick;
    this.tickLength = 50;
    this.drawBuffer = [];
    this.main(performance.now());
  }

  constructor() {
    // Init rendering.
    this.canvas = document.getElementById('canvas');
    if (this.canvas && this.canvas.getContext) {
      this.initRendering();
      // Init the player.
      this.players = [];
      this.players[0] = new Player('PLAYER 0');
    }
  }
}

new Game();
