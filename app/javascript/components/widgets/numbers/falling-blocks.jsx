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
  Runner,
} from 'matter-js';
import { graphql, withApollo } from 'react-apollo';
import { countBy, pathOr, keys, compose } from 'ramda';
import PropTypes from 'prop-types';
import { getEventCounts } from '@numbers/queries';
import githubPullIcon from '@images/pr.png';
import githubCommitIcon from '@images/commit.png';
import slackMessageIcon from '@images/slack.png';
import { getStartOfWeek } from '@lib/datetime';
import { withLocalMutation, withLocalState } from '@numbers/ducks';
import { sidePanelWidth } from '@lib/theme';
import { isPresent } from '@lib/util';

const blockTypes = {
  githubPull: githubPullIcon,
  githubCommit: githubCommitIcon,
  slackMessage: slackMessageIcon,
};

const blockTypeKeyFromValue = value =>
  keys(blockTypes).find(key => blockTypes[key] === value);

const createFallingBlock = (x, y, blockType, options = {}) =>
  Bodies.polygon(x, y, 8, 8, {
    restitution: 0.25,
    friction: 0.8,
    render: {
      sprite: {
        texture: blockTypes[blockType],
      },
    },
    ...options,
  });

const countByBlockType = countBy(body => body[0]);

const serializeFallingBlock = ({
  angle,
  angularSpeed,
  angularVelocity,
  isSleeping,
  isStatic,
  position,
  render,
  sleepCounter,
  visible,
  velocity,
}) => [
  blockTypeKeyFromValue(render.sprite.texture),
  angle,
  angularSpeed,
  angularVelocity,
  isSleeping,
  isStatic,
  position,
  sleepCounter,
  visible,
  velocity,
];

const deserializeFallingBlock = ([
  blockType,
  angle,
  angularSpeed,
  angularVelocity,
  isSleeping,
  isStatic,
  position,
  sleepCounter,
  visible,
  velocity,
]) =>
  createFallingBlock(position.x, position.y, blockType, {
    angle,
    angularSpeed,
    angularVelocity,
    isSleeping,
    isStatic,
    sleepCounter,
    visible,
    velocity,
  });

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
  const image = imageCache[imagePath] || new Image();
  image.src = imagePath;
  imageCache[imagePath] = image;

  if (image.width === 0) {
    return new Promise((resolve, reject) => {
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', () => reject(image));
    });
  }

  return Promise.resolve(image);
};

class Scene extends React.Component {
  static propTypes = {
    mutation: PropTypes.func.isRequired,
    world: PropTypes.arrayOf(PropTypes.array),
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    world: null,
  };

  imageCache = {};

  constructor(props) {
    super(props);
    this.state = {
      githubPull: 0,
      githubCommit: 0,
      slackMessage: 0,
    };
    this.scene = React.createRef();
    this.overlay = React.createRef();
    this.timer = null;
  }

  componentDidMount() {
    const { world } = this.props;
    this.setupWorld();
    if (isPresent(world)) {
      this.restoreWorld(world);
    }
    Composite.allBodies(this.engine.world)
      .filter(body => !body.isStatic)
      .forEach(block => this.sleepStartEvent(block));
    this.prepareOverlay();
    this.addBlocks();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.saveWorld();
    this.teardownWorld();
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

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderMatter = Render.create({
      element: this.scene.current,
      engine: this.engine,
      options: {
        width,
        height,
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

      Bodies.rectangle(width / 2, height - wallWidth / 2, width, wallWidth, {
        isStatic: true,
        render: {
          fillStyle: 'black',
        },
      }),
      Bodies.rectangle(wallWidth / 2, height / 2, wallWidth, height + padding, {
        isStatic: true,
        render: {
          fillStyle: 'black',
        },
      }),
      Bodies.rectangle(
        width - wallWidth / 2 - sidePanelWidth,
        height / 2,
        wallWidth,
        height + padding,
        {
          isStatic: true,
          render: {
            fillStyle: 'black',
          },
        },
      ),
    ]);

    this.runner = Engine.run(this.engine);

    Render.run(this.renderMatter);
  }

  getCountsFromProps = pathOr(
    {
      githubPull: 0,
      githubCommit: 0,
      slackMessage: 0,
    },
    ['data', 'events', 'count'],
  );

  restoreWorld = world => {
    const worldCounts = countByBlockType(world);
    const counts = this.getCountsFromProps(this.props);
    const {
      data: { loading },
    } = this.props;

    if (loading) {
      return;
    }

    if (
      worldCounts.githubCommit <= counts.githubCommit &&
      worldCounts.githubPull <= counts.githubPull &&
      worldCounts.slackMessage <= counts.slackMessage
    ) {
      World.add(this.engine.world, world.map(deserializeFallingBlock));
      this.setState(worldCounts);
    } else {
      this.setState({ githubCommit: 0, githubPull: 0, slackMessage: 0 });
    }
  };

  saveWorld = () => {
    const world = Composite.allBodies(this.engine.world)
      .filter(({ render }) =>
        blockTypeKeyFromValue(pathOr(false, ['sprite', 'texture'], render)),
      )
      .map(serializeFallingBlock);

    this.props.mutation({ world });
  };

  teardownWorld = () => {
    Render.stop(this.renderMatter);
    Runner.stop(this.runner);
    Engine.clear(this.engine);
    this.renderMatter = null;
    this.runner = null;
    this.enginer = null;
  };

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
    const {
      data: { loading },
    } = this.props;

    if (loading) {
      this.timer = setTimeout(this.addBlocks, 200);
      return;
    }

    const block = this.nextBlock();
    const width = window.innerWidth;
    const widthBetweenWalls = width - wallWidth - sidePanelWidth;
    const randomDist =
      (widthBetweenWalls * (Math.random() + Math.random())) / 2;
    // add circles to the world,
    // randomly pick a point from one wall edge to the other
    // so that they don't fall directly on top of each other.
    if (block) {
      const newBlock = createFallingBlock(randomDist, -10, block);

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
    const { texture, xOffset, yOffset } = body.render.sprite;
    getImageFromCache(texture)
      .then(img => {
        const ctx = this.overlay.current.getContext('2d');

        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        ctx.drawImage(img, img.width * -xOffset, img.height * -yOffset);

        ctx.rotate(-body.angle);
        ctx.translate(-body.position.x, -body.position.y);
      })
      .catch(img => {
        // eslint-disable-next-line no-console
        console.error(`Failed loading ${img.src}`);
      });

    // eslint-disable-next-line no-param-reassign
    body.isOnOverlay = true;
  }

  prepareOverlay() {
    const allBodies = Composite.allBodies(this.engine.world);
    allBodies
      .filter(body => body.isStatic)
      .forEach(body => this.addToOverlay(body));
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
