// nodeunit src/utilities/tests/test.util.calc.js

exports.toRadians_0 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toRadians(0);
  test.equal(result, 0, result);
  test.done();
};

exports.toRadians_45 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toRadians(45);
  test.equal(result, 0.7853981633974483, result);
  test.done();
};

exports.toRadians_90 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toRadians(90);
  test.equal(result, 1.5707963267948966, result);
  test.done();
};

exports.toRadians_360 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toRadians(360);
  test.equal(result, 6.283185307179586, result);
  test.done();
};

exports.toDegrees_0 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toDegrees(0);
  test.equal(result, 0, result);
  test.done();
};

exports.toDegrees_0785 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.toDegrees(0.7853981633974483);
  test.equal(result, 45, result);
  test.done();
};

exports.getAngle_45 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.getAngle(0, 0, 1, 1);
  // Same as 45 deg.
  test.equal(result, 0.7853981633974483, result);
  test.done();
};

exports.getAngle_135 = (test) => {
  const Calc = require('../util.calc');
  const result = Calc.getAngle(0, 0, -1, -1);
  // Same as -135 deg.
  test.equal(result, -2.356194490192345, result);
  test.done();
};
