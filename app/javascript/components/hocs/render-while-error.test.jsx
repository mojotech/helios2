import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import renderWhileError from '@hocs/render-while-error';

describe('renderWhileError higher order component', () => {
  it('it renders the error component if error property is true', () => {
    const testErrorComponent = () => {
      return 'testErrorComponent rendered';
    };
    const testBaseComponent = () => {
      return 'testBaseComponent rendered';
    };
    const WrappedComponent = renderWhileError(testErrorComponent)(
      testBaseComponent,
    );

    expect(
      ReactTestRenderer.create(<WrappedComponent error />).toJSON(),
    ).toEqual('testErrorComponent rendered');
  });
  it('it renders the base component if error property is false', () => {
    const testErrorComponent = () => {
      return 'testErrorComponent rendered';
    };
    const testBaseComponent = () => {
      return 'testBaseComponent rendered';
    };
    const WrappedComponent = renderWhileError(testErrorComponent)(
      testBaseComponent,
    );

    expect(
      ReactTestRenderer.create(<WrappedComponent error={false} />).toJSON(),
    ).toEqual('testBaseComponent rendered');
  });
  it('it has a prop error if error property is undefined', () => {
    const noop = () => {};
    const WrappedComponent = renderWhileError(noop)(noop);

    expect(() => {
      ReactTestRenderer.create(<WrappedComponent />).toJSON();
    }).toThrow(
      'Failed prop type: The prop `error` is marked as required in `branch(noop)`, but its value is `undefined`.',
    );
  });
});
