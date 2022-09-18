<template >
  <div class="tw-h-full tw-w-full tw-bg-white tw-rounded-sm tw-border tw-shadow-sm tw-flex" v-if="!results && !loading">
    <div class="tw-text-2xl tw-m-auto ">
      Wanna See Something Cool ? Run a Query
    </div>

  </div>
  <div class="tw-w-full tw-h-full tw-bg-secondary" v-if="results">

    <VisualizationLayout v-model:visualizations="visualizationsLocal" @deleteViz="(index) => $emit('deleteViz', index)"
      @fetchVizResults="(viz) => $emit('fetchVizResults', viz)" />
    <splitpanes class="pane-wrapper default-theme" ref="chart-parent" @resize="settingsPanesize = 100 -  $event[0].size">
      <pane :size="100" class="pane" :class="showSettings ? 'pane-left' : ''">

        <AGLoader text="Updating" v-if="loading" class="tw-bg-white tw-border tw-shadow-sm tw-rounded-sm" />
        <QBHorizontalLayout :columns="results.original_query_columns || results.columns" :rows="results.rows"
          :colDetails="results.column_details" :resultsKey="resultskey"
          class="tw-mb-[10px] tw-shadow-sm tw-border tw-rounded-sm" :showSettings="showSettings"
          @updateShowSettings="(val) => showSettings = !val" @updateViz="$emit('updateViz', currentViz)"
          v-model:queryTerms="currentViz.queryTerms" />
        <div class="tw-h-full tw-w-full" v-if="!loading">
          <DebugInfo :query="results.final_query" v-model:showQuery="showQuery"
            class="tw-border tw-mb-[10px] tw-bg-white" v-if="showDebugInfo" />
          <div class="tw-h-[calc(100%-55px)] tw-overflow-auto tw-shadow-sm tw-border tw-bg-white tw-rounded-sm"
            :class="showDebugInfo ? (showQuery ? 'tw-h-[calc(100%-303px)]' : 'tw-h-[calc(100%-103px)]') : 'tw-h-[calc(100%-55px)]'">


            <div class="tw-h-full tw-w-full tw-flex" v-if="results.rows && results.rows.length === 0">
              <div class="tw-m-auto">
                LOOKS LIKE YOUR QUERY DID NOT RETURN ANY RESULT.
              </div>
            </div>
            <component :is="componentDefs[currentViz.rendererType]['visComponent']" :results="results"
              :resultsKey="resultskey" :settings="currentViz.settings[currentViz.rendererType]" :key="currentViz"
              class="tw-bg-white" v-if="results.rows && results.rows.length > 0 && !results.message" :size="settingsPanesize" />

            <div class="tw-h-full tw-w-full tw-bg-white tw-rounded-sm tw-shadow-sm tw-flex " v-if="results.message">
              <div class="tw-text-2xl tw-m-auto tw-text-center tw-text-red-600">
                {{ results.message }}
                <div class="tw-text-default tw-text-sm">
                  Please look at debug info above for more information
                </div>
              </div>
            </div>
          </div>
        </div>
      </pane>
      <pane :size="settingsPanesize" ref="chart" class="pane pane-right tw-shadow-sm !tw-border"
        v-if="showSettings && results.rows && results.rows.length > 0 && !loading">
        <ChartToolbar :showSettings="showSettings" :rendererType="currentViz.rendererType"
          @setRendererType="(val) => currentViz.rendererType = val" />
        <component :is="componentDefs[currentViz.rendererType]['settingsComponent']"
          class="tw-h-[calc(100%-55px)] tw-bg-white tw-overflow-auto tw-rounded-sm"
          @settings="(val) => currentViz.settings[currentViz.rendererType] = val" :columns="results.columns"
          :rows="results.rows" :colDetails="results.column_details"
          :additionalProps="componentDefs[currentViz.rendererType]['additionalProps']"
          :settings="currentViz.settings[currentViz.rendererType]" :key="currentViz" />
      </pane>
    </splitpanes>
  </div>

</template>

<script>
import ChartToolbar from 'components/dataRenderers/chartToolbar.vue';

import AGTable from 'components/dataRenderers/charts/table.vue';
import AGTransposedTable from 'components/dataRenderers/charts/transposedTable.vue';
import AGNumberChart from 'components/dataRenderers/charts/numberChart.vue';
import AGComboChart from 'components/dataRenderers/charts/comboChart.vue';
import AGPie from 'components/dataRenderers/charts/pieChart.vue';
import QBHorizontalLayout from 'components/queryTerms/layout.vue'
import TableSettings from 'components/dataRenderers/charts/settings/tableSettings.vue';
import ComboChartSettings from 'components/dataRenderers/charts/settings/mixedChartSettings.vue';
import PieChartSettings from 'components/dataRenderers/charts/settings/pieChartSettings.vue';
import NumberChartSettings from 'components/dataRenderers/charts/settings/numberSettings.vue';


import AGLoader from 'components/utils/loader.vue'
import VisualizationLayout from 'components/dataRenderers/visualizationsLayout.vue';
import DebugInfo from 'components/dataRenderers/defugInfo.vue'
import { _ } from 'lodash'

import { Splitpanes, Pane } from 'splitpanes'
import { resultsStore } from 'stores/results'

import 'splitpanes/dist/splitpanes.css'

import { shallowRef } from 'vue';

