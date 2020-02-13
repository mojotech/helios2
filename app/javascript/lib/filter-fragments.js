import { filter } from 'graphql-anywhere';

/*
 * withFragment returns a component which expects props that match
 * WrappedComponent's fragment names
 */
export default function filterFragments(fragments, data) {
  const fragmentKeys = Object.keys(fragments);
  return fragmentKeys.reduce((accProps, fragmentKey) => {
    const fragment = fragments[fragmentKey];
    return {
      ...accProps,
      [fragmentKey]: filter(fragment, data || {}),
    };
  }, {});
}
