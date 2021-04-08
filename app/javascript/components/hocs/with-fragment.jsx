import React from 'react';
import { filter } from 'graphql-anywhere';
import hoistNonReactStatic from 'hoist-non-react-statics';

/*
 * withFragment returns a component which expects props that match
 * WrappedComponent's fragment names
 */
export default function withFragment(WrappedComponent) {
  const Enhanced = React.memo(props => {
    const fragmentKeys = Object.keys(WrappedComponent.fragments);
    const fragmentDataProps = fragmentKeys.reduce((accProps, fragmentKey) => {
      const fragment = WrappedComponent.fragments[fragmentKey];
      return {
        ...accProps,
        [fragmentKey]: filter(fragment, props[fragmentKey] || {}),
      };
    }, {});

    return <WrappedComponent {...props} {...fragmentDataProps} />;
  });

  // retain fragments defined statically on WrappedComponent
  hoistNonReactStatic(Enhanced, WrappedComponent);

  return Enhanced;
}
