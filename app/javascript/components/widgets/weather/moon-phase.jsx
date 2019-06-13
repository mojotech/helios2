import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../../lib/theme';

const iconRender = (posX, posY, radius, phase) => {
  const shouldHideFront =
    phase === 'newMoon' || phase === 'fullMoon' ? 'hidden' : 'visible';
  const getBackEleFill =
    phase.includes('Cres') || phase === 'fullMoon'
      ? colors.white
      : colors.black;

  const getFrontEleFill =
    phase.includes('Gib') || phase.includes('Quart')
      ? colors.white
      : colors.black;
  const useMask = !phase.includes('Quart');
  return (
    <g>
      <circle
        cx={posX}
        cy={posY}
        r={radius}
        fill={getBackEleFill}
        filter="url(#moonShadow)"
      />
      <circle
        cx={posX}
        cy={posY}
        r={radius}
        fill={getFrontEleFill}
        stroke={phase.includes('Cres') ? colors.black : undefined}
        clipPath={useMask ? undefined : `url(#${phase})`}
        mask={useMask ? `url(#${phase})` : undefined}
        visibility={shouldHideFront}
      />
    </g>
  );
};

const MoonPhase = ({ posX, posY, radius, phase }) => (
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
      <mask id="waxCres">
        <circle cx={posX - 5} cy={posY} r={radius} fill={colors.white} />
      </mask>
      <clipPath id="firstQuart" clipPathUnits="objectBoundingBox">
        <rect x="0.5" y="0" width="0.5" height="1" />
      </clipPath>
      <mask id="waxGib">
        <circle cx={posX + 7} cy={posY} r={radius} fill={colors.white} />
      </mask>
      <mask id="wanGib">
        <circle cx={posX - 7} cy={posY} r={radius} fill={colors.white} />
      </mask>
      <clipPath id="thirdQuart" clipPathUnits="objectBoundingBox">
        <rect x="0" y="0" width="0.5" height="1" />
      </clipPath>
      <mask id="wanCres">
        <circle cx={posX + 5} cy={posY} r={radius} fill={colors.white} />
      </mask>
    </defs>
    {iconRender(posX, posY, radius, phase)}
  </g>
);

MoonPhase.propTypes = {
  posX: PropTypes.number.isRequired,
  posY: PropTypes.string.isRequired,
  radius: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
};

export default MoonPhase;
