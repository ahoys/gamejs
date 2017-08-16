const { remote } = require('electron');
const fs = remote.require('fs');

module.exports = {

  /**
   * Imports an .obj file.
   * See: https://en.wikipedia.org/wiki/Wavefront_.obj_file
   */
  importObj: (path) => {
    const payload = {};
    if (fs.existsSync(path)) {
      payload.v = [];
      payload.vt = [];
      payload.vn = [];
      payload.vp = [];
      payload.f = [];
      const data = fs.readFileSync(path).toString().split('\n');
      let vTemp = [];
      let vtTemp = [];
      let vnTemp = [];
      let vpTemp = [];
      let fTemp = [];
      data.forEach(line => {
        if (line.substr(0, 2) === 'v ') {
          // Geometric vertices [x, y, z, (w)].
          const vLine = line.replace('v ', '');
          vTemp.push(vLine.split('\n'));
          if (vTemp.length >= 4) {
            // Push one plane at the time.
            payload.v.push(vTemp);
            vTemp = [];
          }
        } else if (line.substr(0, 3) === 'vt ') {
          // Texture coordinates.
          const vtLine = line.replace('vt ', '');
          vtTemp.push(vtLine.split('\n'));
          if (vtTemp.length >= 4) {
            payload.vt.push(vtTemp);
            vtTemp = [];
          }
        } else if (line.substr(0, 3) === 'vn ') {
          // Vertex normals.
          const vnLine = line.replace('vn ', '');
          vnTemp.push(vnLine.split('\n'));
          if (vnTemp.length >= 4) {
            payload.vn.push(vnTemp);
            vnTemp = [];
          }
        } else if (line.substr(0, 3) === 'vp ') {
          // Parameter space vertices.
          const vpLine = line.replace('vp ', '');
          vpTemp.push(vpLine.split('\n'));
          if (vpTemp.length >= 4) {
            payload.vp.push(vpTemp);
            vpTemp = [];
          }
        } else if (line.substr(0, 2) === 'f ') {
          // Polygonal face element.
          const fLine = line.replace('f ', '');
          fTemp.push(fLine.split('\n'));
          if (fTemp.length >= 4) {
            payload.f.push(fTemp);
            fTemp = [];
          }
        }
      });
      return payload;
    } else {
      console.log(`File ${path} does not exist.`);
    }
    return payload;
  }
}
