<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="large"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      :loadingMessage="loadingMessage"
    >
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">Add a Widget</div>
      </template>
      <template #body>
        <div class="tw-flex tw-min-h-[400px]">
          <div class="tw-border-r">
            <div
              class="menu-item tw-flex tw-gap-2 tw-items-center tw-px-4 tw-py-2"
              @click="editing = 'visualization'"
            >
              <ChartBarIcon class="icon-primary" size="20" />
              Visualization
            </div>
            <div
              class="menu-item tw-flex tw-gap-2 tw-items-center tw-px-4 tw-py-2"
              @click="editing = 'variable'"
            >
              <CodeDotsIcon class="icon-primary" size="20" />

              Variable
            </div>
            <div
              class="menu-item tw-flex tw-gap-2 tw-items-center tw-px-4 tw-py-2"
              @click="editing = 'note'"
            >
              <NotesIcon class="icon-primary" size="20" />
              Note
            </div>
            <div
              class="menu-item tw-flex tw-gap-2 tw-items-center tw-px-4 tw-py-2"
              @click="editing = 'tabs'"
            >
              <TableOptionsIcon class="icon-primary" size="20" />
              Tabs
            </div>
          </div>
          <div class="tw-flex-1" v-if="editing == 'note'">
            <AGEditorWithoutModal v-model:content="noteContent" />
          </div>
          <div
            class="tw-flex tw-flex-col tw-flex-1"
            v-if="editing == 'visualization'"
          >
            <div class="tw-flex tw-items-center tw-p-2">
              <Multiselect
                class="tw-w-[500px]"
                :classes="multiselectCss"
                v-model="visualizationID"
                placeholder="Search a visualization"
                :filter-results="false"
                :min-chars="1"
                :resolve-on-load="false"
                :delay="0"
                :searchable="true"
                :options="searchViz"
              />
            </div>
            <div
              class="tw-flex tw-items-center tw-p-2 tw-flex-1 tw-justify-center tw-overflow-auto tw-w-full tw-max-w-[calc(90vw-60px)]"
            >
              <template v-if="!visualizationID">
                Please select a Visualization first.
              </template>
              <template v-else>
                <VizComponent
                  onDashboard="true"
                  :results="results"
                  :resultsKey="resultskey"
                  :queryKey="queryKey"
                  :visualization="viz"
                  :apiActionsQuesLevel="apiActions"
                  :size="size"
                  :apiResponse="apiResponse"
                  :loading="loadingViz"
                  class="tw-w-full tw-h-full tw-overflow-auto"
                />
              </template>
            </div>
          </div>
          <div class="tw-flex-1 tw-px-4 tw-py-2" v-if="editing == 'tabs'">
            <TabsConfigWithoutModal v-model:tabsConfig="tabsConfig" />
          </div>
          <div class="tw-flex-1" v-if="editing == 'variable'">
            <VariablePaneSettings
              :dashboard="dashboard"
              @addVariablePane="(panes) => (variablePanes = panes)"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary"
            @clicked="$emit('update:open', false)"
          >
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary"
            @clicked="(addWidget() || true) && $emit('update:open', false)"
            :disabled="!submitEnabled"
          >
            Add to Dashboard
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>
</template>

<script>
import AGModal from 'components/utils/modal.vue';
import AGEditorWithoutModal from 'components/widgets/editNoteWithoutModal.vue';
import TabsConfigWithoutModal from 'components/widgets/editTabsWithoutModal.vue';
import VariablePaneSettings from 'components/dashboard/variableSettings.vue';
import { searchVisualizations } from 'src/apis/visualization.ts';
import Multiselect from '@vueform/multiselect';
import multiselectClasses from 'src/helpers/multiselectCss.ts';
import VizComponent from 'components/visualizations/viz.vue';
import AGButton from 'components/base/button.vue';

import {
  ChartBarIcon,
  CodeDotsIcon,
  NotesIcon,
  TableOptionsIcon,
} from 'vue-tabler-icons';
import { fetchViz, fetchVizResults } from 'src/apis/visualization';
import { sessionStore } from 'src/stores/session';
import { resultsStore } from 'src/stores/results';

