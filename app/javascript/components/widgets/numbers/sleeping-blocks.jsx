/*
The MIT License (MIT)

Copyright (c) Liam Brummitt and contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
import { Sleeping, Body } from 'matter-js';
// eslint-disable-next-line no-underscore-dangle
Sleeping._motionSleepThreshold = 0.5;

// Taken from Sleeping.js which is a part of Matter.js
// https://github.com/liabru/matter-js/blob/2ec247b7af1c6b5da6ee05c73274ed5822c73503/src/core/Sleeping.js#L25
Sleeping.update = function freezeOnSleep(bodies, timeScale) {
  const timeFactor = timeScale * timeScale * timeScale;

  // update bodies sleeping status
  for (let i = 0; i < bodies.length; i += 1) {
    const body = bodies[i];
    const motion =
      body.speed * body.speed + body.angularSpeed * body.angularSpeed;

    // wake up bodies if they have a force applied
    if (body.force.x !== 0 || body.force.y !== 0) {
      Sleeping.set(body, false);
    } else {
      const minMotion = Math.min(body.motion, motion);
      const maxMotion = Math.max(body.motion, motion);

      // biased average motion estimation between frames
      body.motion =
        // eslint-disable-next-line no-underscore-dangle
        Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;

      if (
        body.sleepThreshold > 0 &&
        // eslint-disable-next-line no-underscore-dangle
        body.motion < Sleeping._motionSleepThreshold * timeFactor
      ) {
        body.sleepCounter += 1;

        if (body.sleepCounter >= body.sleepThreshold) {
          // Bodies here set to static instead of being put to sleep
          Body.setStatic(body, true);
        }
      } else if (body.sleepCounter > 0) {
        body.sleepCounter -= 1;
      }
    }
  }
};
