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
      this._debugPerfM = this._perfMain.toFixed(2);
      this._debugPerfU = this._perfUpdate.toFixed(2);
    }
    this.textBuffer.push({
      x: 16,
      y: 16,
      str: `Main delay: ${this._debugPerfM}/16.7 ms | ` +
      `Update delay: ${this._debugPerfU}/${this.tickLength} ms | ` +
      `Time: ${this._time.toFixed(1)} s.`
    });
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    const perf = performance.now();
    // Clear buffers.
    this.drawBuffer = [];
    this.textBuffer = [];
    // Refresh game time
    this._time = (this.lastTick + this.tickLength) / 1000;
    // Handle input.
    const keyState = this._input.keyState;
    const mouseState = this._input.mouseState;
    // Debug
    if (c.DEBUG) this.debug();
    // Refresh level.
    this.drawBuffer = this._level.worldTiles;
    // Garbage collection.
    const len = this.drawBuffer.length;
    for (let i = 1024; len > i; i++) {
      this.drawBuffer.shift();
    }
    this._perfUpdate = performance.now() - perf;
  }

  /**
   * Buffer for updates.
   * The renderer runs free, but the game logic is
   * restricted to avoid performance decrease.
   * @param {number} numTicks 
   */
  queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
      this.lastTick = this.lastTick + this.tickLength;
      this.update(this.lastTick);
    }
  }

  /**
   * MAIN LOOP --------------------------------
   * The main game loop.
   * @param {number} tFrame 
   */
  main(tFrame) {
    const perf = performance.now();
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
    this._perfMain = performance.now() - perf;
  }

  /**
   * Initializes the game logic.
   * @param {number} vpWidth Viewport width in pixels.
   * @param {number} vpHeight Viewport height in pixels.
   */
  initGameLogic(vpWidth, vpHeight) {
    this._time = 0; // In-game time in seconds.
    this._waitUntil = {}; // Accurate waiting timers (see waitUntil).
    this._viewport = new Viewport(0, 0, vpWidth, vpHeight);
    this._viewport.origin = { x: 300, y: 300 };
    this._level = new Level('room'); // Initializes the first game level. -1: debug level.
    this._input = new Input(this.stage); // An input handler.
  }

  /**
   * Initializes rendering.
   * @param {number} stWidth Stage width in pixels.
   * @param {number} stHeight Stage height in pixels.
   */
  initRendering(stWidth, stHeight) {
    this.lastTick = performance.now();
    this.lastRender = this.lastTick;
    this.tickLength = 50; // Delay of a one tick (affects game logic).
    this.drawBuffer = [];
    this.textBuffer = [];
    this.stage.width = stWidth;
    this.stage.height = stHeight;
    this.renderer = new Renderer( // The main renderer.
      this.stage,
      this.stage.width,
      this.stage.height,
      this._viewport
    );
    this.main(performance.now());
  }

  constructor() {
    this.stage = document.getElementById('canvas');
    if (this.stage && this.stage.getContext) {
      this.initGameLogic(c.DEFAULT_STAGE_W, c.DEFAULT_STAGE_H);
      this.initRendering(c.DEFAULT_STAGE_W, c.DEFAULT_STAGE_H);
    }
  }
}

// Create a new Game instance.
new Game();
