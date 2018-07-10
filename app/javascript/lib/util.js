import { isNil, complement, and, isEmpty } from 'ramda';

export const isNotNull = complement(isNil);

export const isNotEmpty = complement(isEmpty);

export const isPresent = and(isNotNull, isNotEmpty);
