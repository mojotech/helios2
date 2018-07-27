import { isNotNull, isNotEmpty, isPresent } from './util';

describe('#isNotNull', () => {
  it('handles nullables', () => {
    expect(isNotNull(undefined)).toEqual(false);
    expect(isNotNull(null)).toEqual(false);
  });
  it('handles empty objects', () => {
    expect(isNotNull('')).toEqual(true);
    expect(isNotNull([])).toEqual(true);
  });
});

describe('#isNotEmpty', () => {
  it('handles nullables', () => {
    expect(isNotEmpty(undefined)).toEqual(true);
    expect(isNotEmpty(null)).toEqual(true);
  });
  it('handles empty objects', () => {
    expect(isNotEmpty('')).toEqual(false);
    expect(isNotEmpty([])).toEqual(false);
  });
});

describe('#isPresent', () => {
  it('handles nullables', () => {
    expect(isPresent(undefined)).toEqual(false);
    expect(isPresent(null)).toEqual(false);
  });
  it('handles empty objects', () => {
    expect(isPresent('')).toEqual(false);
    expect(isPresent([])).toEqual(false);
  });
});
