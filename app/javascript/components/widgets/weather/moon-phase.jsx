import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '@lib/theme';

const getRearPath = (radius, phase, radiusModifier1) => {
  const diameter = radius * 2;
  let path = [``];
  switch (phase) {
    case 'newMoon':
    case 'fullMoon':
      path = [``];
      break;
    case 'waxCres':
    case 'wanGib':
    case 'firstQuart':
    case 'thirdQuart':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,1 0 ${diameter - radius}`,
      ];
      break;
    case 'waxGib':
    case 'wanCres':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,0 0 ${diameter - radius}`,
      ];
      break;
    default:
      path = [``];
  }
  return path.join(' ');
};

const getFrontPath = (radius, phase, radiusModifier1, radiusModifier2) => {
  const diameter = radius * 2;
  let path = [``];
  switch (phase) {
    case 'newMoon':
    case 'fullMoon':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,0 0 ${diameter - radius}`,
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,1 0 ${diameter - radius}`,
      ];
      break;
    case 'waxCres':
    case 'wanGib':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,0 0 ${diameter - radius}`,
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier2} ${diameter * radiusModifier1}
          0 0,1 0 ${diameter - radius}`,
      ];
      break;
    case 'firstQuart':
    case 'thirdQuart':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,0 0 ${diameter - radius}`,
      ];
      break;
    case 'waxGib':
    case 'wanCres':
      path = [
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier1} ${diameter * radiusModifier1}
          0 0,1 0 ${diameter - radius}`,
        `M 0 -${radius}`,
        `A ${diameter * radiusModifier2} ${diameter * radiusModifier1}
          0 0,0 0 ${diameter - radius}`,
      ];
      break;
    default:
      path = [``];
      break;
  }
  return path.join(' ');
};

const iconRender = (posX, posY, radius, phase, arcPath, arcAnimation) => {
  const radiusInt = parseInt(radius, 10);
  const radiusModifier1 = 0.4;
  const radiusModifier2 = 0.15;
  const rearMoonPath = getRearPath(
    radiusInt,
    phase,
    radiusModifier1,
    radiusModifier2,
  );
  const frontMoonPath = getFrontPath(
    radiusInt,
    phase,
    radiusModifier1,
    radiusModifier2,
  );
  const rearMoonColor = phase.match(/^(newMoon|waxCres|firstQuart|wanCres)$/)
    ? colors.white
    : colors.black;
  const frontMoonColor =
    rearMoonColor === colors.white ? colors.black : colors.white;
  return (
    <g>
      <path
        d={rearMoonPath}
        fill={rearMoonColor}
        filter="url(#moonShadow)"
        style={{
          offsetPath: `path('${arcPath}')`,
          animation: `${arcAnimation} 1000ms 1 normal forwards ease-in-out`,
        }}
      />
      <path
        d={frontMoonPath}
        fill={frontMoonColor}
        filter="url(#moonShadow)"
        style={{
          offsetPath: `path('${arcPath}')`,
          animation: `${arcAnimation} 1000ms 1 normal forwards ease-in-out`,
        }}
      />
    </g>
  );
};

const MoonPhase = ({ posX, posY, radius, phase, arcPath, arcAnimation }) => (
  <g>
    <defs>
      <filter id="moonShadow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="0" result="offsetblur" />
        <feFlood floodColor="#ffffff" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {iconRender(posX, posY, radius, phase, arcPath, arcAnimation)}
  </g>
);

MoonPhase.propTypes = {
  posX: PropTypes.number.isRequired,
  posY: PropTypes.string.isRequired,
  radius: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  arcPath: PropTypes.string.isRequired,
  arcAnimation: PropTypes.string.isRequired,
};

export default MoonPhase;
