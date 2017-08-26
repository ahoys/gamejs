const el = document.getElementById('debug');
let start, pCount, vCount, lastRefresh = 0;

module.exports = {

  /**
   * Initializes a new debug run.
   */
  init: () => {
    start = performance.now();
    pCount = 0;
    vCount = 0;
  },

  /**
   * Counts props.
   */
  increasePropCount: (c) => {
    pCount += c;
  },

  /**
   * Counts vertexes.
   */
  increaseVertexCount: (c) => {
    vCount += c;
  },

  /**
   * Refreshes the debug UI.
   */
  refresh: (payload) => {
    const now = performance.now();
    if (now > lastRefresh + 250) {
      lastRefresh = now;
      const { camera, tFrame, lastTick, tickLength } = payload;
      const elapsed = now - start;
      const headroom = 16 - elapsed;
      const headroomClass = headroom < 10 ? headroom < 4 ? 'danger' : 'warning' : '';
      el.innerHTML = `
        <ul>
        <li class="${headroomClass}">
          Headroom: ${(headroom).toFixed(2)} ms
        </li>
        <li>Camera: 
          X ${(camera.x).toFixed(2)} 
          Y ${(camera.y).toFixed(2)} 
          Z ${(camera.z).toFixed(2)} 
          rX ${(camera.rX).toFixed(2)} 
          rY ${(camera.rY).toFixed(2)} 
          rZ ${(camera.rZ).toFixed(2)} 
          FoV ${(camera.fov).toFixed(2)}
        </li>
        <li>Props: ${pCount}</li>
        <li>Vertices: ${vCount}</li>
        <li>TickLength: ${tickLength} Offsync: ${(tFrame - lastTick).toFixed(0)}</li>
      </ul>
      `;
    }
  }
};
