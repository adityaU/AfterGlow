<template >
  <div class="tw-w-full tw-bg-white tw-rounded-sm tw-border tw-shadow-sm tw-flex tw-min-h-[600px]"
    v-if="!results && !loading">
    <div class="tw-text-2xl tw-m-auto ">
      Wanna See Something Cool ? Run a Query
    </div>

  </div>
  <div class="tw-w-full tw-bg-secondary tw-min-h-[600px]" v-if="results">

    <VisualizationLayout v-model:visualizations="visualizationsLocal" @deleteViz="(index) => $emit('deleteViz', index)"
      @fetchVizResults="(viz) => $emit('fetchVizResults', viz)" />
    <splitpanes class="pane-wrapper default-theme" ref="chart-parent" @resize="settingsPanesize = 100 - $event[0].size">
      <pane :size="100" class="pane" :class="showSettings ? 'pane-left' : ''">

        <AGLoader text="Updating" v-if="loading" class="tw-bg-white tw-border tw-shadow-sm tw-rounded-sm" />
        <QBHorizontalLayout :columns="results.original_query_columns || results.columns" :rows="results.rows"
          :colDetails="results.column_details" :resultsKey="resultskey"
          class="tw-mb-[10px] tw-shadow-sm tw-border tw-rounded-sm" v-model:queryTerms="currentViz.queryTerms"
          :key="rerenderKey" :settings="currentViz.settings.general">

          <template #actions>
            <div class=" tw-inline tw-px-0.5 tw-h-[30px]">
              <a href="#" :class="iconActiveClass" @click="$emit('updateViz', currentViz)">
                <q-tooltip transition-show="scale" transition-hide="scale"> Run Query
                </q-tooltip>
                <PlayerPlayIcon class="tw-h-3 tw-w-3 tw-inline" />
              </a>
            </div>
            <div class=" tw-inline tw-px-0.5 tw-h-[30px]" v-if="results && results.rows && results.rows.length > 0">
              <a href="#" :class="[showSettings ? iconActiveClass : iconClass]" @click="showSettings = !showSettings">
                <q-tooltip transition-show="scale" transition-hide="scale"> Settings
                </q-tooltip>
                <SettingsIcon class="tw-h-3 tw-w-3 tw-inline" />
              </a>
            </div>
            <div class=" tw-inline tw-px-0.5 tw-h-[30px]"
              v-if="results && results.rows && results.rows.length > 0 && (currentUser.canDownload || currentUser.canCreateDashboard)">
              <a href="#" :class="iconClass">
                <q-tooltip transition-show="scale" transition-hide="scale"> More Actions
                </q-tooltip>
                <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="900px" :offset="[0, 5]"
                  class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown"
                  auto-close>
                  <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                    <div @click="$emit('download')" v-if="currentUser.canDownload"
                      class="tw-py-1 tw-cursor-pointer tw-whitespace-nowrap tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                      <DownloadIcon size="16" class="icon-primary tw-mr-2" />
                      <span class="">Download</span>
                    </div>
                    <div @click="openAddToDashboard = true" v-if="currentUser.canCreateDashboard"
                      class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                      <DashboardIcon size="16" class="icon-primary tw-mr-2" />
                      <span class="">Add To Dashboard</span>
                    </div>
                  </div>
                </q-menu>
                <Menu2Icon class="tw-h-3 tw-w-3 tw-inline" />
              </a>
            </div>
          </template>
        </QBHorizontalLayout>
        <div class="tw-h-full tw-w-full" v-if="!loading">
          <DebugInfo :query="results.final_query" v-model:showQuery="showQuery"
            class="tw-border tw-mb-[10px] tw-bg-white" v-if="showDebugInfo && canSeeDebugInfo" />
          <VizComponent :results="results" :resultsKey="resultskey" :queryKey="queryKey" :visualization="currentViz"
            :apiActionsQuesLevel="apiActionsQuesLevel" :questionID="questionID" :size="settingsPanesize"
            class="tw-h-[calc(100%-55px)] tw-overflow-auto tw-shadow-sm tw-border tw-bg-white tw-rounded-sm"
            @addFilter="(filter) => addFilter(filter)" @addSorting="(sorting) => addSorting(sorting)"
            :key="rendererKey" />
        </div>
      </pane>
      <pane :size="settingsPanesize" ref="chart" class="pane pane-right tw-shadow-sm !tw-border"
        v-if="showSettings && results.rows && results.rows.length > 0 && !loading">
        <div class="tw-bg-white tw-border-b-2 tw-border-primary" v-if="currentUser.canEditQuestion">
          <BoxSelect :options="settingsCategories" :selected="settingsCategory"
            @selected="(val) => settingsCategory = val" class="tw-pt-2 tw-text-center" />
        </div>
        <div class="tw-h-full tw-bg-white" v-if="settingsCategory === 'general'">
          <VizConfig v-model:vizConfig="currentViz.settings.general" v-if="currentUser.canEditQuestion" />
        </div>

        <div class="tw-bg-white tw-h-full" v-if="settingsCategory === 'visualization'">
          <ChartToolbar :showSettings="showSettings" :rendererType="currentViz.rendererType"
            @setRendererType="(val) => currentViz.rendererType = val" />
          <component :is="componentDefs[currentViz.rendererType]['settingsComponent']"
            class="tw-h-[calc(100%-55px)] tw-bg-white tw-overflow-auto tw-rounded-sm"
            @settings="(val) => currentViz.settings[currentViz.rendererType] = val" :columns="results.columns"
            :rows="results.rows" :colDetails="results.column_details" :queryKey="queryKey"
            :apiActionsVizLevel="apiActionsVizLevel" :apiActionsQuesLevel="apiActionsQuesLevel"
            :additionalProps="componentDefs[currentViz.rendererType]['additionalProps']" :questionID="questionID"
            :visualizationID="currentViz.id" :settings="currentViz.settings[currentViz.rendererType]"
            @updateApiActions="$emit('updateApiActions')" :key="rerenderKey" />
        </div>
      </pane>
    </splitpanes>
  </div>
  <AddToDashboard v-model:open="openAddToDashboard" :visualizationID="currentViz.id" :queryKey="queryKey" />
