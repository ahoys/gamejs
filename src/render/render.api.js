const log = debug('render/render.api.js');

module.exports = {
  init: (id) => require('./funcs/func.init')(id),
  frame: require('./funcs/func.frame'),
};
