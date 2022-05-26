export const yValue = (x, rx, ry, centerX, height) => {
  let relativeX;
  if (x < centerX) {
    relativeX = centerX - x;
  } else {
    relativeX = x - centerX;
  }
  const y = height - Math.sqrt(ry ** 2 * (1 - relativeX ** 2 / rx ** 2));
  return y.toString();
};

export const xValue = (remainingTime, totalTime, width, circlePadding) => {
  const xStart = circlePadding;
  const xEnd = width - circlePadding;
  if (remainingTime >= totalTime) {
    return xStart;
  }
  if (remainingTime <= 0) {
    return xEnd;
  }
  return xStart + ((xEnd - xStart) / totalTime) * (totalTime - remainingTime);
};
