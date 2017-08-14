const Renderer = require('./components/scene/class.Renderer');
const Viewport = require('./components/scene/class.Viewport');
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
   * Returns a relative speed in seconds.
   * Changing tickLength won't affect speeds set with this.
   * @param {number} target 
   */
  getRelativeSpeed(target) {
    return (this.tickLength / 1000) * target;
  }

  handleControlActions(active) {
    const actions = {
      'VP_MOVE_FORWARD': () => this._viewport.doMoveXYZ(this.getRelativeSpeed(1)),
      'VP_MOVE_BACKWARD': () => this._viewport.doMoveXYZ(-this.getRelativeSpeed(1)),
      'VP_MOVE_LEFT': () => this._viewport.doMoveX(this.getRelativeSpeed(100)),
      'VP_MOVE_RIGHT': () => this._viewport.doMoveX(-this.getRelativeSpeed(100)),
      'VP_MOVE_UP': () => this._viewport.doMoveY(this.getRelativeSpeed(100)),
      'VP_MOVE_DOWN': () => this._viewport.doMoveY(-this.getRelativeSpeed(100)),
      'VP_ROTATE_LEFT': () => this._viewport.doYaw(this.getRelativeSpeed(0.8)),
      'VP_ROTATE_RIGHT': () => this._viewport.doYaw(-this.getRelativeSpeed(0.8)),
      'VP_ROLL_LEFT': () => this._viewport.doRoll(this.getRelativeSpeed(1)),
      'VP_ROLL_RIGHT': () => this._viewport.doRoll(-this.getRelativeSpeed(1)),
      'VP_RESET': () => this._viewport.doReset(),
    }
    active.forEach((actionRequest) => {
      if (actions[actionRequest]) {
        actions[actionRequest]();
      }
    });
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    const perf = performance.now();
    // Clear buffers.
    this._drawBuffer = [];
    this._textBuffer = [];
    // Refresh game time
    this._time = (this.lastTick + this.tickLength) / 1000;
    // Handle input.
    this.handleControlActions(this._input.active);
    // Refresh level.
    this._drawBuffer = this._level.worldObjects;
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
    this._renderer.buildScene(this._drawBuffer, this._level.worldCamera);
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
    this._level = new Level('cubedebug'); // Initializes the first game level.
    this._viewport = new Viewport(0, 0, 1, -5.5, 0, -0.78, vpWidth, vpHeight, this._level.worldCamera);
    this._input = new Input(this._stage); // An input handler.
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
    this._drawBuffer = [];
    this._textBuffer = [];
    this._stage.width = stWidth;
    this._stage.height = stHeight;
    this._renderer = new Renderer( // The main renderer.
      this._stage,
      this._viewport
    );
    this.main(performance.now());
  }

  resize() {
    console.log(document.body.clientWidth, document.body.clientHeight);
    this._stage.width = document.body.clientWidth;
    this._stage.height = document.body.clientHeight;
    this._viewport.width = document.body.clientWidth;
    this._viewport.height = document.body.clientHeight;
  }

  constructor() {
    this._stage = document.getElementById('canvas');
    if (this._stage && this._stage.getContext) {
      this.initGameLogic(document.body.clientWidth, document.body.clientHeight);
      this.initRendering(document.body.clientWidth, document.body.clientHeight);
    }
  }
}

// Create a new Game instance.
const thisGame = new Game();

window.addEventListener("resize", () => thisGame.resize(), false);
