const Renderer = require('./components/scene/class.Renderer');
const Viewport = require('./components/scene/class.Viewport');
const Level = require('./class.level');
const Input = require('./class.input');
const Calc = require('./utilities/util.calc');

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

  handleControlActions(active) {
    const actions = {
      'VP_MOVE_FORWARD': () => this._viewport.doMoveXYZ(Calc.getRelativeSpeed(this._tickLength, 1)),
      'VP_MOVE_BACKWARD': () => this._viewport.doMoveXYZ(-Calc.getRelativeSpeed(this._tickLength, 1)),
      'VP_MOVE_LEFT': () => this._viewport.doMoveX(Calc.getRelativeSpeed(this._tickLength, 100)),
      'VP_MOVE_RIGHT': () => this._viewport.doMoveX(-Calc.getRelativeSpeed(this._tickLength, 100)),
      'VP_MOVE_UP': () => this._viewport.doMoveY(Calc.getRelativeSpeed(this._tickLength, 100)),
      'VP_MOVE_DOWN': () => this._viewport.doMoveY(-Calc.getRelativeSpeed(this._tickLength, 100)),
      'VP_ROTATE_LEFT': () => this._viewport.doYaw(Calc.getRelativeSpeed(this._tickLength, 0.8)),
      'VP_ROTATE_RIGHT': () => this._viewport.doYaw(-Calc.getRelativeSpeed(this._tickLength, 0.8)),
      'VP_ROLL_LEFT': () => this._viewport.doRoll(Calc.getRelativeSpeed(this._tickLength, 1)),
      'VP_ROLL_RIGHT': () => this._viewport.doRoll(-Calc.getRelativeSpeed(this._tickLength, 1)),
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
    this._time = (this._lastTick + this._tickLength) / 1000;
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
      this._lastTick = this._lastTick + this._tickLength;
      this.update(this._lastTick);
    }
  }

  /**
   * Handles window resizes.
   */
  resize() {
    this._stage.width = document.body.clientWidth;
    this._stage.height = document.body.clientHeight;
  }

  /**
   * MAIN LOOP --------------------------------
   * The main game loop.
   * @param {number} tFrame 
   */
  main(tFrame) {
    const perf = performance.now();
    this.stopMain = window.requestAnimationFrame(() => this.main(performance.now()));
    const nextTick = this._lastTick + this._tickLength;
    let numTicks = 0;
    if (tFrame > nextTick) {
      const timeSinceTick = tFrame - this._lastTick;
      numTicks = Math.floor(timeSinceTick / this._tickLength);
    }
    this.queueUpdates(numTicks);
    this._renderer.buildScene(this._drawBuffer, this._level.worldCamera);
    this._lastRender = tFrame;
    this._perfMain = performance.now() - perf;
  }

  constructor() {
    this._stage = document.getElementById('canvas');
    if (this._stage && this._stage.getContext) {
      // Initialization starts.
      // The main principle is to load game logic first, then the rendering side.

      // Variables.
      this._time = 0; // In-game time in seconds.
      this._waitUntil = {}; // Accurate waiting timers (see waitUntil).

      // Load the level.
      this._level = new Level('cubedebug');

      // Viewport handles the real world movement.
      this._viewport = new Viewport(
        0,
        0,
        1,
        -5.5,
        0,
        -0.78,
        document.body.clientWidth,
        document.body.clientHeight,
        this._level.worldCamera
      );

      // Load inputs.
      this._input = new Input(this._stage);

      // Rendering.
      this._lastTick = performance.now();
      this._lastRender = this._lastTick;
      this._tickLength = 50; // Delay of a one tick (affects game logic).
      this._drawBuffer = [];
      this._textBuffer = [];
      this._stage.width = document.body.clientWidth;
      this._stage.height = document.body.clientHeight;
      this._renderer = new Renderer( // The main renderer.
        this._stage,
        this._viewport
      );
      this.main(performance.now());
    }
  }
}

// Create a new Game instance.
const thisGame = new Game();

window.addEventListener("resize", () => thisGame.resize(), false);
