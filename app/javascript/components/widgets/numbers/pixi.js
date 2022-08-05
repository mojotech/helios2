import * as PIXI from 'pixi.js';
import RAPIER from '@dimforge/rapier2d-compat';
import githubPullIcon from '@images/pr.png';
import githubCommitIcon from '@images/commit.png';
import slackMessageIcon from '@images/slack.png';

export default function run_simulation(app) {
  const windowSizeX = 1000;
  const windowSizeY = 800;
  const border = 100;

  //Rapier world settings
  const scaleFactor = 25;
  let gravity = new RAPIER.Vector2(0.0, -9.81 * scaleFactor); //Band-aid solution for slow gravity bug
  let world = new RAPIER.World(gravity);

  const sprites = [];

  //Rapier ground block (static)
  let groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    0,
    -windowSizeY + border,
  );
  let groundBody = world.createRigidBody(groundBodyDesc);
  let groundColliderDesc = RAPIER.ColliderDesc.cuboid(windowSizeX, 10);
  world.createCollider(groundColliderDesc, groundBody);

  //Rapier left wall block (static)
  let leftWallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    -border,
    0,
  );
  let leftWallBody = world.createRigidBody(leftWallBodyDesc);
  let leftWallColliderDesc = RAPIER.ColliderDesc.cuboid(10, windowSizeY);
  world.createCollider(leftWallColliderDesc, leftWallBody);

  //Rapier right wall block (static)
  let rightWallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    windowSizeX - border,
    0,
  );
  let rightWallBody = world.createRigidBody(rightWallBodyDesc);
  let rightWallColliderDesc = RAPIER.ColliderDesc.cuboid(10, windowSizeY);
  world.createCollider(rightWallColliderDesc, rightWallBody);

  // The numbodies can be as high as 6000 and still be good performance wise
  let num = 7;
  let numy = 100;
  let numBodies = num * numy;
  let rad = 8.0;

  let shift = rad * 1.5 + rad;
  let centerx = shift * (num / 2) - 400;
  let centery = shift / 2.0;

  let i, j;

  //Rapier falling cubes (dynamic)
  for (j = 0; j < numy; ++j) {
    for (i = 0; i < num; ++i) {
      let x = i * shift - centerx + Math.random();
      let y = j * shift + centery + 3.0;
      let bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
      let body = world.createRigidBody(bodyDesc);
      let colliderDesc = RAPIER.ColliderDesc.ball(rad);
      world.createCollider(colliderDesc, body);

      let rand = Math.floor(Math.random() * 3);
      let img = githubPullIcon;
      switch (rand) {
        case 0: {
          img = githubPullIcon;
          break;
        }

        case 1: {
          img = githubCommitIcon;
          break;
        }

        default: {
          img = slackMessageIcon;
          break;
        }
      }
      let curr = PIXI.Sprite.from(img);
      sprites.push(curr);
    }
  }

  // Create the cursor object
  let goal = null;
  const direction = { x: 0, y: 0 };
  const cursorBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.newDynamic().setTranslation(0, 0),
  );
  let cursorColliderDesc = new RAPIER.ColliderDesc(
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

  let graphic = new PIXI.Graphics();
  app.stage.addChild(graphic);

  sprites.forEach((el) => {
    app.stage.addChild(el);
  });

  const ColliderMap = new Map();

  //Loop through rapier coliders and create set key value pair for each in ColliderMap
  function addCollider(RAPIER, world, collider) {
    let type = 'UNKNOWN';
    let rad = 0;
    let sizeX = 0;
    let sizeY = 0;

    switch (collider.shapeType()) {
      case RAPIER.ShapeType.Cuboid:
        type = 'CUBE';
        let hext = collider.halfExtents();
        sizeX = hext.x;
        sizeY = hext.y;
        break;
      case RAPIER.ShapeType.Ball:
        type = 'BALL';
        rad = collider.radius();
        break;
      default:
        console.log('Unknown shape to render.');
        break;
    }
    let t = collider.translation();
    let r = collider.rotation();
    const shape = {};
    shape.type = type;
    shape.xLoc = t.x;
    shape.yLoc = t.y;
    shape.rotation = -r.angle;
    shape.rSize = rad;
    shape.xSize = sizeX;
    shape.ySize = sizeY;
    ColliderMap.set(collider.handle, shape);
  }

  //Render each object in ColliderMap in PixiJS graphics
  function render(world, ColliderMap) {
    let cntr = 0;
    ColliderMap.forEach((el) => {
      //console.log(el);
      3;
      if (el.type === 'BALL') {
        graphic.beginFill(0x0000ff);
        let curr = sprites[cntr];
        console.log(curr);
        cntr = (cntr + 1) % numBodies;
        curr.position.x = el.xLoc + 100;
        curr.position.y = -el.yLoc + 100;
        curr.rotation = el.rotation;
        curr.pivot.set(curr.width / 2, curr.height / 2);
      }
    });
  }

  //Update ColliderMap positions called each step
  function updatePositions(world) {
    // If our cursor has been on the page, then goal exists
    if (goal) {
      const cursorPosition = cursorBody.translation();
      const cursorDistFromGoal = Math.sqrt(
        (cursorPosition.x - goal.x) ** 2 + (cursorPosition.y - goal.y) ** 2,
      );
      if (cursorDistFromGoal < 10) {
        // We've arrived at our goal
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
      let CMapHandle = ColliderMap.get(elt.handle);
      let translation = elt.translation();
      let rotation = elt.rotation();
      if (!!CMapHandle) {
        CMapHandle.xLoc = translation.x;
        CMapHandle.yLoc = translation.y;
        CMapHandle.rotation = -rotation;
      }
    });
  }

  //Game loop
  function update() {
    graphic.clear();
    render(world, ColliderMap);
    updatePositions(world, ColliderMap);
    world.step();
    requestAnimationFrame(update);
  }

  world.forEachCollider((coll) => {
    addCollider(RAPIER, world, coll);
  });
  requestAnimationFrame(update);
}
