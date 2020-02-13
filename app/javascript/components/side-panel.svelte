<script context="module">
  import gql from 'graphql-tag';
  import Wifi, { fragments as WifiFragments } from '@components/wifi.svelte';
  import Bathroom, { fragments as BathroomFragments } from '@components/bathroom.svelte';

  const getSidePanel = gql`
    fragment getSidePanel on Location {
      ...getWifi
      ...getBathroom
      timezone
      widgets {
        enabled {
          id
          sidebarText
        }
      }
    }

    ${WifiFragments.getWifi}
    ${BathroomFragments.getBathroom}
  `;

  export const fragments = {
    getSidePanel,
  };
</script>
<script>
  export let loading = false;
  export let timezone; 
  export let widgets; 

  $: enabledWidgets = widgets.enabled;

  import Date from '@components/date.svelte';
  import Time from '@components/time.svelte';
  import filterFragments from '@lib/filter-fragments';
</script>

<style>
  aside {
    background-color: rgba(0, 0, 0, 0.7);
    flex: 0 0 600px;
    flex-direction: column;
    display: flex;
    overflow: hidden;
  }

  .logoRow {
    display: flex;
    margin-top: 13px;
    align-items: left;
    justify-content: left;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-right: 100px;
  }
</style>

{#if loading}
  <aside>Loading...</aside>
{:else}
  <aside>
    <div class="logoRow">
      <Date timezone={timezone} />
    </div>
    <div class="row">
      <Time timezone={timezone} />
    </div>
    <div class="row">
      <Wifi {...filterFragments(WifiFragments, $$props).getWifi} />
      <Bathroom {...filterFragments(BathroomFragments, $$props).getBathroom} />
    </div>
    <ul>
      {#each enabledWidgets as widget (widget.id)}
        <li>{widget.sidebarText}</li>
      {:else}
        <li>No widgets found</li>
      {/each}
    </ul>
  </aside>
{/if}
