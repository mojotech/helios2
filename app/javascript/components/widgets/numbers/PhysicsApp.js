import React from 'react';
import RAPIER from '@dimforge/rapier2d-compat';
import * as PIXI from 'pixi.js';
import run_simulation from './pixi';

export default function PhysicsApp() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const app = new PIXI.Application({
      width: 1000,
      height: 800,
      view: ref.current,
    });
    RAPIER.init().then(() => run_simulation(app));
  }, []);
  return (
    <div className="App">
      <canvas ref={ref}>render into</canvas>
    </div>
  );
}
