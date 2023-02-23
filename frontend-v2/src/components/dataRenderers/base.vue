<template>
  <div
    class="tw-w-full tw-bg-white tw-rounded-sm tw-border tw-shadow-sm tw-flex tw-min-h-[600px]"
    v-if="startingPage || !currentViz"
  >
    <div class="tw-text-2xl tw-m-auto">
      Wanna See Something Cool? Run a Query!
    </div>
  </div>
  <AGLoader
    class="tw-min-h-[450px] tw-bg-white tw-shadow-sm tw-rounded-sm"
    text="Initializing"
    v-if="loading && !results"
  />
  <div
    class="tw-w-full tw-bg-secondary"
    v-if="(results || apiResponse) && currentViz"
  >
    <VisualizationLayout
      class="tw-mb-2"
      v-model:visualizations="visualizationsLocal"
      @deleteViz="(index) => $emit('deleteViz', index)"
      @fetchVizResults="(viz) => $emit('fetchVizResults', viz)"
      :quesConfig="question && question.config"
      v-if="currentViz"
    >
    </VisualizationLayout>
    <splitpanes
      class="pane-wrapper default-theme tw-flex !tw-h-full tw-mb-[35px]"
      id="results-view"
      ref="chart-parent"
      @resize="settingsPanesize = 100 - $event[0].size"
    >
      <pane
        :size="100"
        class="pane tw-flex tw-flex-col"
        :class="showSettings ? 'pane-left' : ''"
      >
        <QBHorizontalLayout
          :columns="results?.original_query_columns || results?.columns"
          :rows="results?.rows"
          :colDetails="results?.column_details"
          :resultsKey="resultskey"
          class="tw-mb-[10px] tw-shadow-sm tw-border tw-rounded-sm"
          v-model:queryTerms="currentViz.queryTerms"
          :key="rerenderKey"
          :vizConfig="currentViz?.settings?.general"
          :quesConfig="question && question?.config"
          :hideQueryTerms="apiResponse"
          v-if="currentViz"
        >
          <template #actions>
            <div class="tw-inline tw-px-0.5 tw-h-[30px]">
              <span
                class="tw-cursor-pointer"
                :class="iconActiveClass"
                @click="$emit('updateViz', currentViz)"
              >
                <q-tooltip transition-show="scale" transition-hide="scale">
                  Run Query
                </q-tooltip>
                <PlayerPlayIcon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
            <div class="tw-inline tw-px-0.5 tw-h-[30px]">
              <span
                class="tw-cursor-pointer"
                :class="showDebugInfo ? iconActiveClass : iconClass"
                @click="
                  ((showDebugInfo = !showDebugInfo) || true) &&
                    (showQuery = true)
                "
                v-if="canSeeDebugInfo"
              >
                <q-tooltip transition-show="scale" transition-hide="scale">
                  Show Debug Info
                </q-tooltip>
                <CodeIcon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
            <div
              class="tw-inline tw-px-0.5 tw-h-[30px]"
              v-if="apiResponse && canSeeDebugInfo"
            >
              <span
                class="tw-cursor-pointer"
                :class="[showApiResponse ? iconActiveClass : iconClass]"
                @click="showApiResponse = !showApiResponse"
              >
                <q-tooltip transition-show="scale" transition-hide="scale">
                  Show Api Response Pane
                </q-tooltip>
                <CodePlusIcon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
            <div
              class="tw-inline tw-px-0.5 tw-h-[30px]"
              v-if="results && results.rows && canSeeDebugInfo"
            >
              <span
                class="tw-cursor-pointer"
                :class="[showSettings ? iconActiveClass : iconClass]"
                @click="showSettings = !showSettings"
              >
                <q-tooltip transition-show="scale" transition-hide="scale">
                  Show Settings Pane
                </q-tooltip>
                <SettingsIcon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
            <div
              class="tw-inline tw-px-0.5 tw-h-[30px]"
              v-if="
                results &&
                results.rows &&
                results.rows.length > 0 &&
                currentUser.canDownload &&
                !currentUser.canCreateDashboard
              "
            >
              <span
                class="tw-cursor-pointer"
                :class="[showSettings ? iconActiveClass : iconClass]"
                @click="$emit('download')"
              >
                <q-tooltip transition-show="scale" transition-hide="scale">
                  Download
                </q-tooltip>
                <DownloadIcon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
            <div
              class="tw-inline tw-px-0.5 tw-h-[30px]"
              v-if="
                results &&
                results.rows &&
                currentUser.canDownload &&
                currentUser.canCreateDashboard
              "
            >
              <span class="tw-cursor-pointer" :class="iconClass">
                <q-tooltip transition-show="scale" transition-hide="scale">
                  More Actions
                </q-tooltip>
                <q-menu
                  flat="true"
                  transition-show="scale"
                  transition-hide="scale"
                  max-height="900px"
                  :offset="[0, 5]"
                  class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                  @show="menuShow"
                  @keydown="onKeydown"
                  auto-close
                >
                  <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                    <div
                      @click="$emit('download')"
                      v-if="currentUser.canDownload"
                      class="tw-py-1 tw-cursor-pointer tw-whitespace-nowrap tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                    >
                      <DownloadIcon size="16" class="icon-primary tw-mr-2" />
                      <span class="">Download</span>
                    </div>
                    <div
                      @click="openAddToDashboard = true"
                      v-if="currentUser.canCreateDashboard"
                      class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                    >
                      <DashboardIcon size="16" class="icon-primary tw-mr-2" />
                      <span class="">Add To Dashboard</span>
                    </div>
                  </div>
                </q-menu>
                <Menu2Icon class="tw-h-3 tw-w-3 tw-inline" />
              </span>
            </div>
          </template>
        </QBHorizontalLayout>
        <AGLoader
          text="Updating"
          v-if="loading"
          class="tw-bg-white tw-border tw-shadow-sm tw-rounded-sm tw-flex-[1_1_100%] tw-min-h-[400px]"
        />
        <div
          class="tw-flex-[1_1_100%] tw-flex tw-flex-col tw-shadow-sm"
          v-if="!loading"
        >
          <DebugInfo
            :query="results?.final_query"
            :query_type="results?.query_type || 'sql'"
            v-model:showQuery="showQuery"
            :fromCache="results?.from_cache"
            :cacheUpdatedAt="results?.cache_updated_at"
            :cachedUntil="results?.cached_until"
            class="tw-border tw-mb-[10px] tw-bg-white"
            v-if="showDebugInfo && canSeeDebugInfo && currentViz"
            :key="{ q: results?.finalQuery }"
          />
          <div id="settings-container"></div>
          <div class="tw-flex">
            <splitpanes
              class="pane-wrapper default-theme tw-flex !tw-h-full tw-mb-[35px]"
              id="results-view"
              ref="chart-parent"
              @resize="settingsPanesize = 100 - $event[0].size"
            >
              <pane
                :size="30"
                ref="chart"
                class="pane pane-left tw-shadow-sm !tw-border tw-h-full"
                v-if="apiResponse && showApiResponse && currentViz"
              >
                <ApiResponseViewer
                  class="tw-h-full"
                  :apiResponse="apiResponse"
                  v-model:jsonPath="currentViz.settings.jsonPath"
                  v-if="apiResponse"
                  :results="results"
                  @update:results="updateResults"
                />
              </pane>
              <pane
                :size="100"
                ref="chart"
                class="pane tw-shadow-sm !tw-border"
                :class="apiResponse && showApiResponse ? 'pane-right' : ''"
              >
                <VizComponent
                  :results="results"
                  :resultsKey="resultskey"
                  :queryKey="queryKey"
                  v-model:visualization="currentViz"
                  :apiActionsQuesLevel="apiActionsQuesLevel"
                  :questionID="questionID"
                  :size="settingsPanesize"
                  class="tw-overflow-auto tw-shadow-sm tw-border tw-bg-white tw-rounded-sm tw-flex-[1_1_100%] tw-min-h-[400px] tw-h-full"
                  @addFilter="(filter) => addFilter(filter)"
                  @addSorting="(sorting) => addSorting(sorting)"
                  :showSettings="
                    showSettings &&
                    results.rows &&
                    results.rows.length > 0 &&
                    !loading &&
                    canSeeDebugInfo
                  "
                  @updatedSettings="(val) => (settingsFromViz = val)"
                  :key="rerenderKey"
                  v-if="
                    currentViz &&
                    // showSettings &&
                    results?.rows &&
                    results?.rows?.length > 0 &&
                    !loading &&
                    canSeeDebugInfo
                  "
                />
              </pane>
            </splitpanes>
          </div>
        </div>
      </pane>
      <pane
        :size="30"
        ref="chart"
        class="pane pane-right tw-shadow-sm !tw-border"
        v-if="
          showSettings &&
          results?.rows &&
          results?.rows?.length > 0 &&
          !loading &&
          canSeeDebugInfo
        "
      >
        <div
          class="tw-bg-white tw-border-b-2 tw-border-primary"
          v-if="currentUser.canEditQuestion && questionID"
        >
          <BoxSelect
            :options="settingsCategories"
            :selected="settingsCategory"
            @selected="(val) => (settingsCategory = val)"
            class="tw-pt-2 tw-text-center"
          />
        </div>
        <div
          class="tw-h-full tw-bg-white"
          v-if="settingsCategory === 'general'"
        >
          <VizConfig
            v-model:vizConfig="currentViz.settings.general"
            :quesConfig="question && question.config"
            v-if="currentUser.canEditQuestion && questionID"
            :key="vizConfigRenderKey"
          />
        </div>

        <div
          class="tw-bg-white tw-h-full"
          v-if="settingsCategory === 'visualization'"
        >
          <ChartToolbar
            :showSettings="showSettings"
            :rendererType="currentViz.rendererType"
            @setRendererType="(val) => (currentViz.rendererType = val)"
          />
          <component
            :is="componentDefs[currentViz.rendererType]['settingsComponent']"
            class="tw-bg-white tw-overflow-auto tw-rounded-sm"
            @settings="
              (val) => (currentViz.settings[currentViz.rendererType] = val)
            "
            :columns="results.columns"
            :rows="results.rows"
            :colDetails="results.column_details"
            :queryKey="queryKey"
            :apiActionsVizLevel="apiActionsVizLevel"
            :apiActionsQuesLevel="apiActionsQuesLevel"
            :additionalProps="
              componentDefs[currentViz.rendererType]['additionalProps']
            "
            :questionID="questionID"
            :visualizationID="currentViz.id"
            :settings="currentViz.settings[currentViz.rendererType]"
            :settingsFromViz="settingsFromViz"
            :size="settingsPanesize"
            @updateApiActions="$emit('updateApiActions')"
            :key="rerenderKey"
          />
          <template v-if="apiResponse && currentViz">
            <div class="label tw-px-4">JSONPath</div>
            <AGInput
              class="tw-px-4"
              v-model:value="currentViz.settings.jsonPath"
            />
            <div class="note tw-px-4">
              JsonPath is a way of extracting data from json response. You can
              read more about it.
              <a
                href=""
                class="tw-cursor-pointer tw-text-primary"
                target="_blank"
              >
                here </a
              >. Use this field to customize the data extracted. Alternatively,
              You can click on any key in API response pane.
            </div>
          </template>
        </div>
      </pane>
    </splitpanes>
  </div>
  <AddToDashboard
    v-model:open="openAddToDashboard"
    :visualizationID="currentViz.id"
    :queryKey="queryKey"
    v-if="currentViz"
  />
  <!-- <AGQuestionsSettings v-model:open="showQuestionSettingsModal" v-model:question="question" @saveQuestion="saveQuestion" -->
  <!--   v-if="questionID" :key="showQuestionSettingsModal" /> -->
