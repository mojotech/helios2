import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const locationQuery = gql`
  fragment SidePanel on Location {
    ...Bathroom
    ...TopCorner
    ...Wifi
  }
  fragment Wifi on Location {
    wifiName
    wifiPassword
  }
  fragment Bathroom on Location {
    bathroomCode
  }
  fragment TopCorner on Location {
    ...TimeHero
  }
  fragment TimeHero on Location {
    timeZone
  }
`;

const locationData = {
  timeZone: 'America/Denver',
  wifiName: 'test',
  wifiPassword: 'test1234',
  bathroomCode: '1234',
  foo: 'bar',
};

describe('withFragment higher order component', () => {
  it('filters properties correctly', () => {
    const testComponent = ({ location }) => {
      expect(location).toEqual({
        timeZone: 'America/Denver',
        wifiName: 'test',
        wifiPassword: 'test1234',
        bathroomCode: '1234',
      });
      return 'testComponent rendered';
    };
    const WrappedComponent = withFragment({
      location: locationQuery,
    })(testComponent);
    expect(
      ReactTestRenderer.create(
        <WrappedComponent location={locationData} />,
      ).toJSON(),
    ).toEqual('testComponent rendered');
  });
});
