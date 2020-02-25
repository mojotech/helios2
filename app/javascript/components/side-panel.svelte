<script context="module">
  import gql from 'graphql-tag';
  import Wifi, { fragments as WifiFragments } from '@components/wifi.svelte';
  import Bathroom, { fragments as BathroomFragments } from '@components/bathroom.svelte';
  import CarouselTab from '@components/carousel-tab.svelte';
  import Logo from '@images/logo.png';

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

  export let currentWidgetId;
  export let showWeather;
  export let durationSeconds;
  export let isPaused;

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
    justify-content: space-around;
    display: flex;
    overflow: hidden;
    padding: 80px 60px 40px 40px;
  }

  .logoRow {
    display: flex;
    align-items: left;
    justify-content: space-between;
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
      <img src={Logo} alt="helios" width={62} height={54} />
    </div>
    <div class="row">
      <Time timezone={timezone} />
    </div>
    <div class="row">
      <Wifi {...filterFragments(WifiFragments, $$props).getWifi} />
      <Bathroom {...filterFragments(BathroomFragments, $$props).getBathroom} />
    </div>
    <div>
      {#each enabledWidgets as widget (widget.id)}
        <CarouselTab
          widgetId={widget.id}
          selected={widget.id == currentWidgetId}
          durationSeconds={durationSeconds}
          text={widget.sidebarText}
          isPaused={isPaused}
        />
      {:else}
        No widgets found
      {/each}
    </div>
  </aside>
{/if}
