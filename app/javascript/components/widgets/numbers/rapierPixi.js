import * as PIXI from 'pixi.js';
import RAPIER from '@dimforge/rapier2d-compat';
import githubPullIcon from '@images/pr.png';
import githubCommitIcon from '@images/commit.png';
import slackMessageIcon from '@images/slack.png';

export default function runSimulation(
  app,
  eventData,
  windowSizeX,
  windowSizeY,
) {
  const border = 100;

  // Rapier world settings
  const scaleFactor = 25;
  const gravity = new RAPIER.Vector2(0.0, -9.81 * scaleFactor);
  const world = new RAPIER.World(gravity);

  const sprites = [];

  // Rapier ground block (static)
  const groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    0,
    -windowSizeY + border,
  );
  const groundBody = world.createRigidBody(groundBodyDesc);
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(windowSizeX, 10);
  world.createCollider(groundColliderDesc, groundBody);

  // Rapier left wall block (static)
  const leftWallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    -border,
    0,
  );
  const leftWallBody = world.createRigidBody(leftWallBodyDesc);
  const leftWallColliderDesc = RAPIER.ColliderDesc.cuboid(10, windowSizeY);
  world.createCollider(leftWallColliderDesc, leftWallBody);

  // Rapier right wall block (static)
  const rightWallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    windowSizeX - border,
    0,
  );
  const rightWallBody = world.createRigidBody(rightWallBodyDesc);
  const rightWallColliderDesc = RAPIER.ColliderDesc.cuboid(10, windowSizeY);
  world.createCollider(rightWallColliderDesc, rightWallBody);

  let githubPullCount = eventData.eventCount.githubPull;
  let githubCommitCount = eventData.eventCount.githubCommit;
  let slackMessageCount = eventData.eventCount.slackMessage;

  function randomValidEvent() {
    const result = [];
    if (githubPullCount > 0) {
      result.push(githubPullIcon);
    }
    if (githubCommitCount > 0) {
      result.push(githubCommitIcon);
    }
    if (slackMessageCount > 0) {
      result.push(slackMessageIcon);
    }
    if (result.length === 0) {
      return null;
    }
    const rand = Math.floor(Math.random() * result.length);
    return result[rand];
  }

  const numBodies = githubPullCount + githubCommitCount + slackMessageCount;
  const rad = 8.0;

  const shift = rad * 1.5 + rad;
  const centerx = shift / 2 - 400;
  const centery = shift / 2.0;

  let j;

  // Rapier falling cubes (dynamic)
  for (j = 0; j < numBodies; j += 1) {
    const x = 0 * shift - centerx + (Math.random() * 400 - 200);
    const y = j * shift + centery + 3.0;
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
    const body = world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.ball(rad);
    world.createCollider(colliderDesc, body);

    const img = randomValidEvent();

    switch (img) {
      case githubPullIcon: {
        githubPullCount -= 1;
        break;
      }
      case githubCommitIcon: {
        githubCommitCount -= 1;
        break;
      }
      case slackMessageIcon: {
        slackMessageCount -= 1;
        break;
      }
      default: {
        // undefined image returned
        break;
      }
    }

    const curr = PIXI.Sprite.from(img);
    sprites.push(curr);
  }

  // Create the cursor object
  let goal = null;
  const direction = { x: 0, y: 0 };
  const cursorBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.newDynamic().setTranslation(0, 0),
  );
  const cursorColliderDesc = new RAPIER.ColliderDesc(
    new RAPIER.Cuboid(30, 30),
  ).setTranslation(0, 0);
  const cursorCollider = world.createCollider(cursorColliderDesc, cursorBody);

  document.addEventListener('mousemove', (e) => {
    const { offsetX, offsetY } = e;
    goal = {
      x: offsetX - 100,
      y: -offsetY + 100,
    };
  });

  const graphic = new PIXI.Graphics();
  app.stage.addChild(graphic);

  sprites.forEach((el) => {
    app.stage.addChild(el);
  });

  const ColliderMap = new Map();

  // Loop through rapier coliders and create set key value pair for each in ColliderMap
  function addCollider(collider) {
    let type = 'UNKNOWN';
    let radius = 0;
    let sizeX = 0;
    let sizeY = 0;

    switch (collider.shapeType()) {
      case RAPIER.ShapeType.Cuboid: {
        type = 'CUBE';
        const hext = collider.halfExtents();
        sizeX = hext.x;
        sizeY = hext.y;
        break;
      }
      case RAPIER.ShapeType.Ball: {
        type = 'BALL';
        radius = collider.radius();
        break;
      }
      default: {
        // Shape not implemented
        break;
      }
    }
    const t = collider.translation();
    const r = collider.rotation();
    const shape = {};
    shape.type = type;
    shape.xLoc = t.x;
    shape.yLoc = t.y;
    shape.rotation = -r.angle;
    shape.rSize = radius;
    shape.xSize = sizeX;
    shape.ySize = sizeY;
    ColliderMap.set(collider.handle, shape);
  }

  // Render each object in ColliderMap in PixiJS graphics
  function render() {
    let cntr = 0;
    ColliderMap.forEach((el) => {
      if (el.type === 'BALL') {
        graphic.beginFill(0x0000ff);
        const curr = sprites[cntr];
        cntr = (cntr + 1) % numBodies;
        curr.position.x = el.xLoc + 100;
        curr.position.y = -el.yLoc + 100;
        curr.rotation = el.rotation;
        curr.pivot.set(curr.width / 2, curr.height / 2);
      }
    });
  }

  // Update ColliderMap positions called each step
  function updatePositions() {
    // If our cursor has been on the page, then goal exists
    if (goal) {
      const cursorPosition = cursorBody.translation();
      const cursorDistFromGoal = Math.sqrt(
        (cursorPosition.x - goal.x) ** 2 + (cursorPosition.y - goal.y) ** 2,
      );
      if (cursorDistFromGoal < 10) {
        cursorBody.setTranslation(goal, true);
        direction.x = 0;
        direction.y = 0;
        goal = undefined;
      } else {
        // Move towards the goal
        const x = goal.x - cursorPosition.x - 10;
        const y = goal.y - cursorPosition.y + 10;
        const div = Math.max(Math.abs(x), Math.abs(y));
        direction.x = x / div;
        direction.y = y / div;
      }
    }

    cursorBody.setLinvel(
      { x: direction.x * 1000, y: direction.y * 1000 },
      true,
    );
    cursorCollider.setActiveHooks(RAPIER.ActiveHooks.FILTER_CONTACT_PAIRS);

    world.forEachCollider((elt) => {
      const CMapHandle = ColliderMap.get(elt.handle);
      const translation = elt.translation();
      const rotation = elt.rotation();
      if (CMapHandle) {
        CMapHandle.xLoc = translation.x;
        CMapHandle.yLoc = translation.y;
        CMapHandle.rotation = -rotation;
      }
    });
  }

  function update() {
    graphic.clear();
    render();
    updatePositions();
    world.step();
    requestAnimationFrame(update);
  }

  world.forEachCollider((coll) => {
    addCollider(coll);
  });
  requestAnimationFrame(update);
}