</template>

<script>
import ChartToolbar from 'components/dataRenderers/chartToolbar.vue';
import ApiResponseViewer from 'components/dataRenderers/charts/apiResponse.vue';

import QBHorizontalLayout from 'components/queryTerms/layout.vue';
import BoxSelect from 'components/base/boxSelect.vue';

import VizComponent from 'components/visualizations/viz.vue';
import AddToDashboard from 'components/dashboard/addToDashboard.vue';
import VizConfig from 'components/visualizations/settings.vue';
import AGInput from 'components/base/input.vue';

import {
  SettingsIcon,
  CodeIcon,
  PlayerPlayIcon,
  Menu2Icon,
  DownloadIcon,
  DashboardIcon,
  CodePlusIcon,
} from 'vue-tabler-icons';
import AGLoader from 'components/utils/loader.vue';
import VisualizationLayout from 'components/dataRenderers/visualizationsLayout.vue';
import DebugInfo from 'components/dataRenderers/defugInfo.vue';
import AGQuestionsSettings from 'components/question/settings.vue';
import { _ } from 'lodash';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { resultsStore } from 'stores/results';
import { apiActionStore } from 'stores/apiActions';
import { currentUserStore } from 'src/stores/currentUser';

import isEqual from 'lodash/isEqual';

