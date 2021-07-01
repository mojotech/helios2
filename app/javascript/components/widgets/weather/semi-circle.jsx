import React from 'react';
import PropTypes from 'prop-types';
import cityImage from '@images/buildings.png';
import { yValue, xValue } from '@lib/circle-math';
import { timeDiffInMinutes, timeAndDateForTimezone } from '@lib/datetime';
import { colors } from '@lib/theme';
import styled, { keyframes } from 'styled-components';
import MoonPhase from '@weather/moon-phase';

const getPhaseType = phase => {
  if (phase === 0) return 'newMoon';
  if (phase > 0 && phase < 0.25) return 'waxCres';
  if (phase === 0.25) return 'firstQuart';
  if (phase > 0.25 && 0.5) return 'waxGib';
  if (phase === 0.5) return 'fullMoon';
  if (phase > 0.5 && phase < 0.75) return 'wanGib';
  if (phase === 0.75) return 'thirdQuart';
  return 'wanCres';
};

const getEllipseTopArc = (x, y, xRadius, yRadius) => {
  const startX = x - xRadius;
  const endX = x + xRadius;
  return `M ${startX} ${y} A ${xRadius} ${yRadius} 0 1 1 ${endX} ${y}`;
};

const getOrbPercent = (endTime, totalTime, offset) => {
  const startTime = new Date(endTime - totalTime * 60000);
  const elapsedMinutes = (new Date() - startTime) / 1000 / 60;
  // determine the percent of the total time that has elapsed
  const timeElapsedPercent = (elapsedMinutes / totalTime) * 100;
  // limit the percent to a given range based on offset
  const rangePercent = (timeElapsedPercent / 100) * (100 - offset * 2) + offset;
  return Math.floor(rangePercent);
};

const Default = {
  sun: colors.pink,
  foreground: colors.lightPink,
};

const NightMode = {
  moon: colors.blue,
  foreground: colors.lightBlue,
};

export class SemiCircle extends React.Component {
  static propTypes = {
    totalTime: PropTypes.number.isRequired,
    endTime: PropTypes.instanceOf(Date).isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
    paddingLeft: PropTypes.number,
    paddingTop: PropTypes.number,
    cityImageHeight: PropTypes.string,
    cityImageWidth: PropTypes.string,
    ballStartPadding: PropTypes.number,
    ballRadius: PropTypes.string,
    nightMode: PropTypes.bool.isRequired,
    moonPhase: PropTypes.number.isRequired,
  };

  static defaultProps = {
    paddingLeft: 30,
    paddingTop: 18.1,
    cityImageHeight: '212px',
    cityImageWidth: '479px',
    ballStartPadding: 50,
    ballRadius: '14.4px',
  };

  constructor(props) {
    super(props);
    this.state = {
      remainingTime: timeDiffInMinutes(
        this.props.endTime,
        timeAndDateForTimezone(this.props.timezone),
      ),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({
        remainingTime: timeDiffInMinutes(
          this.props.endTime,
          timeAndDateForTimezone(this.props.timezone),
        ),
      });
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const {
      totalTime,
      endTime,
      width,
      height,
      paddingLeft,
      paddingTop,
      cityImageHeight,
      cityImageWidth,
      ballStartPadding,
      ballRadius,
      nightMode,
      moonPhase,
    } = this.props;
    const widthFloat = parseFloat(width);
    const heightFloat = parseFloat(height);
    const { remainingTime } = this.state;
    const ballX = xValue(
      remainingTime,
      totalTime,
      widthFloat,
      ballStartPadding,
    );
    const rxEllipse = widthFloat / 2 - paddingLeft;
    const ryEllipse = heightFloat - paddingTop;
    const ellipseCenterX = widthFloat / 2;
    const arcBeginPercent = 12;
    const arcPath = getEllipseTopArc(
      ellipseCenterX,
      heightFloat,
      rxEllipse,
      ryEllipse,
    );
    const arcEndPercent = getOrbPercent(endTime, totalTime, arcBeginPercent);
    const arcAnimation = keyframes`
    0% { offset-distance : ${arcBeginPercent}% }
    100% { offset-distance : ${arcEndPercent}% }
    `;

    const styleRadialGradient = () => {
      if (nightMode) return NightMode.foreground;
      return Default.foreground;
    };

    const styleLinearGradient = () => {
      if (nightMode) return NightMode.moon;
      return Default.sun;
    };

    return (
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="circleGradient">
            <stop offset="5%" stopColor={styleRadialGradient()} />
            <stop offset="95%" stopColor={colors.black} />
          </radialGradient>
        </defs>
        <defs>
          <linearGradient id="strokeGradient">
            <stop offset="2%" stopColor={colors.black} />
            <stop offset="50%" stopColor={styleLinearGradient()} />
            <stop offset="98%" stopColor={colors.black} />
          </linearGradient>
        </defs>
        <ellipse
          cx={ellipseCenterX.toString()}
          cy={height}
          rx={rxEllipse.toString()}
          ry={ryEllipse.toString()}
          stroke="url(#strokeGradient)"
          strokeWidth="1.6"
          fill="url(#circleGradient)"
          fillOpacity="1"
        />
        <image
          x={((widthFloat - parseFloat(cityImageWidth)) / 2).toString()}
          y={(heightFloat - parseFloat(cityImageHeight) + 1).toString()}
          width={cityImageWidth}
          height={cityImageHeight}
          xlinkHref={cityImage}
          position="absolute"
        />
        {nightMode ? (
          <MoonPhase
            posX={xValue(
              remainingTime,
              totalTime,
              widthFloat,
              ballStartPadding,
            )}
            posY={yValue(
              ballX,
              rxEllipse,
              ryEllipse,
              ellipseCenterX,
              heightFloat,
            )}
            radius={ballRadius}
            phase={getPhaseType(moonPhase)}
            arcPath={arcPath}
            arcAnimation={arcAnimation}
          />
        ) : (
          <SunCircle
            arcPath={arcPath}
            arcAnimation={arcAnimation}
            ballRadius={ballRadius}
          />
        )}
      </svg>
    );
  }
}

const SunCircle = styled.circle`
offset-path: path('${p => p.arcPath}');
animation: ${p => p.arcAnimation} 1000ms 1 normal forwards ease-in-out;
r: ${p => p.ballRadius};
fill: ${colors.pink}`;

export default SemiCircle;
