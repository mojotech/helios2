<script>
  export let widgetId;
  export let selected;
  export let durationSeconds;
  export let text;
  export let isPaused;

  const height = 4;
  $: runningState = isPaused ? "paused" : "playing";
</script>

<style type="text/scss">
  @import "./theme.sass";
  .tab {
    cursor: pointer;
    font-size: $sizeSmall;
    opacity: 0.5;
  }

  .tab .text {
    margin-top: 19px;
    margin-bottom: 19px;
  }

  .tab.selected {
    opacity: inherit;
  }

  .progressBar {
    background-color: $white;
    height: 4px;
    animation: progressBarFrames 20s linear 0s;
    animation-fill-mode: forwards;
    animation-play-state: var(--running-state);
  }

  @keyframes progressBarFrames {
    0% {
      width: 100%;
    }
    100% {
      width: 0;
    }
  }

  .solidBar {
    background-color: $white;
    height: 1px;
    opacity: 0.5;
  }

  .selected .solidBar {
    opacity: inherit;
  }
</style>

{#if selected}
  <div class="tab selected">
    <div class="text">{text}</div>
    <div class="progressBar" style="--running-state: {runningState}" />
    <div class="solidBar" />
  </div>
{:else}
  <div class={"tab"}>
    <div class="text">{text}</div>
    <div class="solidBar" />
  </div>
{/if}
