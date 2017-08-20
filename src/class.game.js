const Level = require('./src/class.level');
const Viewport = require('./src/components/scene/class.Viewport');
const Input = require('./src/class.input');
const GlRenderer = require('./src/components/scene/class.GlRenderer');
const Calc = require('./src/utilities/util.calc');

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
      'CAM_MOVE_+X': () => this._camera.doMoveX(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-X': () => this._camera.doMoveX(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_+Y': () => this._camera.doMoveY(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-Y': () => this._camera.doMoveY(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_+Z': () => this._camera.doMoveZ(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-Z': () => this._camera.doMoveZ(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_+X': () => this._camera.doRotateX(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_-X': () => this._camera.doRotateX(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_+Y': () => this._camera.doRotateY(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_-Y': () => this._camera.doRotateY(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_+Z': () => this._camera.doRotateZ(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_-Z': () => this._camera.doRotateZ(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_FOV_+': () => this._camera.doFov(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_FOV_-': () => this._camera.doFov(-Calc.getRelativeSpeed(this._tickLength, 10)),
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
    // Refresh game time
    this._time = (this._lastTick + this._tickLength) / 1000;
    // Handle input.
    this.handleControlActions(this._input.active);
    // Refresh level.
    const staticProps = this._level.staticProps;
    const dynamicProps = this._level.dynamicProps;
    // Send props to be rendered.
    this._renderer.props = staticProps;
    // this._renderer.addBuffer(dynamicProps);
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
    const nW = document.body.clientWidth;
    const nH = document.body.clientHeight;
    this._stage.width = nW;
    this._stage.height = nH;
    this._renderer.setViewportSize(nW, nH);
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
    // this._renderer.buildScene(this._staticProps, this._dynamicProps);
    this._renderer.drawScene();
    this._lastRender = tFrame;
    this._perfMain = performance.now() - perf;
  }

  constructor() {
    // Load the stage.
    this._stage = document.getElementById('glCanvas');
    this._stage.width = document.body.clientWidth;
    this._stage.height = document.body.clientHeight;

    // Variables.
    this._time = 0; // In-game time in seconds.
    this._waitUntil = {}; // Accurate waiting timers (see waitUntil).

    // Load the level.
    this._level = new Level('lvl_cubes');
    this._camera = this._level.cameraProps.filter(x => x.enabled)[0];

    // Viewport handles the real world movement.
    //const activeCamera = this._level.cameraProps.filter(x => x.enabled)[0];
    //this._viewport = new Viewport(activeCamera);

    // Load inputs.
    this._input = new Input(this._stage);

    // Rendering.
    this._lastTick = performance.now();
    this._lastRender = this._lastTick;
    this._tickLength = 50; // Delay of a one tick (affects game logic).
    this._renderer = new GlRenderer(
      this._stage,
      this._camera,
    );
    this.main(performance.now());
  }
}

// Create a new Game instance.
const thisGame = new Game();

window.addEventListener("resize", () => thisGame.resize(), false);
