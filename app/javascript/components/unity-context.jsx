import React from 'react';

const UnityContext = React.createContext({
  isVisible: false,
  setVisible: () => {},
});

export const { Provider } = UnityContext;

export const withContext = Component => props => (
  <UnityContext.Consumer>
    {value => <Component {...props} {...value} />}
  </UnityContext.Consumer>
);
