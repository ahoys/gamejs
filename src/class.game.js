const c = require('./constants');
const Player = require('./class.player');
const Input = require('./class.input');
const Level = require('./class.level');

class Game {

  drawCube(x, y) {
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    this.ctx.fillRect(x, y, 5, 5);
  }

  handleInput() {
    this.input.forEach((input) => {
      switch (input.type) {
        case 'mousemove':
          this.mouse.x = input.x;
          this.mouse.y = input.y;
          break;
        case 'mousedown':
          this.mouse.drag = true;
          break;
        case 'mouseup':
          this.mouse.drag = false;
      }
    });
  }

  hasMouseMoved() {
    return (this.mouse.x !== this.mouse.pX) || (this.mouse.y !== this.mouse.pY);
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    if (this.level) {
      this.drawBuffer = this.drawBuffer.concat(this.level.render);
    }
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
      if (entity.render) {
      }
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

  /**
   * Initializes the game logic and the playable game itself.
   */
  initGameLogic() {
    this.players = [new Player('PLAYER 0')]; // An abstract player object.
    this.input = new Input(this.stage); // An input handler.
    this.level = new Level('entrance'); // Initializes the first game level. -1: debug level.
  }

  /**
   * Returns the stage.
   */
  getStage() {
    return this.stage;
  }

  constructor() {
    this.stage = document.getElementById('canvas');
    if (this.stage && this.stage.getContext) {
      this.initRendering();
      this.initGameLogic();
    }
  }
}

// Create a new Game instance.
new Game();
