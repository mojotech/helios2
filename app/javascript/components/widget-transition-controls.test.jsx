import {
  selectShouldRequestPrefetch,
  selectShouldRequestWidget,
  selectIsPaused,
  isStarted,
} from '@components/widget-transition-controls';

describe('isPaused', () => {
  it('returns true if the timer is paused', () => {
    expect(selectIsPaused({ startTimestamp: null })).toEqual(true);
  });

  it('returns false if the timer is unpaused', () => {
    expect(selectIsPaused({ startTimestamp: Date.now() })).toEqual(false);
  });
});

describe('isStarted', () => {
  it('returns false if the timestamp of the start is of null value (paused state)', () => {
    expect(
      isStarted({ startTimestamp: null, msRemainingSinceLastStart: 100 }),
    ).toEqual(false);
  });

  it('returns false if the milliseconds remaining is of null value (msRemaining should not be null)', () => {
    expect(
      isStarted({ startTimestamp: 100, msRemainingSinceLastStart: null }),
    ).toEqual(false);
  });

  it('returns false if the milliseconds remaining or starting timestamp are of null value', () => {
    expect(
      isStarted({ startTimestamp: null, msRemainingSinceLastStart: null }),
    ).toEqual(false);
  });

  it('returns true if neither the starting timestamp nor milliseconds remaining are of null value (isStarted performing correctly)', () => {
    expect(
      isStarted({ startTimestamp: 100, msRemainingSinceLastStart: 100 }),
    ).toEqual(true);
  });
});

describe('shouldRequestPrefetch', () => {
  it('returns false if not ready to request prefetch', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 15000,
        prefetchRequestedYet: false,
      }),
    ).toEqual(false);
  });

  it('returns true if ready to request prefetch', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 19000,
        prefetchRequestedYet: false,
      }),
    ).toEqual(true);
  });

  it('returns false if ready to request prefetch but prefetch has been made already', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 21000,
        prefetchRequestedYet: true,
      }),
    ).toEqual(false);
  });

  it('returns true if ready to request prefetch and prefetch has not been made yet', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 21000,
        prefetchRequestedYet: false,
      }),
    ).toEqual(true);
  });
});

describe('shouldRequestWidget', () => {
  it('returns false if not ready to request widget', () => {
    expect(
      selectShouldRequestWidget({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 19000,
      }),
    ).toEqual(false);
  });

  it('returns true if ready to request widget', () => {
    expect(
      selectShouldRequestWidget({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 21000,
      }),
    ).toEqual(true);
  });
});

describe('shouldRequestPrefetch and not shouldRequestWidget', () => {
  it('returns true if ready to request prefetch', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 19000,
        prefetchRequestedYet: false,
      }),
    ).toEqual(true);
  });

  it('returns false if not ready to request widget', () => {
    expect(
      selectShouldRequestWidget({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 19000,
      }),
    ).toEqual(false);
  });
});

describe('shouldRequestPrefetch and shouldRequestWidget', () => {
  it('returns true if ready to request prefetch', () => {
    expect(
      selectShouldRequestPrefetch({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 21000,
        prefetchRequestedYet: false,
      }),
    ).toEqual(true);
  });

  it('returns true if ready to request widget', () => {
    expect(
      selectShouldRequestWidget({
        msRemainingSinceLastStart: 20000,
        startTimestamp: Date.now() - 21000,
      }),
    ).toEqual(true);
  });
});
