const c = require('./constants.json');
const Player = require('./class.player');
const Input = require('./class.input');
const Level = require('./class.level');

class Game {

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    // Refresh level.
    this.drawBuffer = [];
    for (let x = 0; x < this.level.width; x++) {
      for (let y = 0; y < this.level.height; y++) {
        this.drawBuffer.push({
          x: x * 100,
          y: y * 100,
          entity: this.level.worldTiles[x][y],
        });
      }
    }
    // Garbage collection.
    const len = this.drawBuffer.length;
    for (let i = 1024; len > i; i++) {
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
    this.drawBuffer.forEach(item => {
      if (item.entity.renderType === 'world_tile') {
        this.ctx.fillStyle = `rgb(${String(item.entity.renderColor)})`;
        this.ctx.fillRect(item.x, item.y, 100, 100);
      } else if (item.entity.renderType === 'entity') {
        this.ctx.fillStyle = `rgb(${item.entity.renderColor})`;
        this.ctx.fillRect(item.x, item.y, 50, 50);
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
    this.stage.width = c.DEFAULT_STAGE_W;
    this.stage.height = c.DEFAULT_STAGE_H;
    this.ctx = this.stage.getContext('2d');
    this.lastTick = performance.now();
    this.lastRender = this.lastTick;
    this.tickLength = 10;
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
