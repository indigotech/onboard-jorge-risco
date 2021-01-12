import * as assert from 'assert';
import { testScript } from '../src/testScript';

describe('testScript', () => {
  it('should return "test ok!"', () => {
    const expected = 'test ok!';
    assert.equal(testScript(), expected);
  });
  it('should have output string lenght of 8', () => {
    const expected = 8;
    const str = testScript();
    assert.equal(str.length, expected);
  });
});
