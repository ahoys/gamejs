/**
 * Level loading and processing.
 */
const log = debug('./src/level');
const fs = require('fs');

// Level.
const Level = {
  title: '', // Title of the level.
  sizeX: 0, // Size on x-axel (width).
  sizeY: 0, // Size on y-axel (height).
  sizeZ: 0, // Size on z-axel (depth).
  volume: 0, // Total size in grids.
  tiles: [], // Tiles of the level (ground and walls).
  props: [], // Props of the level (objects).
  tileCount: 0, // Count of tiles.
  propsCount: 0, // Count of props.
};

const processProps = (props) => {
  if (typeof props === 'object' && props.constructor === Array) {
    props.forEach((prop) => {

    });
    Level.propsCount = Level.props.length;
  }
};

const processTiles = (tiles) => {
  if (typeof tiles === 'object' && tiles.constructor === Array) {
    tiles.forEach((tile) => {

    });
    Level.tileCount = Level.tiles.length;
  }
};

/**
 * Loads a new level.
 * @param {string} name
 */
Level.load = (name) => {
  if (fs.existsSync(`./src/levels/${name}.json`)) {
    res = require(`./levels/${name}.json`);
    Level.title = String(res.title) || '';
    Level.sizeX = Math.floor(Number(res.sizeX)) || 0;
    Level.sizeY = Math.floor(Number(res.sizeY)) || 0;
    Level.sizeZ = Math.floor(Number(res.sizeZ)) || 0;
    Level.volume = Level.sizeX * Level.sizeY * Level.sizeZ;
    processProps(res.props);
  } else {
    log(`Level (${name}) does not exist.`);
  }
};

/**
 * Returns true if a level is correctly loaded.
 */
Level.ready = () => {
  if (!Level.title || !Level.title.length) return false;
  if (sizeX < 1 || sizeY < 1 || sizeZ < 1) return false;
};

module.exports = Level;
