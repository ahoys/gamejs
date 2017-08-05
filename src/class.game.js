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
    // Read input
    this.handleInput();
    if (this.mouse.drag && this.hasMouseMoved()) {
      this.drawBuffer.push(['cube', this.mouse.x, this.mouse.y]);
    }
    // Garbage collection
    const len = this.drawBuffer.length;
    for (let i = 512; len > i; i++) {
      this.drawBuffer.shift();
    }
    this.mouse.pX = this.mouse.x;
    this.mouse.pY = this.mouse.y;
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
    this.mouse = {
      x: 0,
      y: 0,
      pX: 0,
      pY: 0,
      drag: false,
    }
  }

  /**
   * Returns the stage.
   */
  getStage() {
    return this.stage;
  }

  constructor(stage) {
    // Init rendering.
    this.input = [];
    this.stage = stage;
    if (this.stage && this.stage.getContext) {
      this.initRendering();
      // Init game logic.
      this.initGameLogic();
    }
  }
}

// A usable canvas.
const stage = document.getElementById('canvas');

// Create a new Game instance.
const thisGame = new Game(stage);

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

const handleMouseDown = (event) => {
  const { clientX, clientY } = event;
  thisGame.setInput({
    type: 'mousedown',
    x: clientX - stage.offsetLeft + document.body.scrollLeft,
    y: clientY - stage.offsetTop + document.body.scrollTop,
  });
}

const handleMouseUp = (event) => {
  const { clientX, clientY } = event;
  thisGame.setInput({
    type: 'mouseup',
    x: clientX - stage.offsetLeft + document.body.scrollLeft,
    y: clientY - stage.offsetTop + document.body.scrollTop,
  });
}

const handleMouseMove = (event) => {
  const { clientX, clientY } = event;
  thisGame.setInput({
    type: 'mousemove',
    x: clientX - stage.offsetLeft + document.body.scrollLeft,
    y: clientY - stage.offsetTop + document.body.scrollTop,
  });
}

// Register event listeners for input.
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);
thisGame.getStage().addEventListener("mousedown", handleMouseDown, false);
thisGame.getStage().addEventListener("mouseup", handleMouseUp, false);
thisGame.getStage().addEventListener("mousemove", handleMouseMove, false);