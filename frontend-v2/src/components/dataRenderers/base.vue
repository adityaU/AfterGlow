<template>
<div class="tw-overflow-auto">
  <RenderSelector :rendererType="rendererType" @setRendererType="setRenderer" />
  <div v-if="rendererType == 'number'">
    <AGNumberChart :results="results" :resultsKey="resultsKey"></AGNumberChart>
  </div>
  <div v-if="rendererType == 'table'">
    <AGTable :results="results" :resultsKey="resultsKey"></AGTable>
  </div>
  <div v-if="rendererType == 'transposed_table'">
    <AGTransposedTable :results="results" :resultsKey="resultsKey"></AGTransposedTable>
  </div>
  <div v-if="rendererType == 'line'">
    <AGLine :results="results" :resultsKey="resultsKey"></AGLine>
  </div>
  <div v-if="rendererType == 'bar'">
    <AGBar :results="results" :resultsKey="resultsKey"></AGBar>
  </div>
  <div v-if="rendererType == 'pie'">
    <AGPie :results="results" :resultsKey="resultsKey"></AGPie>
  </div>
  <div v-if="rendererType == 'area'">
    <AGArea :results="results" :resultsKey="resultsKey"></AGArea>
  </div>
  <div v-if="rendererType == 'bubble'">
    <AGBubble :results="results" :resultsKey="resultsKey"></AGBubble>
  </div>
  <div v-if="rendererType == 'funnel'">
    <AGFunnel :results="results" :resultsKey="resultsKey"></AGFunnel>
  </div>
</div>
</template>

<script>
import RenderSelector from 'components/dataRenderers/renderSelector.vue';

import AGTable from 'components/dataRenderers/charts/table.vue';
import AGTransposedTable from 'components/dataRenderers/charts/transposedTable.vue';
import AGNumberChart from 'components/dataRenderers/charts/numberChart.vue';
import AGLine from 'components/dataRenderers/charts/lineChart.vue';
import AGBar from 'components/dataRenderers/charts/barChart.vue';
import AGArea from 'components/dataRenderers/charts/areaChart.vue';
import AGBubble from 'components/dataRenderers/charts/bubbleChart.vue';
import AGFunnel from 'components/dataRenderers/charts/funnelChart.vue';
import AGPie from 'components/dataRenderers/charts/pieChart.vue';

import { resultsStore } from 'stores/results'

export default {
  name: "BaseDataRenderer",
  components: {
    AGTable, AGArea,
    AGTransposedTable, AGNumberChart, AGLine, AGBar, AGBubble, AGFunnel, AGPie,
    RenderSelector
  },
  props: {
    resultsKey: {},
    dataLoaded: {}
  },

  watch: {
    resultsKey: function () {
      this.updateProps()
    },
    dataLoaded: function () {
      this.updateProps()
    }
  },

  data() {
    return {
      rendererType: 'table',
      results: null,
    }
  },

  methods: {
    setRenderer(t) {
      this.rendererType = t
    },

    updateProps() {
      const results = resultsStore()
      if (this.resultsKey && this.dataLoaded) {
        this.results = results.getResults(this.resultsKey);
      }
    }
  },


  mounted() {
    this.updateProps()
  },



  // data() {
  //   const route = useRoute();
  //   return {
  //     resultsKey: null,
  //     dataLoaded: false
  //   }
  // },

  // setup(){
  // }
}
</script>
