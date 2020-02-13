<script>
  import ApolloClient from 'apollo-boost';
  import { setClient, query } from 'svelte-apollo';
  import gql from 'graphql-tag';
  import SidePanel, { fragments as SidePanelFragments } from './side-panel.svelte';
  import filterFragments from '@lib/filter-fragments';

  const getWidgets = gql`
    query getWidgets($id: Int!) {
      primaryLocation {
        ...getSidePanel
        widgets {
          byIdOrFirst(id: $id) {
            id
            name
            durationSeconds
            sidebarText
            showWeather
          }
        }
      }
    }

    ${SidePanelFragments.getSidePanel}
  `;

  const client = new ApolloClient({ uri: '/graphql' });
  setClient(client);

  let currentWidgetId = 0;

  const widgets = query(client, {
    query: getWidgets,
    variables: { id: currentWidgetId },
  });

  $: widgets.refetch({ currentWidgetId });
</script>

<style type="text/scss">
  @import "./theme.sass";

  :global(body) {
    margin: 0;
    padding: 0;
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

<main>
  {#await $widgets}
    <section>Loading...</section>
    <aside></aside>
  {:then result}
    <section>{result.data.primaryLocation.widgets.byIdOrFirst.name}</section>
    <SidePanel {...filterFragments(SidePanelFragments, result.data.primaryLocation).getSidePanel} />
  {/await}
</main>
