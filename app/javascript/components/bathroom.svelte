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

<style>
  .wifi {
    display: flex;
    flex-direction: column;
    margin-top: 100px;
  }
</style>

<div class="wifi">
  <div>BATHROOM CODE</div>
  <div>{bathroomCode}</div>
</div>
