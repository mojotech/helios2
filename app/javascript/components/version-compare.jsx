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
      console.log(`Caused Error!`);
    },
    complete: () => {
      console.log(`We completed!`);
    },
  });

export default versionCompare;
