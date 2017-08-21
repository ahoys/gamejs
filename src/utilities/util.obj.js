const { remote } = require('electron');
const fs = remote.require('fs');

module.exports = {

  /**
   * Imports an .obj file.
   * See: https://en.wikipedia.org/wiki/Wavefront_.obj_file
   */
  importObj: (path) => {
    console.log(`Import .obj model: ${path}`);
    const payload = { v: [], vt: [], vn: [], vp: [], f: [], fP: [], vP: [] };
    const tempF = [];
    let fPoints = [];
    if (fs.existsSync(path)) {
      fs
      .readFileSync(path)
      .toString()
      .split('\n')
      .forEach(line => {
        if (line.substr(0, 2) === 'v ') {
          // Geometric vertices.
          payload.v.push(line.replace('v ', '').split(' '));
        } else if (line.substr(0, 3) === 'vt ') {
          // Texture coordinates.
          payload.vt.push(line.replace('vt ', '').split(' '));
        } else if (line.substr(0, 3) === 'vn ') {
          // Vertex normals.
          payload.vn.push(line.replace('vn ', '').split(' '));
        } else if (line.substr(0, 3) === 'vp ') {
          // Parameter space vertices.
          payload.vp.push(line.replace('vp ', '').split(' '));
        } else if (line.substr(0, 2) === 'f ') {
          // Polygonal face element.
          // The first value is v, second vt and third vn.
          const fLine = line.replace('f ', '').split(' ');
          const temp = [];
          fLine.forEach(section => {
            const valueArr = [];
            section.split('/').forEach(val => {
              valueArr.push(Number(val));
            });
            temp.push(valueArr);
          });
          payload.f.push(temp);
        }
      });
      // Link values to payload.fP
      const temp = [];
      payload.f.forEach(f => {
        // [[1,1,1], [2,2,2], [3,3,3]]
        const fTemp = [];
        f.forEach(valueSet => {
          // [1,1,1]
          const vsTemp = [];
          valueSet.forEach((value, j) => {
            if (j === 0) {
              // v
              vsTemp.push(payload.v[value - 1]);
            } else if (j === 1) {
              // vt
              vsTemp.push(payload.vt[value - 1]);
            } else if (j === 2) {
              // vn
              vsTemp.push(payload.vn[value - 1]);
            }
          });
          fTemp.push(vsTemp);
        });
        temp.push(fTemp);
      });
      payload.fP = temp;
      // Process v
      payload.fP.forEach(fP => {
        fP.forEach(valueSet => {
          payload.vP = payload.vP.concat(valueSet[0]);
        });
      });
      console.log(payload.vP);
      return payload;
    } else {
      console.log(`File ${path} does not exist.`);
    }
    return payload;
  }
}
