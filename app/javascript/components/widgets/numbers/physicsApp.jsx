import React from 'react';
import RAPIER from '@dimforge/rapier2d-compat';
import * as PIXI from 'pixi.js';
import runSimulation from './rapierPixi';

export default function PhysicsApp(eventCount) {
  const Appwidth = 1100;
  const Appheight = 600;
  const ref = React.useRef(null);
  React.useEffect(() => {
    const app = new PIXI.Application({
      width: Appwidth,
      height: Appheight,
      view: ref.current,
    });
    RAPIER.init().then(() =>
      runSimulation(app, eventCount, Appwidth, Appheight),
    );
    return () => {
      app.destroy(true, true);
    };
  }, []);
  return (
    <div className="App">
      <canvas ref={ref}>render into</canvas>
    </div>
  );
}
