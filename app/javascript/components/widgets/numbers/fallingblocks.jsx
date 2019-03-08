import React from 'react';
import { reduce } from 'ramda';
import PropTypes from 'prop-types';
import { withContext as withUnityContext } from '../../unity-context';
/* global UnityLoader */

const unityBlockNames = ['pr', 'commit', 'slack'];

class FallingBlocks extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      unityReady: false,
    };
  }

  componentDidMount() {
    this.fallingBlocks = UnityLoader.instantiate(
      'falling-blocks-canvas',
      'unity/webgl.json',
      {
        Module: {
          // wait for unity splash screen to go away before
          // adding blocks
          preRun: [() => this.setState({ unityReady: true })],
        },
      },
    );
  }

  componentWillReceiveProps(newProps) {
    const newState = reduce(
      (acc, a) => ({
        ...acc,
        [a]: (acc[a] || 0) + (this.state[a] || 0),
      }),
      newProps,
      unityBlockNames,
    );

    this.setState(newState, this.addBlocks);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  timer = null;

  nextBlock = () => {
    const keys = unityBlockNames.filter(key => this.state[key] > 0);
    return keys[Math.floor(Math.random() * keys.length)];
  };

  addBlocks = () => {
    const block = this.nextBlock();
    if (this.props.isVisible && this.state.unityReady && block) {
      this.setState({ [block]: this.state[block] - 1, done: false });
      this.fallingBlocks.SendMessage('background', 'addObject', block);
      this.timer = setTimeout(this.addBlocks, 200);
    }
  };

  render() {
    return <div id="falling-blocks-canvas" />;
  }
}

export default withUnityContext(FallingBlocks);
