import React from 'react';
import { Engine, Render, World, Bodies } from 'matter-js';
import { graphql } from 'react-apollo';
import { pathOr, keys, compose } from 'ramda';
import { getEventCounts } from './queries';
import githubPull from '../../../../assets/images/pr.png';
import githubCommit from '../../../../assets/images/commit.png';
import slackMessage from '../../../../assets/images/slack.png';

const blockTypes = { githubPull, githubCommit, slackMessage };

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      ...this.getInitialCounts(),
    };
    this.scene = React.createRef();
    this.timer = null;
  }

  componentDidMount() {
    this.setupWorld();
    this.addBlocks();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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

    const wallWidth = 50;

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
        this.state.height,
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
        this.state.height,
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

  getCountsFromProps = pathOr(this.getInitialCounts(), [
    'data',
    'events',
    'count',
  ]);

  nextBlock = () => {
    const counts = this.getCountsFromProps(this.props);
    const blockKeys = keys(blockTypes).filter(
      key => counts[key] - this.state[key] > 0,
    );
    return blockKeys[Math.floor(Math.random() * blockKeys.length)];
  };

  addBlocks = () => {
    const block = this.nextBlock();
    if (!block) {
      return;
    }
    this.setState(state => ({ [block]: state[block] + 1 }));
    // add circles to the world,
    // Add some .5 'wiggle' to the x position so circles don't fall
    // directly on top of each other.
    World.add(
      this.engine.world,
      Bodies.circle(this.state.width / 2 + (Math.random() - 0.5), -50, 17, {
        restitution: 0.7,
        render: {
          sprite: {
            texture: blockTypes[block],
            xScale: 0.07,
            yScale: 0.07,
          },
        },
      }),
    );
    this.timer = setTimeout(this.addBlocks, 200);
  };

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        ref={this.scene}
      />
    );
  }
}

export default compose(graphql(getEventCounts))(Scene);
