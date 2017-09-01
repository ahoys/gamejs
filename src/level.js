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
  tilesCount: 0, // Count of tiles.
  propsCount: 0, // Count of props.
};

const getProcessedTiles = (tiles) => {
  if (typeof tiles === 'object' && tiles.constructor === Array) {
    tiles.forEach((tile) => {
      // [0] {string} type: "t_grass".
      // [1] {array} vertices.
      // [2] {array} indices.
    });
  }
  return [];
};

const getProcessedProps = (props) => {
  if (typeof props === 'object' && props.constructor === Array) {
    props.forEach((prop) => {
      // [0] {string} type: "p_monkey".
      // [1] {array} position: [x, y, z, rX, rY, rZ, scale].
    });
  }
  return [];
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
    if (fs.existsSync(`./src/levels/${name}_tiles.json`)) {
      // Process optional tiles.
      Level.tiles = getProcessedTiles(require(`./levels/${name}_tiles.json`));
      Level.tilesCount = Level.tiles.length;
    }
    if (fs.existsSync(`./src/levels/${name}_props.json`)) {
      // Process optional props.
      Level.props = getProcessedProps(require(`./levels/${name}_props.json`));
      Level.propsCount = Level.props.length;
    }
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
