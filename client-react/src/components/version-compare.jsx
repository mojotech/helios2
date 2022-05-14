import gql from 'graphql-tag';

const getVersion = gql`
  subscription onDeploymentSha {
    deploymentSha
  }
`;

let lastValue = null;

const versionCompare = client =>
  client.subscribe({ query: getVersion }).subscribe({
    next: ({ data: { deploymentSha } }) => {
      if (lastValue == null) {
        lastValue = deploymentSha;
      } else if (deploymentSha !== lastValue) {
        lastValue = deploymentSha;
        window.location.reload();
      }
    },
    error: () => {
      console.error(`Caused Error!`); // eslint-disable-line
    },
    complete: () => {
      console.log(`We completed!`); // eslint-disable-line
    },
  });

export default versionCompare;
