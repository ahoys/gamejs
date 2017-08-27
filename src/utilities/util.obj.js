const log = debug('utilities/util.obj');
const { remote } = require('electron');
const fs = remote.require('fs');

module.exports = {

  importForRegl: (path) => {
    const payload = { v: [], vI: [], };
    if (fs.existsSync(path)) {
      fs
      .readFileSync(path)
      .toString()
      .split('\n')
      .forEach((line) => {
        if (line.substr(0, 2) === 'v ') {
          // Generate base positions.
          const temp = [];
          line.replace('v ', '').split(' ').forEach((v) => {
            temp.push(Number(v));
          });
          payload.v.push(temp);
        } else if (line.substr(0, 3) === 'vt ') {

        } else if (line.substr(0, 3) === 'vn ') {
          
        } else if (line.substr(0, 3) === 'vp ') {

        } else if (line.substr(0, 2) === 'f ') {
          // Generate elements.
          const temp = [];
          line.replace('f ', '').split(' ').forEach((fS) => {
            const val = Number(fS.split('/')[0]) - 1;
            temp.push(val);
          });
          payload.vI.push(temp);
        }
      });
    }
    log(`Imported .obj from: ${path} for regl.`);
    return payload;
  },

  /**
   * Imports an .obj file.
   * See: https://en.wikipedia.org/wiki/Wavefront_.obj_file
   */
  importObj: (path) => {
    console.log(`Import .obj model: ${path}`);
    const payload = { v: [], vt: [], vn: [], vp: [], f: [], fP: [], vP: [], vI: [], vC: [], vCount: 0 };
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
          line.replace('v ', '').split(' ').forEach(x => {
            payload.v.push(Number(x));
          });
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
            // Vertex index.
            const valueArr = [];
            const split = section.split('/');
            payload.vI.push(Number(split[0]) - 1);
            split.forEach(val => {
              valueArr.push(Number(val));
            });
            temp.push(valueArr);
          });
          payload.f.push(temp);
        }
      });

      let i = 0;
      payload.v.forEach(v => {
        if (i === 2) {
          payload.vC.push(0.5);
          payload.vC.push(1.0);
          i = -1;
        } else {
          payload.vC.push(0.5);
        }
        i++;
      });

      payload.vCount = payload.v.length;

      return payload;
    } else {
      console.log(`File ${path} does not exist.`);
    }
    return payload;
  }
}
