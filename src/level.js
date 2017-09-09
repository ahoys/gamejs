/**
 * Level loading and processing.
 */
const log = debug('./src/level');
const fs = require('fs');
const Camera = require('./world/camera');
const WorldTile = require('./world/tile');
const StaticProp = require('./world/static-prop');
const DynamicProp = require('./world/dynamic-prop');

// Level.
const Level = {
  title: '', // Title of the level.
  camera: undefined, // Viewport.
  tiles: [], // Tiles of the level (ground and walls).
  props: [], // Props of the level (objects).
  tilesCount: 0, // Count of tiles.
  propsCount: 0, // Count of props.
};

const getProcessedCamera = (cameraConfig) => {
  if (cameraConfig) {
    const cam = Object.create(Camera);
    cam.setPosition(cameraConfig.position);
    cam.setRotation(cameraConfig.rotation);
    cam.setFov(cameraConfig.fov);
    log(`A new camera created.`);
    return cam;
  }
  log('The level is missing a camera.');
  return undefined;
}

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
        const sp = Object.create(StaticProp);
        sp.setModel(p[0]);
        sp.setPosition(p[1][0], p[1][1], p[1][2]);
        sp.setRotation(p[1][3], p[1][4], p[1][5]);
        sp.setScale(p[1][6]);
        results.push(sp);
      }
    });
    return results;
  }
  return [];
};

/**
 * Loads a new level.
 * @param {string} name
 */
Level.load = (name) => {
  log(`Loading a level ${name}.`);
  if (fs.existsSync(`./src/levels/${name}.json`)) {
    // Process config.
    res = require(`./levels/${name}.json`);
    Level.title = res.title;
    Level.camera = getProcessedCamera(res.camera);
    if (fs.existsSync(`./src/levels/${name}_tiles.json`)) {
      // Process optional tiles.
      Level.tiles = getProcessedTiles(require(`./levels/${name}_tiles.json`));
      Level.tilesCount = Level.tiles.length;
      log(`${Level.tilesCount} tiles loaded.`);
    }
    if (fs.existsSync(`./src/levels/${name}_props.json`)) {
      // Process optional props.
      Level.props = getProcessedProps(require(`./levels/${name}_props.json`));
      Level.propsCount = Level.props.length;
      log(`${Level.propsCount} props loaded.`);
    }
    log('Done!');
  } else {
    throw(`Level ${name} does not exist.`);
  }
};

module.exports = Level;
