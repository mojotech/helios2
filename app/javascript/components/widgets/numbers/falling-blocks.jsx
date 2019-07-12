import React from 'react';
import {
  Engine,
  Render,
  World,
  Bodies,
  Composite,
  Events,
  Body,
  Sleeping,
} from 'matter-js';
import { graphql, withApollo } from 'react-apollo';
import { pathOr, keys, compose } from 'ramda';
import Resurrect from 'resurrect-js';
import PropTypes from 'prop-types';
import { getEventCounts } from '@numbers/queries';
import githubPull from '@images/pr.png';
import githubCommit from '@images/commit.png';
import slackMessage from '@images/slack.png';
import { getStartOfWeek } from '@lib/datetime';
import { withLocalMutation, withLocalState } from '@numbers/ducks';
import { width } from '@components/side-panel';

const blockTypes = { githubPull, githubCommit, slackMessage };
const wallWidth = 50;
// Padding applied to the height of the walls to prevent blocks created contemporaneously from colliding.
const padding = 50;

// This is an increase from 0.08 to allow the blocks to go to sleep easier. At 0.08 the blocks would have a tendency to get stuck
// and not go to sleep especially at lower framerates, where the quality of the simulation drops. Making sure that all the blocks
// go to sleep is imperitive to a good framerate, so this is set high to reduce the possibility of the blocks getting stuck as much as possible.
// eslint-disable-next-line no-underscore-dangle
Sleeping._motionSleepThreshold = 0.5;

const setInvisible = body => {
  if (body.render.visible) {
    // eslint-disable-next-line no-param-reassign
    body.render.visible = false;
  }
};

const setStatic = body => {
  if (!body.isStatic) {
    Body.setStatic(body, true);
  }
};
const imageCache = {};

const getImageFromCache = imagePath => {
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }
  const image = new Image();
  imageCache[imagePath] = image;
  image.src = imagePath;

  return image;
};

class Scene extends React.Component {
  static propTypes = {
    mutation: PropTypes.func.isRequired,
  };

  imageCache = {};

  constructor(props) {
    super(props);
    const { world, ...currentState } = this.getLocalState(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      ...currentState,
    };
    this.scene = React.createRef();
    this.overlay = React.createRef();
    this.timer = null;
    this.res = new Resurrect({ prefix: '$', cleanup: true });
  }

  componentDidMount() {
    this.setupWorld();
    const { world } = this.getLocalState(this.props);
    if (world) {
      const loadedWorld = this.res.resurrect(world);
      const counts = this.getCountsFromProps(this.props);

      if (
        this.state.githubCommit <= counts.githubCommit &&
        this.state.githubPull <= counts.githubPull &&
        this.state.slackMessage <= counts.slackMessage
      ) {
        Engine.merge(this.engine, { world: loadedWorld });
      } else {
        this.setState({ githubCommit: 0, githubPull: 0, slackMessage: 0 });
      }
    }
    Composite.allBodies(this.engine.world)
      .filter(body => !body.isStatic)
      .forEach(block => this.sleepStartEvent(block));
    this.prepareOverlay();
    this.addBlocks();
  }

  componentWillUnmount() {
    const allBodies = Composite.allBodies(this.engine.world);
    allBodies
      .filter(body => body.isOnOverlay)
      .forEach(body => {
        // eslint-disable-next-line no-param-reassign
        body.isOnOverlay = false;
        return body.isOnOverlay;
      });

    clearTimeout(this.timer);
    this.save();
    if (this.engine.world) {
      Composite.clear(this.engine.world);
    }
  }

  /**
   * Setup World
   *
   * Mostly this is matter js boilerplate, setting up and configuring
   * the matter js engine, renderer, and world.  Setting up the world
   * also involves building some static objects that represent the walls
   * around the space we're using to catch the blocks in a bucket.
   */

  setupWorld() {
    this.engine = Engine.create({
      enableSleeping: true,
    });

    this.renderMatter = Render.create({
      element: this.scene.current,
      engine: this.engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        showSleeping: false,
      },
    });

