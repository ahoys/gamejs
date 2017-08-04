const c = require('./constants');
const Player = require('./class.player');

class Game {

  drawCube(x, y) {
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    this.ctx.fillRect(x, y, 5, 5);
  }

  setInput(input) {
    this.input.push(input);
  }

  /**
   * Updates the game logic.
   * @param {number} lastTick
   */
  update(lastTick) {
    // Read input
    this.input.forEach((input) => {
      if (input.type === 'click') {
        console.log('ye', input);
        this.drawBuffer.push(['cube', input.xy[0], input.xy[1]]);
      }
    });
    // Garbage collection
    const len = this.drawBuffer.length;
    for (let i = 512; len > i; i++) {
      this.drawBuffer.shift();
    }
    this.input = [];
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
      if (entity[0] === 'cube') {
        this.drawCube(entity[1], entity[2]);
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
    const players = [new Player('PLAYER 0')]; // An abstract player object.
  }

  /**
   * Returns the stage.
   */
  getStage() {
    return this.stage;
  }

  constructor() {
    // Init rendering.
    this.input = [];
    this.stage = document.getElementById('canvas');
    if (this.stage && this.stage.getContext) {
      this.initRendering();
      // Init game logic.
      this.initGameLogic();
    }
  }
}

// Create a new Game instance.
const thisGame = new Game();

/**
 * Handles keyDown events.
 * @param {*} event 
 */
const handleKeyDown = (event) => {
  const { keyCode } = event;
  thisGame.setInput({
    type: 'keyDown',
    keyCode,
  });
}

/**
 * Handles keyUp events.
 * @param {*} event 
 */
const handleKeyUp = (event) => {
  const { keyCode } = event;
  thisGame.setInput({
    type: 'keyUp',
    keyCode,
  });
}

/**
 * Handles click events.
 * @param {*} event 
 */
const handleClick = (event) => {
  const { clientX, clientY } = event;
  thisGame.setInput({
    type: 'click',
    xy: [clientX, clientY],
  });
}

// Register event listeners for input.
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);
thisGame.getStage().addEventListener("click", handleClick, false);