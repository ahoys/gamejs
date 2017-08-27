const Level = require('./src/class.level');
const Input = require('./src/class.input');
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
      'CAM_MOVE_+X': () => game_camera.doMoveX(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-X': () => game_camera.doMoveX(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_+Y': () => game_camera.doMoveY(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-Y': () => game_camera.doMoveY(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_+Z': () => game_camera.doMoveZ(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_MOVE_-Z': () => game_camera.doMoveZ(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_ROTATE_+X': () => game_camera.doRotateX(Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_ROTATE_-X': () => game_camera.doRotateX(-Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_ROTATE_+Y': () => game_camera.doRotateY(Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_ROTATE_-Y': () => game_camera.doRotateY(-Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_ROTATE_+Z': () => game_camera.doRotateZ(Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_ROTATE_-Z': () => game_camera.doRotateZ(-Calc.getRelativeSpeed(this._tickLength, 1)),
      'CAM_FOV_+': () => game_camera.doFov(Calc.getRelativeSpeed(this._tickLength, 10)),
      'CAM_FOV_-': () => game_camera.doFov(-Calc.getRelativeSpeed(this._tickLength, 10)),
      'RENDER_WIREFRAME': () => { this._wireframe = !this._wireframe },
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
    staticProps = this._level.staticProps;
    dynamicProps = this._level.dynamicProps;
    // Update debug.
    overlay_debug_game.innerHTML = `
      _tickLength: ${this._tickLength} ms<br/>
      game_camera: x ${game_camera.x} y ${game_camera.y} z ${game_camera.z} 
      rX ${game_camera.rX} rY ${game_camera.rY} rZ ${game_camera.rZ} 
      fov ${game_camera.fov} (${game_camera.fov * (180 / Math.PI)})<br/>
      staticProps: ${staticProps.length}<br/>
      dynamicProps: ${dynamicProps.length}
    `;
    overlay_debug_gl.innerHTML = `
      CPU Time: ${gl_cpuTime} ms
    `;
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
    this._level = new Level('lvl_cube');
    game_camera = this._level.cameraProps.filter(x => x.enabled)[0];

    // Load inputs.
    this._input = new Input(this._stage);

    // Rendering.
    this._wireframe = false;
    this._lastTick = performance.now();
    this._lastRender = this._lastTick;
    this._tickLength = 50; // Delay of a one tick (affects game logic).
    this._gl
    this.main(performance.now());
    gl_render.frame();
  }
}

// Create a new Game instance.
const thisGame = new Game();
