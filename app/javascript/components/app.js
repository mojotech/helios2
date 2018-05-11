import React from 'react';
import Logo from './logo';
import FullPanel from './full-panel';
import SidePanel from './side-panel';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <FullPanel />
        <SidePanel />
      </div>
    );
  }
}