const newTabConfig = {
  tabs: [
    { name: 'Tab 1', conditionValue: 1, default: true, dashboardID: null },
    { name: 'Tab 2', conditionValue: 2, dashboardID: null },
    { name: 'Tab 3', conditionValue: 3, dashboardID: null },
  ],
  hideTabs: false,
  decidingParam: 'param',
};

const session = sessionStore();
export default {
  name: 'AGAddWidget',
  props: ['open', 'dashboard'],
  components: {
    AGModal,
    ChartBarIcon,
    CodeDotsIcon,
    NotesIcon,
    TableOptionsIcon,
    AGEditorWithoutModal,
    TabsConfigWithoutModal,
    VariablePaneSettings,
    Multiselect,
    VizComponent,
    AGButton,
  },
  data() {
    return {
      editing: 'visualization',
      noteContent: '',
      visualizationID: null,
      tabsConfig: newTabConfig,
      variablePanes: [],
      visualizationOptions: [],
      viz: null,
      multiselectCss: multiselectClasses,
      session: session,
      resultsKey: null,
      apiResponse: null,
      loadingViz: null,
    };
  },

  watch: {
    resultsKey() {
      this.updateProps();
    },
    visualizationID() {
      fetchViz(this.visualizationID, this.session, this.setViz);
    },

    viz() {
      fetchVizResults(
        this.visualizationID,
        null,
        {},
        this.session,
        this.setResults
      );
    },
  },

  computed: {
    submitEnabledForNote() {
      if (this.editing != 'note') {
        return true;
      }

      return !!this.noteContent;
    },
    submitEnabledForViz() {
      if (this.editing != 'visualization') {
        return true;
      }

      return !!this.visualizationID;
    },

    submitEnabledForTabs() {
      if (this.editing != 'tabs') {
        return true;
      }
      return this.tabsConfig.tabs
        .map((t) => {
          return t.dashboardID;
        })
        .reduce((a, b) => !!a && !!b, true);
    },

    submitEnabledForVariable() {
      if (this.editing != 'variable') {
        return true;
      }
      return this.variablePanes
        .map((vp) => {
          return vp.displayShow;
        })
        .reduce((a, b) => !!a && !!b, true);
    },
    submitEnabled() {
      return (
        this.submitEnabledForNote &&
        this.submitEnabledForViz &&
        this.submitEnabledForTabs &&
        this.submitEnabledForVariable == true
      );
    },
  },
  methods: {
    updateProps() {
      this.apiResponse = null;
      this.results = null;
      const results = resultsStore();
      if (this.resultsKey) {
        const response = results.getResults(this.resultsKey);
        if (response?.rows || response?.message) {
          this.results = response;
          return;
        }
        this.apiResponse = response;
      }
    },
    setViz(viz) {
      this.viz = viz;
    },
    setResults(resultsKey, _, loading) {
      this.loadingViz = loading;
      this.resultsKey = resultsKey;
    },
    addWidget() {
      if (this.editing == 'visualization') {
        this.$emit('addWidget', {
          type: 'visualization',
          visualizationID: this.visualizationID,
        });
      } else if (this.editing == 'note') {
        this.$emit('addWidget', {
          type: 'note',
          noteContent: this.noteContent,
        });
      } else if (this.editing == 'tabs') {
        this.$emit('addWidget', {
          type: 'tabs',
          tabsConfig: this.tabsConfig,
        });
      } else if (this.editing == 'variable') {
        this.$emit('addWidget', {
          type: 'variable',
          variablePanes: this.variablePanes,
        });
      }
      this.reset();
    },
    reset() {
      (this.visualizationID = null), (this.editing = 'visualization');
      this.noteContent = '';
      this.visualizationID = null;
      this.tabsConfig = newTabConfig;
      this.variablePanes = [];
    },
    async searchViz(q) {
      return searchVisualizations(q, (visualizations) => {
        if (visualizations) {
          return visualizations.map((viz) => {
            return { label: viz.cannonical_name, value: viz.id };
          });
        }
        return [];
      });
    },
  },
};
</script>
