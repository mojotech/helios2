<script>
  import { onMount } from 'svelte';
  import { dateForTimezone } from '@lib/datetime';

  export let timezone;
  let time = new Date();
  $: date = dateForTimezone(timezone, time);

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
  .dateText {
    color: $white;
    font-size: $sizeMedium;
    font-family: $familyLight;
    margin-bottom: 12px;
    margin-top: 12px;
  }
</style>

<div class="dateText">{date}</div>
