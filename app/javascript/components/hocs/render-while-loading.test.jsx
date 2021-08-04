import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import renderWhileLoading from '@hocs/render-while-loading';

describe('renderWhileLoading higher order component', () => {
  it('it renders the loading component if loading property is true', () => {
    const testLoadingComponent = () => {
      return 'testLoadingComponent rendered';
    };
    const testBaseComponent = () => {
      return 'testBaseComponent rendered';
    };
    const WrappedComponent = renderWhileLoading(testLoadingComponent)(
      testBaseComponent,
    );

    expect(
      ReactTestRenderer.create(<WrappedComponent loading />).toJSON(),
    ).toEqual('testLoadingComponent rendered');
  });
  it('it renders the base component if loading property is false', () => {
    const testLoadingComponent = () => {
      return 'testLoadingComponent rendered';
    };
    const testBaseComponent = () => {
      return 'testBaseComponent rendered';
    };
    const WrappedComponent = renderWhileLoading(testLoadingComponent)(
      testBaseComponent,
    );

    expect(
      ReactTestRenderer.create(<WrappedComponent loading={false} />).toJSON(),
    ).toEqual('testBaseComponent rendered');
  });
  it('it has a prop error if loading property is undefined', () => {
    const noop = () => {};
    const WrappedComponent = renderWhileLoading(noop)(noop);

    expect(() => {
      ReactTestRenderer.create(<WrappedComponent />).toJSON();
    }).toThrow(
      'Failed prop type: The prop `loading` is marked as required in `branch(noop)`, but its value is `undefined`.',
    );
  });
});