</template>

<script>
import ChartToolbar from 'components/dataRenderers/chartToolbar.vue';

import QBHorizontalLayout from 'components/queryTerms/layout.vue'
import BoxSelect from 'components/base/boxSelect.vue'

import VizComponent from 'components/visualizations/viz.vue'
import AddToDashboard from 'components/dashboard/addToDashboard.vue'
import VizConfig from 'components/visualizations/settings.vue'

import { SettingsIcon, PlayerPlayIcon, Menu2Icon, DownloadIcon, DashboardIcon } from 'vue-tabler-icons';
import AGLoader from 'components/utils/loader.vue'
import VisualizationLayout from 'components/dataRenderers/visualizationsLayout.vue';
import DebugInfo from 'components/dataRenderers/defugInfo.vue'
import { _ } from 'lodash'

import { Splitpanes, Pane } from 'splitpanes'
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import { currentUserStore } from 'src/stores/currentUser';

import 'splitpanes/dist/splitpanes.css'

import { newComponentDefs } from 'src/helpers/componentDefs'
import { newQueryTerms } from 'src/helpers/qtHelpers';
import { newSettings, newVisualization } from 'src/helpers/visualization'

const currentUser = currentUserStore();
export default {
  name: "BaseDataRenderer",
  components: {
    VisualizationLayout, DebugInfo, AGLoader, VizComponent,
    ChartToolbar, QBHorizontalLayout,
    Splitpanes, Pane,
    PlayerPlayIcon, SettingsIcon, Menu2Icon, AddToDashboard, DashboardIcon, DownloadIcon,
    BoxSelect, VizConfig
  },
  props: {
    resultsKey: {},
    queryKey: {},
    dataLoaded: {},
    visualizations: {},
    error: {},
    loading: {},
    finalQuery: {},
    apiActionKeyQuesLevel: {},
    apiActionKeyVizLevel: {},
    questionID: {},
  },

  watch: {
    resultsKey() {
      this.updateProps()
    },
    apiActionKeyQuesLevel() {
      const apiActions = apiActionStore()
      this.apiActionsQuesLevel = apiActions.get(this.apiActionKeyQuesLevel)
    },
    apiActionKeyVizLevel() {
      const apiActions = apiActionStore()
      this.apiActionsVizLevel = apiActions.get(this.apiActionKeyVizLevel)
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
        if (!this.currentViz) {
          this.visualizationsLocal.details[0].current = true
          this.currentViz = this.visualizationsLocal.details[0]
        }

        let index = -1
        this.visualizationsLocal.details && this.visualizationsLocal.details.forEach((viz, i) => {
          viz.current && (index = i)
        })
        this.currentViz.queryTerms.towardsQTLayout = true
        this.currentViz.index = index
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
    },
    rerenderKey() {
      return { rendererType: this.currentViz && this.currentViz.rendererType, index: this.currentViz.index }
    },
    canSeeDebugInfo() {
      return this.currentUser.canEditQuestion || (this.currentViz &&
        this.currentViz.settings && this.currentViz.settings.general &&
        this.currentViz.settings.general.can_viewer_see_query_terms)
    }
  },

  data() {
    const vizs = this.visualizations.details || { towardsVizLayout: true, details: [_.cloneDeep(newVisualization)] }
    console.log(vizs)
    if (vizs.details.filter(viz => viz.current).length === 0) {
      vizs.details[0].current = true
    }
    this.$emit('update:visualizations', { towardsBaseRenderer: false, details: vizs })

    let baseIconClass = "tw-border  tw-pb-1 tw-px-2 tw-rounded-sm tw-mx-0.5"
    let iconClass = baseIconClass + " tw-border-default/20 tw-bg-secondary tw-text-default"
    let iconActiveClass = baseIconClass + " tw-border-primary tw-bg-primary tw-text-white"
    let settingsCategories = ['visualization', 'general']
    return {
      iconActiveClass: iconActiveClass,
      iconClass: iconClass,
      settingsPanesize: 0,
      results: null,
      showSettings: false,
      componentDefs: _.cloneDeep(newComponentDefs),
      visualizationsLocal: vizs,
      currentViz: vizs.details.filter((item) => item.current)[0],
      showQuery: this.error === null ? true : false,
      showDebugInfo: this.error === null ? false : true,
      apiActionsQuesLevel: null,
      openAddToDashboard: false,
      currentUser: currentUser,
      settingsCategory: 'visualization',
      settingsCategories: settingsCategories.map(s => {
        return { name: s, value: s }
      })
    }
  },

  methods: {
    updateProps() {
      const results = resultsStore()
      if (this.resultsKey && this.dataLoaded) {
        this.results = results.getResults(this.resultsKey)
      }
    },
    addFilter(filter) {
      if (!this.currentViz.queryTerms.details) {
        this.currentViz.queryTerms = { towardsQTLayout: true, details: _.cloneDeep(newQueryTerms) }
      }
      this.currentViz.queryTerms.details.filters.details.push(filter)
      this.currentViz.queryTerms.towardsQTLayout = true
    },
    addSorting(sorting) {
      if (!this.currentViz.queryTerms.details) {
        this.currentViz.queryTerms = { towardsQTLayout: true, details: _.cloneDeep(newQueryTerms) }
      }
      this.currentViz.queryTerms.details.sortings.details.push(sorting)
      this.currentViz.queryTerms.towardsQTLayout = true
    }
  },


  mounted() {
    this.updateProps()
  },

}
</script>
