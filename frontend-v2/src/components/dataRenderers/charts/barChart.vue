<template>
    <ComboChart :results="results" :resultsKey="resultsKey" :showSettings="showSettings" defaultChartType="bar" :settings="settings" @settings="(val) => $emit('settings', val)" />
</template>

<script>
import ComboChart from "./comboChart.vue"
export default {
  name: 'AGBar',
  components: { ComboChart },

  props: ['results', 'resultsKey', 'showSettings'],

}
</script>
