<script>
  import { onMount } from 'svelte';
  import { timeForTimezone } from '@lib/datetime';

  export let timezone;
  let time = new Date();
  $: [hourMin, amPm] = timeForTimezone(timezone, time).split(' ');

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<style type="text/scss">
  @import "./theme.sass";
  .hourMin {
    font-size: $sizeXlarge;
    font-family: $familyExtended;
    font-weight: $weightRegular;
    position: relative;
    top: 8px;
  }
  .amPm {
    font-size: $sizeMedium;
    font-family: $familyExtended;
    margin-left: 11px;
  }
</style>

<div>
  <div class="hourMin">{hourMin}</div>
  <div class="amPm">{amPm}</div>
</div>
