/**
 * Here we initialize and run the game logic and therefore the game itself.
 */
const log = debug('./src/game');
const Level = require('./src/class.level');
const Input = require('./src/input');

const Game = {};

/**
* Initializes the game.
* @param {object} payload: The initial game config (see EOF).
*/
Game.fncInit = (payload) => {
  Game.time = 0;
  Game.tickLength = payload.tickLength;
  Game.lastTick = performance.now();
  Game.fncMain(Game.lastTick);
};

/**
* The main game loop.
* @param {number} raFrame: The current animation frame.
*/
Game.fncMain = (raFrame) => {
  Game.stopFncMain = window.requestAnimationFrame(() => Game.fncMain(performance.now()));
  Game.fncQueue(
  raFrame > Game.lastTick + Game.tickLength
  ? Math.floor((raFrame - Game.lastTick) / Game.tickLength) : 0
  );
};

/**
* Queues a game logic update.
* @param {number} tickC: The amount of ticks to be processed.
*/
Game.fncQueue = (tickC) => {
  for (let i = 0; i < tickC; i++) {
    Game.lastTick = Game.lastTick + Game.tickLength;
    Game.fncUpdate(Game.lastTick);
  }
};

/**
* Updates the game logic.
* Controlled by the main game loop.
* @param {number} lastTick: Tick to be updated.
*/
Game.fncUpdate = (lastTick) => {
  log(`Keys: ${Input.pressedKey}, Mouse: ${Input.pressedMouse}.`);
};

/**
* Input the initial configuration for the game.
*/
Game.fncInit({
  level: 'lvl_cube',
  tickLength: 50,
});
