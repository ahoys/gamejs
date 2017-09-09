/**
 * Level loading and processing.
 */
const log = debug('./src/level');
const fs = require('fs');
const WorldTile = require('./world/tile');

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
    const results = [];
    tiles.forEach((t) => {
      // [0] {string} type: "t_grass".
      // [1] {array} vertices (one square === two triangles).
      // [2] {array} indices (vertices of two triangles -> 6).
      // - 4 vertices of a square with positional x, y, z data -> 12 values (4*3).
      // - One square is formed of two triangles.
      // - One triangle has 3 vertices, therefore total 6 indices.
      if (
        typeof t[0] === 'string' &&
        typeof t[1] === 'object' && t[1].constructor === Array &&
        typeof t[2] === 'object' && t[2].constructor === Array &&
        t[1].length === 12 && t[2].length === 6
      ) {
        // Only the validated tiles are registered.
        const tile = Object.create(WorldTile);
        tile.setType(t[0]);
        tile.setVertices(t[1]);
        tile.setIndices(t[2]);
        results.push(tile);
      }
    });
    return results;
  }
  return [];
};

const getProcessedProps = (props) => {
  if (typeof props === 'object' && props.constructor === Array) {
    const results = [];
    props.forEach((p) => {
      // [0] {string} type: "p_monkey".
      // [1] {array} position: [x, y, z, rX, rY, rZ, scale].
      // - Type defines what object will be loaded.
      // - Position is position relative to the world, not the object itself.
      if (
        typeof p[0] === 'string' &&
        typeof p[1] === 'object' && p[1].constructor === Array &&
        p[1].length === 7 &&
        typeof p[1][0] === 'number' && typeof p[1][1] === 'number' &&
        typeof p[1][2] === 'number' && typeof p[1][3] === 'number' &&
        typeof p[1][4] === 'number' && typeof p[1][5] === 'number' &&
        typeof p[1][6] === 'number'
      ) {
        // Only the validated props are registered.
        //results.push(new Prop(p[0], p[1][0], p[1][1], p[1][2], p[1][3], p[1][4], p[1][5], p[1][6]));
      }
    });
  }
  return [];
};

/**
 * Loads a new level.
 * @param {string} name
 */
Level.load = (name) => {
  log(`Loading ${name}.`);
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
      console.log(Level.tiles, Level.tilesCount);
    }
    if (fs.existsSync(`./src/levels/${name}_props.json`)) {
      // Process optional props.
      Level.props = getProcessedProps(require(`./levels/${name}_props.json`));
      Level.propsCount = Level.props.length;
    }
    log('Done!');
  } else {
    throw(`Level ${name} does not exist.`);
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