    this.engine.world.gravity.y = 0.5;
    World.add(this.engine.world, [
      /**
       * In matter-js, rectangles are placed centered at the position specified,
       * and expand in height/width evenly around that point
       */

      Bodies.rectangle(
        this.state.width / 2,
        this.state.height - wallWidth / 2,
        this.state.width,
        wallWidth,
        {
          isStatic: true,
          render: {
            fillStyle: 'black',
          },
        },
      ),
      Bodies.rectangle(
        wallWidth / 2,
        this.state.height / 2,
        wallWidth,
        this.state.height + padding,
        {
          isStatic: true,
          render: {
            fillStyle: 'black',
          },
        },
      ),
      Bodies.rectangle(
        this.state.width - wallWidth / 2 - width,
        this.state.height / 2,
        wallWidth,
        this.state.height + padding,
        {
          isStatic: true,
          render: {
            fillStyle: 'black',
          },
        },
      ),
    ]);

    Engine.run(this.engine);

    Render.run(this.renderMatter);
  }

  getInitialCounts = () => ({
    githubPull: 0,
    githubCommit: 0,
    slackMessage: 0,
  });

  getLocalState = pathOr(this.getInitialCounts(), ['localState']);

  getCountsFromProps = pathOr(this.getInitialCounts(), [
    'data',
    'events',
    'count',
  ]);

  sleepStartEvent = block => {
    Events.on(block, 'sleepStart', () => {
      setInvisible(block);
      setStatic(block);
      this.addToOverlay(block);
      Events.off(block, 'sleepStart');
    });
  };

  nextBlock = () => {
    const counts = this.getCountsFromProps(this.props);
    const blockKeys = keys(blockTypes).filter(
      key => counts[key] - this.state[key] > 0,
    );
    return blockKeys[Math.floor(Math.random() * blockKeys.length)];
  };

  addBlocks = () => {
    const block = this.nextBlock();
    const widthBetweenWalls = this.state.width - wallWidth - width;
    const randomDist =
      (widthBetweenWalls * (Math.random() + Math.random())) / 2;
    // add circles to the world,
    // randomly pick a point from one wall edge to the other
    // so that they don't fall directly on top of each other.
    if (block) {
      const newBlock = Bodies.polygon(randomDist, -10, 8, 8, {
        restitution: 0.25,
        friction: 0.8,
        render: {
          sprite: {
            texture: blockTypes[block],
          },
        },
      });

      this.setState(state => ({ [block]: state[block] + 1 }));

      World.add(this.engine.world, newBlock);

      this.sleepStartEvent(newBlock);
    }
    this.timer = setTimeout(this.addBlocks, 200);
  };

  addToOverlay(body) {
    if (!body || !body.render.sprite.texture || body.isOnOverlay) {
      return;
    }
    const ctx = this.overlay.current.getContext('2d');
    const { texture, xOffset, yOffset } = body.render.sprite;
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);

    const img = getImageFromCache(texture);
    ctx.drawImage(img, img.width * -xOffset, img.height * -yOffset);

    ctx.rotate(-body.angle);
    ctx.translate(-body.position.x, -body.position.y);
    // eslint-disable-next-line no-param-reassign
    body.isOnOverlay = true;
  }

  prepareOverlay() {
    const allBodies = Composite.allBodies(this.engine.world);
    allBodies
      .filter(body => body.isStatic)
      .forEach(body => this.addToOverlay(body));
  }

  save() {
    // eslint-disable-next-line no-shadow
    const { githubPull, githubCommit, slackMessage } = this.state;
    this.props.mutation({
      githubPull,
      githubCommit,
      slackMessage,
      world: this.serialise(this.engine.world),
    });
  }

  serialise(object) {
    return this.res.stringify(object, (key, value) => {
      // serialise fails if it attempts to work on an event, so we need to avoid them
      if (key === 'events') {
        return null;
      }
      // limit precision of floats
      if (!/^#/.exec(key) && typeof value === 'number') {
        const fixed = parseFloat(value.toFixed(3));

        if (fixed === 0 && value !== 0) return value;

        return fixed;
      }
      return value;
    });
  }

  render() {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
          }}
          ref={this.scene}
        />
        <canvas
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
          }}
          ref={this.overlay}
        />
      </>
    );
  }
}

export default compose(
  withApollo,
  graphql(getEventCounts, {
    options: { variables: { after: getStartOfWeek() } },
  }),
  withLocalState,
  withLocalMutation,
)(Scene);
