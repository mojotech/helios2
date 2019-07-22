import { nullState, getState } from './ducks';

describe('#getState', () => {
  it('should return nullState for undefined', () => {
    expect(getState()).toEqual(nullState);
  });

  it('should return nullState for empty data', () => {
    expect(getState({})).toEqual(nullState);
  });

  it('should return nullState for bad world data', () => {
    expect(
      getState({
        fallingBlocksState: {
          world: '{ "some": "json", "values": 1 }',
        },
      }),
    ).toEqual(nullState);
  });
});
