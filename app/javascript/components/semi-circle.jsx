import React from 'react';
import PropTypes from 'prop-types';
import cityImage from '../../assets/images/buildings.png';
import { yValue, xValue } from '../lib/circle-math';
import { timeDiffInMinutes, timeAndDateForTimezone } from '../lib/datetime';
import { colors } from '../lib/theme';

export class SemiCircle extends React.Component {
  static propTypes = {
    totalTime: PropTypes.number.isRequired,
    sunset: PropTypes.instanceOf(Date).isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
    paddingLeft: PropTypes.number,
    paddingTop: PropTypes.number,
    cityImageHeight: PropTypes.string,
    cityImageWidth: PropTypes.string,
    ballStartPadding: PropTypes.number,
    ballRadius: PropTypes.string,
  };

  static defaultProps = {
    paddingLeft: 30,
    paddingTop: 18.1,
    cityImageHeight: '174px',
    cityImageWidth: '393px',
    ballStartPadding: 50,
    ballRadius: '14.4px',
  };

  constructor(props) {
    super(props);
    this.state = {
      remainingTime: timeDiffInMinutes(
        this.props.sunset,
        timeAndDateForTimezone(this.props.timezone),
      ),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({
        remainingTime: timeDiffInMinutes(
          this.props.sunset,
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
      width,
      height,
      paddingLeft,
      paddingTop,
      cityImageHeight,
      cityImageWidth,
      ballStartPadding,
      ballRadius,
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
    return (
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="circleGradient">
            <stop offset="5%" stopColor={colors.lightPink} />
            <stop offset="95%" stopColor={colors.black} />
          </radialGradient>
        </defs>
        <defs>
          <linearGradient id="strokeGradient">
            <stop offset="2%" stopColor={colors.black} />
            <stop offset="50%" stopColor={colors.pink} />
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
        <circle
          cx={ballX.toString()}
          cy={yValue(ballX, rxEllipse, ryEllipse, ellipseCenterX, heightFloat)}
          r={ballRadius}
          fill={colors.pink}
        />
      </svg>
    );
  }
}

export default SemiCircle;
