import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getWeatherEffect = gql`
  fragment WeatherEffect on Weather {
    current {
      weather {
        id
      }
      windSpeed
    }
  }
`;

const EffectContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  mask-image: radial-gradient(farthest-side at bottom, #000e, #000b 70%, #0000);
`;

const Drop = styled.div`
  position: absolute;
  bottom: 100%;
  pointer-events: none;
`;

const floorTo = (value, decimal) => {
  const exp = 10 ** decimal;
  return Math.floor(value * exp) / exp;
};

const percent = value => value * 100;

const evenlyDistribute = (index, total) => {
  return floorTo(percent(index + Math.random() * 0.8) / total, 2);
};

const WeatherWrapper = React.memo(({ Type, duration, variance, count }) =>
  new Array(count).fill().map((_, index) => (
    <Type
      key={index.toString()}
      style={{
        left: `${evenlyDistribute(index, count)}%`,
        animationDelay: `${Math.random() * -(duration + variance)}s`,
        animationDuration: `${duration + Math.random() * variance}s`,
        animationIterationCount: 'infinite',
      }}
    />
  )),
);

WeatherWrapper.propTypes = {
  Type: PropTypes.object.isRequired, // eslint-disable-line
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

const HorizontalWeatherWrapper = React.memo(
  ({ Type, duration, variance, count }) =>
    new Array(count).fill().map((_, index) => (
      <Type
        key={index.toString()}
        style={{
          top: `${evenlyDistribute(index, count)}%`,
          animationDelay: `${Math.random() * -(duration + variance)}s`,
          animationDuration: `${duration + Math.random() * variance}s`,
          animationIterationCount: 'infinite',
        }}
      />
    )),
);

HorizontalWeatherWrapper.propTypes = {
  Type: PropTypes.object.isRequired, // eslint-disable-line
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};
/* Weather ID Types: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 * 8__: Clear / Clouds
 * 7__: Atmosphere (particles)
 * 6__: Snow
 * 5__: Rain
 * 3__: Drizzle
 * 2__: Thunder
 *     _0_: w/ Rain
 *     _1_: Clear
 *     _2_: Ragged, clearing?
 *     _3_: w/ Drizzle
 */

// #region Rain

const RainDropFrames = keyframes`
  0% {
    bottom: 100%;
  }
  100% {
    bottom: -60px;
  }
`;

const RainDrop = styled(Drop)`
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, #fff0, #ffff);
  animation: ${RainDropFrames} linear;
`;

const RainContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  ${props => css`
    right: ${Math.tan(props.angle / 57.29) * 10}%;
    transform: skew(${props.angle}deg);
  `}
`;

const Rain = ({ duration, variance, count, angle }) => (
  <RainContainer angle={angle}>
    <WeatherWrapper {...{ Type: RainDrop, duration, variance, count }} />
  </RainContainer>
);

Rain.propTypes = {
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  angle: PropTypes.number,
};

Rain.defaultProps = { angle: 0 };

// #endregion
// #region Drizzle

const DrizzleDrop = styled(RainDrop)`
  height: 30px;
  background: linear-gradient(to bottom, #fff0, #fff8);
`;

const Drizzle = ({ duration, variance, count }) => (
  <WeatherWrapper {...{ Type: DrizzleDrop, duration, variance, count }} />
);

Drizzle.propTypes = {
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

// #endregion
// #region Snow

const SnowWaveFrames = keyframes`
  0% {
    transform: translateX(0px);
  }
  30% {
    transform: translateX(-16px);
  }
  70% {
    transform: translateX(16px);
  }
  100% {
    transform: translateX(0px);
  }
`;

const SnowDropFrames = keyframes`
  0% {
    bottom: 100%
  }
  100% {
    bottom: -12px;
  }
`;

const HeavySnowFallFrames = keyframes`
  0% {
    transform: translateX(-80px);
  }
  100% {
    transform: translateX(20px);
  }
`;

const HeavySnowFall = styled(Drop)`
  background: white;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  animation: ${SnowDropFrames} linear, ${HeavySnowFallFrames} ease-in-out;
`;

const SnowFall = styled(Drop)`
  background: white;
  width: 3px;
  height: 3px;
  border-radius: 3px;
  animation: ${SnowDropFrames} linear, ${SnowWaveFrames} ease-in-out;
`;

const Snow = ({ duration, variance, count }) => (
  <WeatherWrapper {...{ Type: SnowFall, duration, variance, count }} />
);

Snow.propTypes = {
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

const HeavySnow = ({ duration, variance, count }) => (
  <WeatherWrapper {...{ Type: HeavySnowFall, duration, variance, count }} />
);

HeavySnow.propTypes = {
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

// #endregion
// #region Thunder

// Reference: https://codepen.io/Chrislion_me/pen/rVqwbO
const LightningKeyframes = keyframes`
{
  0% {opacity: 0;}

  40% {opacity: 0%;}
  41% {opacity: 50%;}
  43% {opacity: 20%;}
  44% {opacity: 90%;}
  50% {opacity: 0%;}

  100% {opacity: 0%;}
}
`;

const ThunderClouds = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dfff;
  animation: ${LightningKeyframes} ease-out 8s infinite;
`;

const Clouds = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #999, #9999 40%, #9992 80%, #000b);
`;

const Thunder = () => {
  return (
    <>
      <Clouds />
      <ThunderClouds />
    </>
  );
};
// #endregion

// cloud starts here
const CloudMotionFrames = keyframes`
   0% {
    left: -200px;
  }
  100% {
    left: 100%;
  }
`;

const MoveUpDown = keyframes`
0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(40px);
  }
  60% {
    transform: translateY(-100px); 
  }
  100% {
    transform: translateY(0);
  }
`;

const CloudImage = css`
  opacity: 60%;
  background: white;
  width: 200px;
  height: 150px;
  border-radius: 0 0 50px 50px;
  background: radial-gradient(35px 30px, white 98%, transparent 100%) 20% 30% /70px
      60px,
    radial-gradient(50px 45px, white 98%, transparent 100%) 50% 50% /100px 90px,
    radial-gradient(50px, white 98%, transparent 100%) 100% 100%/100px 100px,
    radial-gradient(40px, white 98%, transparent 100%) 0 100% /80px 80px,
    linear-gradient(white, white) bottom/100% 40px;
  background-repeat: no-repeat;
`;

const MovingCloud = styled.div`
  bottom: 100%;
  position: absolute;
  top: 120px;
  animation: ${CloudMotionFrames} linear, ${MoveUpDown} linear;
  ${CloudImage};
`;

const Cloud = ({ duration, variance, count, windSpeed }) => {
  if (windSpeed <= 10) {
    return (
      <HorizontalWeatherWrapper
        {...{ Type: MovingCloud, duration: duration + 15, variance, count }}
      />
    );
  }
  if (windSpeed >= 15) {
    return (
      <HorizontalWeatherWrapper
        {...{ Type: MovingCloud, duration: duration - 5, variance, count }}
      />
    );
  }
  return (
    <HorizontalWeatherWrapper
      {...{ Type: MovingCloud, duration, variance, count }}
    />
  );
};

Cloud.propTypes = {
  duration: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
};
// Cloud ends here

// #endregion

/* eslint-disable prettier/prettier */
const RainLight = () => <Rain duration={0.6} variance={0.4} count={10} />;
const RainModerate = () => <Rain duration={0.5} variance={0.3} count={20} />;
const RainHeavy = () => (
  <Rain duration={0.5} variance={0.2} count={35} angle={15} />
);
const RainIntense = () => (
  <Rain duration={0.4} variance={0.1} count={40} angle={30} />
);
const RainExtreme = () => (
  <Rain duration={0.5} variance={0.1} count={60} angle={45} />
);

const DrizzleLight = () => <Drizzle duration={1.8} variance={0.5} count={30} />;
const DrizzleModerate = () => (
  <Drizzle duration={1.5} variance={0.5} count={45} />
);
const DrizzleHeavy = () => <Drizzle duration={1.2} variance={0.4} count={60} />;

const weatherIdMap = {
  200: () => (
    <>
      <RainModerate /> <Thunder />
    </>
  ), // Light rain
  201: () => (
    <>
      <RainHeavy /> <Thunder />
    </>
  ), // Moderate rain
  202: () => (
    <>
      <RainIntense /> <Thunder />
    </>
  ), // Heavy rain
  210: () => <Thunder />, // Light thunderstorm
  211: () => <Thunder />, // Moderate thunderstorm
  212: () => <Thunder />, // Heavy thunderstorm
  221: () => <Thunder />, // Ragged thunderstorm
  230: () => (
    <>
      <DrizzleLight /> <Thunder />
    </>
  ), // Light drizzle
  231: () => (
    <>
      <DrizzleModerate /> <Thunder />
    </>
  ), // Moderate drizzle
  232: () => (
    <>
      <DrizzleHeavy /> <Thunder />
    </>
  ), // Heavy drizzle
  300: () => <DrizzleLight />, // Light
  301: () => <DrizzleModerate />, // Moderate
  302: () => <DrizzleHeavy />, // Heavy
  310: () => (
    <>
      <DrizzleLight /> <RainLight />
    </>
  ), // Light rain
  311: () => (
    <>
      <DrizzleLight /> <RainModerate />
    </>
  ), // Moderate rain
  312: () => (
    <>
      <DrizzleModerate /> <RainModerate />
    </>
  ), // Heavy rain
  313: () => (
    <>
      <DrizzleLight /> <RainModerate />
    </>
  ), // Shower rain
  314: () => (
    <>
      <DrizzleModerate /> <RainModerate />
    </>
  ), // Heavy shower rain
  321: () => <DrizzleModerate />, // Shower
  500: () => <RainLight />, // Light
  501: () => <RainModerate />, // Moderate
  502: () => <RainHeavy />, // Heavy
  503: () => <RainIntense />, // Very heavy
  504: () => <RainExtreme />, // Extreme
  511: () => <RainModerate />, // Freezing
  520: () => <RainLight />, // Light shower
  521: () => <RainModerate />, // Moderate shower
  522: () => <RainHeavy />, // Heavy shower
  531: () => <RainModerate />, // Ragged shower
  600: () => <Snow duration={6} variance={2} count={20} />, // Light
  601: () => <Snow duration={4} variance={2} count={50} />, // Normal
  602: () => <Snow duration={2} variance={2} count={70} />, // Heavy
  611: () => <HeavySnow duration={3} variance={2} count={20} />, // Sleet
  612: () => <HeavySnow duration={2} variance={1} count={35} />, // Sleet
  613: () => <HeavySnow duration={1.5} variance={1} count={45} />, // Sleet
  615: () => (
    <>
      <Snow duration={4} variance={2} count={20} /> <RainLight />
    </>
  ), // Light rain and snow
  616: () => (
    <>
      <Snow duration={2} variance={2} count={30} /> <RainModerate />
    </>
  ), // Rain and snow
  620: () => <Snow duration={6} variance={1} count={20} />, // Light
  621: () => <Snow duration={4} variance={1} count={50} />, // Normal
  622: () => <Snow duration={2} variance={1} count={70} />, // Heavy
  // eslint-disable-next-line react/prop-types
  801: ({ windSpeed }) => (
    <Cloud duration={16} variance={1} count={2} windSpeed={windSpeed} />
  ), // few cloud
  // eslint-disable-next-line react/prop-types
  802: ({ windSpeed }) => (
    <Cloud duration={16} variance={5} count={4} windSpeed={windSpeed} />
  ), // scattered cloud
  // eslint-disable-next-line react/prop-types
  803: ({ windSpeed }) => (
    <Cloud duration={16} variance={10} count={8} windSpeed={windSpeed} />
  ), // broken cloud
  // eslint-disable-next-line react/prop-types
  804: ({ windSpeed }) => (
    <Cloud duration={16} variance={15} count={16} windSpeed={windSpeed} />
  ), // overcast cloud
};
/* eslint-enable prettier/prettier */

const WeatherEffect = ({ weather }) => {
  const {
    current: {
      weather: { id },
    },
  } = weather;

  const Effect = weatherIdMap[id];

  return Effect ? (
    <EffectContainer>
      <Effect windSpeed={weather.current.windSpeed} />
    </EffectContainer>
  ) : null;
};

WeatherEffect.propTypes = {
  weather: PropTypes.shape({
    current: PropTypes.shape({
      weather: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

WeatherEffect.fragments = {
  weather: getWeatherEffect,
};

export default withFragment(WeatherEffect);
