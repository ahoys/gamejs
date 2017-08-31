/**
 * Input handling.
 */
const log = debug('./src/input');

// Input.
const Input = {
  pressedKey: [],
  pressedMouse: [],
};

/**
 * Removes a key from the pressed keys.
 * @param {string} key 
 * @param {boolean} mouse 
 */
const removePressedKey = (key, isMouse) => {
  const i = isMouse ? Input.pressedMouse.indexOf(key) : Input.pressedKey.indexOf(key);
  if (i !== -1) {
    if (isMouse) {
      Input.pressedMouse.splice(i, 1);
    } else {
      Input.pressedKey.splice(i, 1);
    }
  }
};

/**
 * Adds a key that is currently being pressed.
 * @param {string} key 
 * @param {boolean} mouse 
 */
const addPressedKey = (key, isMouse) => {
  const i = isMouse ? Input.pressedMouse.indexOf(key) : Input.pressedKey.indexOf(key);
  if (i === -1) {
    if (isMouse) {
      Input.pressedMouse.push(key);
    } else {
      Input.pressedKey.push(key);
    }
  }
};

const handleKeyDown = (e) => {
  e.preventDefault();
  addPressedKey(e.key, false);
};

const handleKeyUp = (e) => {
  e.preventDefault();
  removePressedKey(e.key, false);
};

const handleMouseDown = (e) => {
  e.preventDefault();
  addPressedKey(e.button, true);
};

const handleMouseUp = (e) => {
  e.preventDefault();
  removePressedKey(e.button, true);
};

document.addEventListener('keydown', () => handleKeyDown(event), false);
document.addEventListener('keyup', () => handleKeyUp(event), false);
document.addEventListener('pointerdown', () => handleMouseDown(event), false);
document.addEventListener('pointerup', () => handleMouseUp(event), false);

module.exports = Input;
