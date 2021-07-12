import React from 'react';
import { filter } from 'graphql-anywhere';
import hoistNonReactStatic from 'hoist-non-react-statics';

/*
 * withFragment returns a component which expects props that match
 * WrappedComponent's fragment names
 */
export default function withFragmentModify(WrappedComponent, FragmentObject) {
  const Enhanced = React.memo(props => {
    const fragmentKeys = Object.keys(FragmentObject);
    const fragmentDataProps = fragmentKeys.reduce((accProps, fragmentKey) => {
      const fragment = WrappedComponent.fragments[fragmentKey];
      return {
        ...accProps,
        [fragmentKey]: filter(fragment, props[fragmentKey] || {}),
      };
    }, {});

    return <WrappedComponent {...props} {...fragmentDataProps} />;
  });

  // retain fragments defined statically on WrappedComponent'=
  // TODO: remove this.
  // hoistNonReactStatic(Enhanced, WrappedComponent);


  // TODO: add renderWhileLoading & renderWhileError
  const render = WrappedComponent.propTypes;
  switch(render){
    case render.loading:
      return Enhanced;
    case render.error:
      return null;
  }


  return Enhanced;
}
