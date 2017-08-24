const canvas = document.getElementById('glCanvas');

// Canvas must exist.
if (!canvas) {
  console.log('Error: missing canvas element "glCanvas".')
  throw 0;
};

module.exports = {

  /**
   * Returns a WebGL ready context.
   */
  getContext: () => {
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (context) {
      return context;
    } else {
      console.log('Error: unable to initialize WebGL context.');
      throw 0;
    }
  },

  /**
   * Returns width of the canvas.
   */
  getCanvasWidth: () => {
    return canvas.width;
  },

  /**
   * Returns height of the canvas.
   */
  getCanvasHeight: () => {
    return canvas.height;
  },
};