import { newComponentDefs } from 'src/helpers/componentDefs';
import { newQueryTerms } from 'src/helpers/qtHelpers';
import { newSettings, newVisualization } from 'src/helpers/visualization';
import { queryStore } from 'src/stores/query';
import { extractResultsFromJsonPath } from 'src/helpers/jsonPath';

const currentUser = currentUserStore();
export default {
  name: 'BaseDataRenderer',
  components: {
    VisualizationLayout,
    DebugInfo,
    AGLoader,
    VizComponent,
    ChartToolbar,
    QBHorizontalLayout,
    Splitpanes,
    Pane,
    PlayerPlayIcon,
    SettingsIcon,
    CodeIcon,
    Menu2Icon,
    CodePlusIcon,
    AddToDashboard,
    DashboardIcon,
    DownloadIcon,
    BoxSelect,
    VizConfig,
    AGQuestionsSettings,
    ApiResponseViewer,
    AGInput,
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
    startingPage: {},
    question: {},
  },

  watch: {
    resultsKey() {
      this.updateProps();
    },

    jsonPath() {
      const extracted = extractResultsFromJsonPath(
        this.apiResponse,
        this.jsonPath
      );

      extracted.success && (this.results = extracted.results);
    },
    apiResponse() {
      const extracted = extractResultsFromJsonPath(
        this.apiResponse,
        this.jsonPath
      );

      extracted.success && (this.results = extracted.results);
    },
    apiActionKeyQuesLevel() {
      const apiActions = apiActionStore();
      this.apiActionsQuesLevel = apiActions.get(this.apiActionKeyQuesLevel);
    },
    apiActionKeyVizLevel() {
      const apiActions = apiActionStore();
      this.apiActionsVizLevel = apiActions.get(this.apiActionKeyVizLevel);
    },
    dataLoaded() {
      this.updateProps();
    },
    showApiResponse() {
      if (this.showApiResponse) {
        this.showSettings = false;
      }
    },
    showSettings() {
      this.settingsPanesize = this.showSettings ? 30 : 0;
      if (this.showSettings) {
        this.showApiResponse = false;
      }
    },
    visualizations: {
      deep: true,
      handler() {
        if (!isEqual(this.visualizations, this.visualizationsLocal)) {
          this.visualizationsLocal = this.visualizations?.details || {
            details: null,
          };
        }
      },
    },
    visualizationsLocal: {
      deep: true,
      handler() {
        if (!this.visualizationsLocal) {
          this.visualizationsLocal = this.visualizations?.details || {
            towardsVizLayout: true,
            details: [_.cloneDeep(newVisualization)],
          };
          if (vizs.details.filter((viz) => viz.current).length === 0) {
            vizs.details[0].current = true;
          }
        }
        this.visualizationsLocal?.details?.forEach((viz) => {
          if (!viz.settings) {
            viz.settings = _.cloneDeep(newSettings);
          }
          if (!viz.queryTerms) {
            viz.queryTerms = _.cloneDeep(newQueryTerms);
          }
        });
        this.currentViz = this.visualizationsLocal?.details?.filter(
          (viz) => viz.current
        )[0];
        if (
          !this.currentViz & this.visualizationsLocal?.details &&
          this.visualizationsLocal?.details?.length > 0
        ) {
          this.visualizationsLocal.details[0].current = true;
          this.currentViz = this.visualizationsLocal.details[0];
        }
        if (this.currentViz) {
          let index = -1;
          this.visualizationsLocal?.details &&
            this.visualizationsLocal?.details.forEach((viz, i) => {
              viz.current && (index = i);
            });
          this.currentViz.index = index;
        }
        this.$emit('update:visualizations', {
          towardsBaseRenderer: false,
          details: this.visualizationsLocal,
        });
      },
    },

    error() {
      if (this.error != null) {
        (this.showDebugInfo = true), (this.showQuery = false);
        return;
      }
      (this.showDebugInfo = false), (this.showQuery = true);
    },

    rendererType() {
      this.visualizationsLocal.towardsVizLayout = true;
    },
  },

  computed: {
    jsonPath() {
      return this.currentViz?.settings?.jsonPath || '';
    },
    rendererType() {
      return this.currentViz?.rendererType;
    },
    rerenderKey() {
      return {
        rendererType: this.currentViz?.rendererType,
        index: this.currentViz?.index,
        resultsKey: this.resultsKey,
        apiActionKeyQuesLevel: this.apiActionKeyQuesLevel,
        results: this.results,
      };
    },
    vizConfigRenderKey() {
      let renderKey = _.cloneDeep(this.rerenderKey);
      renderKey.quesConfig = this.question && this.question.config;
      return renderKey;
    },
    canSeeDebugInfo() {
      if (this.currentUser.canEditQuestion) {
        return true;
      }
      if (
        !(
          this.currentViz &&
          this.currentViz.settings &&
          this.currentViz.settings.general
        )
      ) {
        if (
          this.question &&
          this.question.config &&
          this.question.config.can_viewers_change_query_terms != null
        ) {
          return this.question.config.can_viewers_change_query_terms;
        }
      }
      if (
        this.currentViz &&
        this.currentViz.settings &&
        this.currentViz.settings.general &&
        this.currentViz.settings.general.can_viewers_change_query_terms != null
      ) {
        return this.currentViz.settings.general.can_viewers_change_query_terms;
      }
      return true;
    },
  },

  data() {
    const vizs = this.visualizations?.details || {
      towardsVizLayout: true,
      details: [_.cloneDeep(newVisualization)],
    };
    if (vizs.details.filter((viz) => viz.current).length === 0) {
      vizs.details[0].current = true;
    }
    this.$emit('update:visualizations', {
      towardsBaseRenderer: false,
      details: vizs,
    });

    let baseIconClass = 'tw-border  tw-pb-1 tw-px-2 tw-rounded-sm tw-mx-0.5';
    let iconClass =
      baseIconClass + ' tw-border-default/20 tw-bg-secondary tw-text-default';
    let iconActiveClass =
      baseIconClass + ' tw-border-primary tw-bg-primary tw-text-white';
    let settingsCategories = ['visualization', 'general'];
    return {
      iconActiveClass: iconActiveClass,
      iconClass: iconClass,
      settingsPanesize: 0,
      results: null,
      apiResponse: null,
      showSettings: false,
      componentDefs: _.cloneDeep(newComponentDefs),
      visualizationsLocal: vizs,
      currentViz: vizs.details.filter((item) => item.current)[0],
      showQuery: this.error === null ? true : false,
      showDebugInfo: this.error === null ? false : true,
      apiActionsQuesLevel: null,
      openAddToDashboard: false,
      currentUser: currentUser,
      showQuestionSettingsModal: false,
      settingsCategory: 'visualization',
      settingsFromViz: null,
      settingsCategories: settingsCategories.map((s) => {
        return { name: s, value: s };
      }),
      showApiResponse: true,
    };
  },

  methods: {
    updateProps() {
      this.apiResponse = null;
      this.results = null;
      const results = resultsStore();
      if (this.resultsKey && this.dataLoaded) {
        const response = results.getResults(this.resultsKey);
        if (response?.rows) {
          this.results = response;
          return;
        }
        this.apiResponse = response;
      }
    },
    addFilter(filter) {
      if (!this.currentViz.queryTerms.details) {
        this.currentViz.queryTerms = {
          towardsQTLayout: true,
          details: _.cloneDeep(newQueryTerms),
        };
      }
      this.currentViz.queryTerms.details.filters.details.push(filter);
      this.currentViz.queryTerms.towardsQTLayout = true;
    },
    addSorting(sorting) {
      if (!this.currentViz.queryTerms.details) {
        this.currentViz.queryTerms = {
          towardsQTLayout: true,
          details: _.cloneDeep(newQueryTerms),
        };
      }
      this.currentViz.queryTerms.details.sortings.details.push(sorting);
      this.currentViz.queryTerms.towardsQTLayout = true;
    },

    updateResults(results) {
      this.results = results;
      console.log(results);
    },
  },

  mounted() {
    this.updateProps();
    if (this.questionID) {
      const query = queryStore().get(this.queryKey);
      const apiActions = apiActionStore();
      this.apiActionsQuesLevel = apiActions.get(this.apiActionKeyQuesLevel);
    }
  },
};
</script>
