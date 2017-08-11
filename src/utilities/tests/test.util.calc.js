// nodeunit src/utilities/tests/test.util.calc.js

exports.to_radians = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toRadians(90);
  test.equal(result, 1.5707963267948966, result);
  test.done();
};
