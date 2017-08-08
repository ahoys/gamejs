const c = require('./constants.json');
const Renderer = require('./class.renderer');
const Viewport = require('./class.viewport');
const Level = require('./class.level');
const Input = require('./class.input');

class Game {

  /**
   * Waits until time is up.
   * @param {*} key Identification of the delay handle.
   * @param {*} delay Time to wait in seconds.
   */
  waitUntil(key, delay) {
    if (this._waitUntil[key] !== undefined) {
      // An existing delay.
      const result = this._time >= this._waitUntil[key].time + this._waitUntil[key].delay;
      if (result) {
        // Time is up, remove entry.
        delete this._waitUntil[key];
      }
      return result;
    } else {
      // A new delay.
      this._waitUntil[key] = {
        delay,
        time: this._time,
      };
    }
    return false;
  }

  /**
   * All sort of debugging.
   * This method will be executed once per update() loop.
   */
  debug() {
    if (this.waitUntil('performance', 1)) {
      this._performance = (this._perf0 - this._perf1).toFixed(2);
    }
    this.textBuffer.push({
      x: 16,
      y: 16,
      str: `Loop Delay: ${this._performance}`
    });
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    // Clear buffers.
    this.drawBuffer = [];
    this.textBuffer = [];
    // Refresh game time
    this._time = (this.lastTick + this.tickLength) / 1000;
    // Debug
    if (c.DEBUG) this.debug();
    // Refresh level.
    this.drawBuffer = this.level.worldTiles;
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
   * Return shaded color.
   * @param {*} entity 
   * @param {*} x 
   * @param {*} y 
   */
  shadeColor(entity, x, y) {
    if (entity.isWall()) {
      for (let i = -1; i < 2; i++) {
        for (let r = -1; r < 2; r++) {
          const gridX = x + i;
          const gridY = y + r;
          if (
            gridX >= 0 &&
            gridY >= 0 &&
            gridX < this.level.width &&
            gridY < this.level.height &&
            (gridX !== x || gridY !== y) &&
            !this.level.worldTiles[gridX][gridY].isWall()
          ) {
            // We have found floor nearby. Figure out how it
            // affects us.
            const rc = entity.getRenderColor();
            if (i === 0 && r === 1) {
              // Floor S.
              return `rgb(${rc[0] + 20}, ${rc[1] + 20}, ${rc[2] + 20})`;
            } else {
              return `rgb(${rc[0] + 5}, ${rc[1] + 5}, ${rc[2] + 5})`;
            }
          }
        }
      }
    }
    return `rgb(${entity.getRenderColor()})`;
  }

  /**
   * The main game loop.
   * @param {number} tFrame 
   */
  main(tFrame) {
    this._perf0 = performance.now();
    this.stopMain = window.requestAnimationFrame(() => this.main(performance.now()));
    const nextTick = this.lastTick + this.tickLength;
    let numTicks = 0;
    if (tFrame > nextTick) {
      const timeSinceTick = tFrame - this.lastTick;
      numTicks = Math.floor(timeSinceTick / this.tickLength);
    }
    this.queueUpdates(numTicks);
    this.renderer.draw(tFrame, this.drawBuffer, this.textBuffer);
    this.lastRender = tFrame;
    this._perf1 = performance.now();
  }

  /**
   * Initializes rendering.
   */
  initRendering() {
    this.renderer = new Renderer(this.stage, c.DEFAULT_STAGE_W, c.DEFAULT_STAGE_H, this.viewport);
    this.stage.width = c.DEFAULT_STAGE_W;
    this.stage.height = c.DEFAULT_STAGE_H;
    this.ctx = this.stage.getContext('2d');
    this.lastTick = performance.now();
    this.lastRender = this.lastTick;
    this.tickLength = 50;
    this.drawBuffer = [];
    this.textBuffer = [];
    this._perf0 = 0;
    this._perf1 = 0;
    this.main(performance.now());
  }

  /**
   * Initializes the game logic and the playable game itself.
   */
  initGameLogic() {
    this._time = 0; // In-game time in seconds.
    this._waitUntil = {}; // Accurate waiting timers (see waitUntil).
    this._repeat = {}; // Repeater for functions.
    this._performance = 0; // Performance reading for debugging.
    this.viewport = new Viewport(0, 0, c.DEFAULT_STAGE_W, c.DEFAULT_STAGE_H);
    this.level = new Level('entrance'); // Initializes the first game level. -1: debug level.
    this.input = new Input(this.stage); // An input handler.
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
      this.initGameLogic();
      this.initRendering();
    }
  }
}

// Create a new Game instance.
new Game();
