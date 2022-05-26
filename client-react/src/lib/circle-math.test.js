import { xValue } from './circle-math';

describe('atSunset (day mode) / atSunrise (night mode)', () => {
  const remainingTime = 0;
  const totalTime = 600;
  const width = 800;
  const circlePadding = 50;
  it('makes sure that the sunrise/sunset ball ends at end of path', () => {
    expect(xValue(remainingTime, totalTime, width, circlePadding)).toEqual(
      width - circlePadding,
    );
  });
});

describe('atSunrise (day mode) / atSunset (night mode)', () => {
  const remainingTime = 600;
  const totalTime = 600;
  const width = 800;
  const circlePadding = 50;
  it('makes sure that the sunrise/sunset ball starts at beginning of path', () => {
    expect(xValue(remainingTime, totalTime, width, circlePadding)).toEqual(
      circlePadding,
    );
  });
});
