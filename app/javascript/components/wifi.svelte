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

<style type="text/scss">
  @import "./theme.sass";
  .wifi {
    display: flex;
    flex-direction: column;
  }

  .subTitle {
    font-size: $sizeSmall;
    letter-spacing: 1px;
    opacity: 0.8;
  }

  .subTitleLarge {
    font-size: $sizeLarge;
    margin-bottom: $spacingM;
  }
</style>

<div class="wifi">
  <div class="subTitle">WIFI</div>
  <div class="subTitleLarge">{wifiName}</div>
  <div class="subTitleLarge">{wifiPassword}</div>
</div>
