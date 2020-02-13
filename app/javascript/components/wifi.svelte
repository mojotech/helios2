<script context="module">
  import gql from 'graphql-tag';

  const getWifi = gql`
    fragment getWifi on Location {
      wifiName
      wifiPassword
    }
  `;

  export const fragments = {
    getWifi,
  };
</script>
<script>
  export let wifiName;
  export let wifiPassword;
</script>

<style>
  .wifi {
    display: flex;
    flex-direction: column;
    margin-right: 119px;
    margin-bottom: 50px;
    margin-top: 100px;
  }
</style>

<div class="wifi">
  <div>WIFI</div>
  <div>{wifiName}</div>
  <div>{wifiPassword}</div>
</div>
