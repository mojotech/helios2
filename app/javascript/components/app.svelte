<script>
  import ApolloClient from 'apollo-boost';
  import { onMount } from 'svelte';
  import { query } from 'svelte-apollo';
  import gql from 'graphql-tag';
  import SidePanel, { fragments as SidePanelFragments } from './side-panel.svelte';
  import filterFragments from '@lib/filter-fragments';
  import { mathMod, pathOr } from 'ramda';

  const getPrimaryLocation = gql`
    query getPrimaryLocation($id: Int!) {
      primaryLocation {
        ...getSidePanel
        widgets {
          byIdOrFirst(id: $id) {
            id
            name
            durationSeconds
            showWeather
          }
          enabled {
            id
          }
        }
      }
    }

    ${SidePanelFragments.getSidePanel}
  `;

  const client = new ApolloClient({ uri: '/graphql' });
  const prefetchDelay = 1000;

  let loading = true;
  let error = null;
  let primaryLocation;
  $: currentWidget = pathOr({ id: 0 }, ['widgets', 'byIdOrFirst'], primaryLocation);
  $: enabledWidgets = pathOr([], ['widgets', 'enabled'], primaryLocation);

  $: transitionTime = currentWidget.durationSeconds
    ? Date.now() + currentWidget.durationSeconds * 1000
    : null;
  $: index = enabledWidgets.findIndex(w => w.id === currentWidget.id);
  $: nextWidgetId = enabledWidgets.length > 0
    ? enabledWidgets[mathMod(index + 1, enabledWidgets.length)].id
    : null;
  $: prevWidgetId = enabledWidgets.length > 0
    ? enabledWidgets[mathMod(index - 1, enabledWidgets.length)].id
    : null;

  let pausedTime;

  function handleKeydown(event) {
    const { key, keyCode } = event;
    switch (key) {
      case ' ':
        if (pausedTime) {
          transitionTime = transitionTime - pausedTime + Date.now();
          pausedTime = null;
        }
        else {
          pausedTime = Date.now();
        }
        break;
      case 'ArrowUp':
        queryFor(prevWidgetId);
        break;
      case 'ArrowDown':
        queryFor(nextWidgetId);
        break;
    }
  }

  async function queryFor(id) {
    try {
      const result = await client.query({
        query: getPrimaryLocation,
        variables: { id },
      });
      loading = false;
      primaryLocation = result.data.primaryLocation;
    }
    catch (err) {
      err = err.message;
    }
  }

  onMount(async () => {
    queryFor(0);

    const interval = setInterval(() => {
      if (!transitionTime || pausedTime) {
        return;
      }

      const prefetchTime = transitionTime - prefetchDelay;
      const now = Date.now();

      if (transitionTime < now) {
        queryFor(nextWidgetId);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<style type="text/scss">
  @import "./theme.sass";

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: $familyRegular;
  }

  main {
    color: $white;
    background: $black;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }

  section {
    flex: 1;
    display: flex;
    padding-top: 100px;
    padding-left: 100px;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>
<main>
  {#if loading}
    <section>Loading...</section>
    <aside></aside>
  {:else if error}
    <section>{error}</section>
    <aside></aside>
  {:else}
    <section>{primaryLocation.widgets.byIdOrFirst.name}</section>
    <SidePanel
      {...filterFragments(SidePanelFragments, primaryLocation).getSidePanel}
      currentWidgetId={currentWidget.id}
      showWeather={currentWidget.showWeather}
      durationSeconds={currentWidget.durationSeconds}
      isPaused={!!pausedTime}
    />
  {/if}
</main>
