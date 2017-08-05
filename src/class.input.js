class Input {

  /**
   * Handles key down events.
   * Registers keys that are currently being pressed.
   * @param {*} event 
   */
  handleEventKeyDown(event) {
    event.preventDefault();
    if (this.keys.indexOf(event.keyCode) === -1) {
      this.keys.push(event.keyCode);
    }
  }

  /**
   * Handles key up events.
   * Removes released keys from the pressed keys.
   * @param {*} event 
   */
  handleEventKeyUp(event) {
    event.preventDefault();
    const newKeys = [];
    this.keys.forEach((key) => {
      if (key !== event.keyCode) {
        newKeys.push(key);
      }
    });
    this.keys = newKeys;
  }

  handleEventMouseDown(event, stage) {
    const now = performance.now();
    this.mouse.down = {
      time: now,
      button: event.button,
      doubleClick: (now - this.mouse.down.time < 768) && !this.mouse.down.doubleClick &&
        this.getDistance(this.mouse.x, this.mouse.y, this.mouse.down.dx, this.mouse.down.dy)
        < 10,
      dx: this.mouse.x,
      dy: this.mouse.y,
    };
  }

  handleEventMouseUp(event) {
    const now = performance.now();
    this.mouse.up = {
      time: performance.now(),
      button: event.button,
      doubleClick: (now - this.mouse.up.time < 768) && !this.mouse.up.doubleClick &&
        this.getDistance(this.mouse.x, this.mouse.y, this.mouse.up.ux, this.mouse.up.uy)
        < 10,
      ux: this.mouse.x,
      uy: this.mouse.y,
    };
  }

  /**
   * Handles mouse movement.
   * Registers the current and the past location of the cursor.
   * @param {*} event 
   */
  handleEventMouseMove(event) {
    this.mouse.pX = this.mouse.x;
    this.mouse.pY = this.mouse.y;
    this.mouse.x = event.clientX - this.stage.offsetLeft + document.body.scrollLeft;
    this.mouse.y = event.clientY - this.stage.offsetTop + document.body.scrollTop;
    this.mouse.distance = this.getDistance(
      this.mouse.x, this.mouse.y, this.mouse.pX, this.mouse.pY);
  }

  /**
   * Returns distance between two coordinates.
   * @param {number} x 
   * @param {number} y 
   * @param {number} xx 
   * @param {number} yy 
   */
  getDistance(x, y, xx, yy) {
    const w = x > xx
      ? x - xx
      : xx - x;
    const h = y > yy
      ? y - yy
      : yy - y;
    return Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
  }

  getKeys() {
    return this.keys;
  }

  getMouse() {
    return this.mouse;
  }

  constructor(stage) {
    this.stage = stage;
    this.keys = [];
    this.mouse = {
      x: 0,
      y: 0,
      pX: 0,
      pY: 0,
      down: {
        time: 0,
        button: 0,
        dx: 0,
        dy: 0,
        doubleClick: false,
      },
      up: {
        time: 0,
        button: 0,
        ux: 0,
        uy: 0,
        doubleClick: false,
      },
      distance: 0,
    };
    document.addEventListener("keydown", () => this.handleEventKeyDown(event), false);
    document.addEventListener("keyup", () => this.handleEventKeyUp(event), false);
    stage.addEventListener("mousedown", () => this.handleEventMouseDown(event), false);
    stage.addEventListener("mouseup", () => this.handleEventMouseUp(event), false);
    stage.addEventListener("mousemove", () => this.handleEventMouseMove(event), false);
    stage.addEventListener('contextmenu', event => event.preventDefault());
  }
}

module.exports = Input;
