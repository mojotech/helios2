import React from 'react';
import { Engine, Render, World, Bodies, Composite, Sleeping } from 'matter-js';
import { graphql, withApollo } from 'react-apollo';
import { pathOr, keys, compose } from 'ramda';
import Resurrect from 'resurrect-js';
import PropTypes from 'prop-types';
import { getEventCounts } from '@numbers/queries';
import githubPull from '@images/pr.png';
import githubCommit from '@images/commit.png';
import slackMessage from '@images/slack.png';
import { getStartOfWeek } from '@lib/datetime';
import freezeOnSleep from '@numbers/sleeping-blocks';
import { withLocalMutation, withLocalState } from '@numbers/ducks';

const blockTypes = { githubPull, githubCommit, slackMessage };
const wallWidth = 50;

// Padding applied to the height of the walls to prevent blocks created contemporaneously from colliding.
const padding = 50;

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
    Sleeping.update = freezeOnSleep(b => this.addToOverlay(b));
    this.timer = null;
    this.res = new Resurrect({ prefix: '$', cleanup: true });
  }

  componentDidMount() {
    this.setupWorld();
    const { world } = this.getLocalState(this.props);
    if (world) {
      const loadedWorld = this.res.resurrect(world);
      Engine.merge(this.engine, { world: loadedWorld });
    }
    Composite.allBodies(this.engine.world)
      .filter(body => body.isStatic && body.render.sprite.texture)
      .map(b => this.addToOverlay(b));
    this.addBlocks();
  }

  componentWillUnmount() {
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
        this.state.width - wallWidth / 2,
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

  getTexture(imagePath) {
    let image = this.imageCache[imagePath];

    if (image) {
      return image;
    }
    image = new Image();
    this.imageCache[imagePath] = image;
    image.src = imagePath;

    return image;
  }

  addToOverlay = body => {
    if (!body || !body.render.sprite.texture) {
      return;
    }
    const ctx = this.overlay.current.getContext('2d');
    const { texture } = body.render.sprite;
    const { sprite } = body.render;
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);

    const img = this.getTexture(texture);
    ctx.drawImage(
      img,
      img.width * -sprite.xOffset,
      img.height * -sprite.yOffset,
    );

    ctx.rotate(-body.angle);
    ctx.translate(-body.position.x, -body.position.y);
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
    const randomPositionBetweenWalls =
      (this.state.width - wallWidth) * Math.random() + wallWidth;
    // add circles to the world,
    // randomly pick a point from one wall edge to the other
    // so that they don't fall directly on top of each other.
    if (block) {
      this.setState(state => ({ [block]: state[block] + 1 }));
      World.add(
        this.engine.world,
        // eslint-disable-next-line prettier/prettier
        Bodies.polygon(randomPositionBetweenWalls, -10, 8, 8, {
          restitution: 0.25,
          friction: 0.8,
          render: {
            sprite: {
              texture: blockTypes[block],
            },
          },
        }),
      );
    }
    this.timer = setTimeout(this.addBlocks, 200);
  };

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
      <React.Fragment>
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
      </React.Fragment>
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