const newSettings =
{
  table: null,
  transposed_table: null,
  pie: null,
  funnel: null,
  line: null,
  bar: null,
  area: null,
  bubble: null,
  number: null,
}

const newQueryTerms = {
  details: null
}

const newComponentDefs =
{
  table: {
    settingsComponent: shallowRef(TableSettings),
    visComponent: shallowRef(AGTable),
    additionalProps: {},
  },
  transposed_table: {
    settingsComponent: shallowRef(TableSettings),
    visComponent: shallowRef(AGTransposedTable),
    additionalProps: {},
  },
  pie: {
    settingsComponent: shallowRef(PieChartSettings),
    visComponent: shallowRef(AGPie),
    additionalProps: {},
  },
  funnel: {
    settingsComponent: shallowRef(PieChartSettings),
    visComponent: shallowRef(AGPie),
    additionalProps: { defaultChartType: 'funnel', hideFunnelOptions: true },
  },
  line: {
    settingsComponent: shallowRef(ComboChartSettings),
    visComponent: shallowRef(AGComboChart),
    additionalProps: { defaultChartType: 'line' },
  },
  bar: {
    settingsComponent: shallowRef(ComboChartSettings),
    visComponent: shallowRef(AGComboChart),
    additionalProps: { defaultChartType: 'bar' },
  },
  area: {
    settingsComponent: shallowRef(ComboChartSettings),
    visComponent: shallowRef(AGComboChart),
    additionalProps: { defaultChartType: 'area' },
  },
  bubble: {
    settingsComponent: shallowRef(ComboChartSettings),
    visComponent: shallowRef(AGComboChart),
    additionalProps: { defaultChartType: 'scatter' },
  },
  number: {
    settingsComponent: shallowRef(NumberChartSettings),
    visComponent: shallowRef(AGNumberChart),
    additionalProps: {},
  },
}
const newVisualization = {
  name: 'Visualization 1',
  rendererType: 'table',
  settings: _.cloneDeep(newSettings),
  queryTerms: _.cloneDeep(newQueryTerms)
}

export default {
  name: "BaseDataRenderer",
  components: {
    VisualizationLayout, DebugInfo, AGLoader,
    AGTable,
    AGTransposedTable, AGNumberChart, AGComboChart, AGPie,
    ChartToolbar, QBHorizontalLayout,
    ComboChartSettings, NumberChartSettings, PieChartSettings, TableSettings,
    Splitpanes, Pane
  },
  props: {
    resultsKey: {},
    dataLoaded: {},
    visualizations: {},
    error: {},
    loading: {},
    finalQuery: {}
  },

  watch: {
    resultsKey() {
      this.updateProps()
    },
    dataLoaded() {
      this.updateProps()
    },
    componentDefs: {
      handler() {
        console.log(this.componentDefs)
      },
      deep: true
    },
    settingsPanesize(){
      console.log(this.settingsPanesize)
    },
    showSettings() {
      this.settingsPanesize = this.showSettings ? 30 : 0
    },
    visualizations: {
      deep: true,
      handler() {
        if (this.visualizations.towardsBaseRenderer) {
          this.visualizationsLocal.towardsVizLayout = true
          this.visualizationsLocal = this.visualizations.details || { details: null }
        }
      }

    },
    visualizationsLocal: {
      deep: true,
      handler() {
        this.visualizationsLocal.details.forEach((viz) => {
          if (!viz.settings) {
            viz.settings = _.cloneDeep(newSettings)
          }
          if (!viz.queryTerms) {
            viz.queryTerms = _.cloneDeep(newQueryTerms)
          }
        })
        this.currentViz = this.visualizationsLocal.details.filter((viz) => viz.current)[0] 
        if (!this.currentViz){
          this.visualizationsLocal.details[0].current = true
          this.currentViz = this.visualizationsLocal.details[0]
        }
        this.currentViz.queryTerms.towardsQTLayout = true
        this.$emit('update:visualizations', { towardsBaseRenderer: false, details: this.visualizationsLocal })
      }
    },

    error() {
      if (this.error != null) {
        this.showDebugInfo = true,
          this.showQuery = false
        return
      }
      this.showDebugInfo = false,
        this.showQuery = true

    },

    rendererType() {
      this.visualizationsLocal.towardsVizLayout = true
    }


  },

  computed: {
    rendererType() {
      return this.currentViz.rendererType
    }
  },

  data() {
    const vizs = this.visualizations.details || { towardsVizLayout: true, details: [_.cloneDeep(newVisualization)] }
    console.log(vizs)
    if (vizs.details.filter(viz => viz.current).length === 0) {
      vizs.details[0].current = true
    }
    this.$emit('update:visualizations', { towardsBaseRenderer: false, details: vizs })
    return {
      settingsPanesize: 0,
      results: null,
      showSettings: false,
      componentDefs: _.cloneDeep(newComponentDefs),
      visualizationsLocal: vizs,
      currentViz: vizs.details.filter((item) => item.current)[0],
      showQuery: this.error === null ? true : false,
      showDebugInfo: this.error === null ? false : true,
    }
  },

  methods: {
    updateProps() {
      const results = resultsStore()
      if (this.resultsKey && this.dataLoaded) {
        this.results = results.getResults(this.resultsKey) || { columns: [], rows: [], column_details: {} };
      }
    }
  },


  mounted() {
    this.updateProps()
  },

}
</script>
