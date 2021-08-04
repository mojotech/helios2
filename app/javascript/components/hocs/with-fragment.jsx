import React from 'react';
import { filter } from 'graphql-anywhere';

/*
 * withFragment returns a component which expects props that match
 * WrappedComponent's fragment names
 */
export const withFragment = fragmentObject => WrappedComponent => {
  const Enhanced = React.memo(props => {
    const fragmentKeys = Object.keys(fragmentObject);
    const fragmentDataProps = fragmentKeys.reduce((accProps, fragmentKey) => {
      const fragment = fragmentObject[fragmentKey];
      return {
        ...accProps,
        [fragmentKey]: filter(fragment, props[fragmentKey] || {}),
      };
    }, {});

    return <WrappedComponent {...props} {...fragmentDataProps} />;
  });

  return Enhanced;
};

export default withFragment;
