import { isNil, complement, both, isEmpty } from 'ramda';

export const isNotNull = complement(isNil);

export const isNotEmpty = complement(isEmpty);

export const isPresent = both(isNotNull, isNotEmpty);

export const getMentionsAndTags = text => {
  const allWords = text.split(/[\s,\n]+/);
  return allWords.filter(word => word.startsWith('@') || word.startsWith('#'));
};
