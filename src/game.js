/**
 * Here we initialize and run the game logic and therefore the game itself.
 */
const log = debug('./src/game');
const Level = require('./src/class.level');
const Input = require('./src/input');

// Game.
const Game = {};
let time, tickLength, lastTick;

/**
* Initializes the game.
* @param {object} payload: The initial game config (see EOF).
*/
Game.init = (payload) => {
  time = 0;
  tickLength = payload.tickLength;
  lastTick = performance.now();
  Game.main(lastTick);
};

/**
* The main game loop.
* @param {number} raFrame: The current animation frame.
*/
Game.main = (raFrame) => {
  Game.stopFncMain = window.requestAnimationFrame(() => Game.main(performance.now()));
  Game.queue(
    raFrame > lastTick + tickLength ? Math.floor((raFrame - lastTick) / tickLength) : 0
  );
};

/**
* Queues a game logic update.
* @param {number} tickC: The amount of ticks to be processed.
*/
Game.queue = (tickC) => {
  for (let i = 0; i < tickC; i++) {
    lastTick = lastTick + tickLength;
    Game.update(lastTick);
  }
};

/**
* Updates the game logic.
* Controlled by the main game loop.
* @param {number} lastTick: Tick to be updated.
*/
Game.update = (lastTick) => {

};

/**
* Input the initial configuration for the game.
*/
Game.init({
  level: 'lvl_cube',
  tickLength: 50,
});
