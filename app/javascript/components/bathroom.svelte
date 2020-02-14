<script context="module">
  import gql from 'graphql-tag';

  const getBathroom = gql`
    fragment getBathroom on Location {
      bathroomCode
    }
  `;

  export const fragments = {
    getBathroom,
  };
</script>
<script>
  export let bathroomCode;
</script>

<style type="text/scss">
  @import "./theme.sass";
  .bathroom {
    display: flex;
    flex-direction: column;
  }
  .subTitle {
    font-size: $sizeSmall;
    letter-spacing: 1px;
    opacity: 0.8;
    margin-bottom: $spacingL;
  }

  .subTitleLarge {
    font-size: $sizeLarge;
    margin-bottom: $spacingM;
  }

</style>

<div class="bathroom">
  <div class="subTitle">BATHROOM CODE</div>
  <div class="subTitleLarge">{bathroomCode}</div>
</div>
