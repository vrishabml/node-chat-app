const expect = require('expect');
const {isRealString} = require('./validation.js');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var res = isRealString(98);
    expect(res).toBe(false);
  });
  it('should reject string with space values', () => {
    var res = isRealString('    ');
    expect(res).toBe(false);
  });
  it('should allow string with non-space values', () => {
    var res = isRealString(' Vrishab   ');
    expect(res).toBe(true);
  });
})
