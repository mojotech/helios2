import { isNotNull, isNotEmpty, isPresent, getMentionsAndTags } from './util';

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

describe('getMentionsAndTags', () => {
  it('handles empty objects', () => {
    expect(getMentionsAndTags('')).toEqual([]);
    expect(getMentionsAndTags('The quick brown fox')).toEqual([]);
  });
  it('handles tags', () => {
    expect(getMentionsAndTags('The quick #brown fox')).toEqual(['#brown']);
    expect(getMentionsAndTags('The quick bro#wn fox')).toEqual([]);
    expect(getMentionsAndTags('The quick brown# fox')).toEqual([]);
  });
  it('handles mentions', () => {
    expect(getMentionsAndTags('The quick brown @fox')).toEqual(['@fox']);
    expect(getMentionsAndTags('The quick brown fox@')).toEqual([]);
    expect(getMentionsAndTags('The quick brown fo@x')).toEqual([]);
  });
  it('handles a combination', () => {
    expect(getMentionsAndTags('The quick #brown @fox')).toEqual([
      '#brown',
      '@fox',
    ]);
    expect(getMentionsAndTags('The quick br#own fox@')).toEqual([]);
    expect(getMentionsAndTags('The quick #brown fo@x')).toEqual(['#brown']);
  });
});
