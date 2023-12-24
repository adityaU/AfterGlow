<template>
  <div class="tw-flex tw-h-full" ref="dashboard">
    <AGLoader :text="loaderText" v-if="loading" />
    <div class="tw-w-full" v-if="!loading">
      <splitpanes
        class="pane-wrapper default-theme tw-flex"
        ref="chart-parent"
        @resize="settingsPanesize = 100 - $event[0].size"
        :style="panesStyle"
      >
        <pane
          :size="100"
          class="pane !tw-overflow-y-auto"
          :class="showSettings ? 'pane-left' : ''"
        >
          <AGDgrid
            :dashboardID="dashboardID"
            :dashboardKey="dashboardKey"
            :dashboardModel="dashboardModel"
            :addNoteCount="addNoteCount"
            :addTabsCount="addTabsCount"
            :variablePanes="variablePanes"
            :saveCount="saveCount"
            :editModeModel="editModeModel"
            :addWidgetData="addWidgetData"
            v-model:editingWidget="editingWidget"
            :queryKey="queryKey"
            @update:dashboardModel="(v) => $emit('update:dashboardModel', v)"
          />
        </pane>
        <pane
          :size="settingsPanesize"
          ref="chart"
          class="pane pane-right !tw-border"
          v-if="settingsPanesize"
        >
          <div id="dashboard-settings" class="card" style="settingsPaneStyle">
            <AGContainerSettings
              v-model:formattingSettings="editingWidget.formattingSettings"
              @hide="hideContainerSettings"
              :key="editingWidget"
              class="tw-rounded-2xl tw-border tw-bg-white"
              v-if="editingWidget"
            />
            <AGVariablePane
              :dashboard="dashboardModel"
              @update:dashboard="(v) => $emit('update:dashboardModel', v)"
              v-if="showVariablePane"
              @addVariablePane="(panes) => (variablePanes = panes)"
            />
          </div>
        </pane>
      </splitpanes>
    </div>

    <AGScheduler
      v-model:open="showScheduleDashboard"
      :query="query"
      :entityID="dashboardID"
      entityName="dashboards"
      :entityTitle="dashboardModel?.title"
    />
  </div>
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AGDgrid from 'components/dashboard/dGrid.vue';
import AGScheduler from 'components/schedulers/scheduleModal.vue';
import AGVariablePane from 'components/dashboard/variableSettings.vue';
import AGContainerSettings from 'components/dashboard/containerSettings.vue';
import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';
import { queryStore } from 'src/stores/query';

import { convertWidgets } from 'src/helpers/dashboard';

import { dashboardsStore } from 'stores/dashboard';
import { saveDashboard } from 'src/apis/dashboards';
import { _ } from 'lodash';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

import { randomID } from 'src/helpers/random';
import { sessionStore } from 'src/stores/session';
const dashboard = dashboardsStore();

const query = queryStore();
const defaultLoaderText = 'Fetching dashboard';

const session = sessionStore();

export default {
  name: 'AGDashboardGrid',
  props: [
    'dashboardKey',
    'queryKey',
    'dashboardID',
    'dashboardModel',
    'editModeModel',
    'showScheduleReport',
    'saveCount',
    'fullScreenCount',
    'toggleVariablePaneCount',
    'addNoteCount',
    'addTabsCount',
    'addWidgetData',
  ],
  components: {
    AGLoader,
    Splitpanes,
    Pane,
    AGScheduler,
    AGContainerSettings,
    AGVariablePane,
    AGDgrid,
  },

  watch: {
    fullScreenCount() {
      this.toggleFullScreen();
    },
    toggleVariablePaneCount() {
      this.showVariablePane = !this.showVariablePane;
    },
    showScheduleDashboard() {
      if (this.showScheduleDashboard != this.showScheduleReport) {
        this.$emit('update:showScheduleReport', this.showScheduleDashboard);
      }
    },
    showScheduleReport() {
      this.showScheduleDashboard = this.showScheduleReport;
    },
  },

  data() {
    return {
      query: session,
      draggable: true,
      resizable: true,
      editMode: false,
      dashboard: null,
      loading: false,
      loaderText: defaultLoaderText,
      resizeTimer: 0,
      resizeArgs: [],
      gridClass: null,
      counter: 0,
      showScheduleDashboard: false,
      showVariablePane: false,
      editingWidget: null,
      fullScreen: false,
      variablePanes: null,
    };
  },

  mounted() {
    window.addEventListener('fullscreenchange', (event) => {
      this.fullScreen = !this.fullScreen;
    });
  },

  computed: {
    panesStyle() {
      if (this.fullScreen) {
        return {
          top: '0px',
        };
      }
      if (!this.editMode) {
        return {
          top: '130px',
        };
      }

      return {
        top: '170px',
      };
    },
    settingsPaneStyle() {
      if (this.fullScreen) {
        return {
          height: '100vh',
        };
      }
      if (!this.editMode) {
        return {
          height: 'calc(100vh - 175px)',
        };
      }

      return {
        height: 'calc(100vh - 215px)',
      };
    },
    settingsPanesize() {
      if (this.editingWidget) {
        return 25;
      }
      return 0;
    },
  },

  methods: {
    showContainerSettings(widget) {
      this.editingWidget = widget;
    },
    hideContainerSettings() {
      // this.settingsPanesize = 0
      this.editingWidget = null;
    },
    toggleFullScreen() {
      this.$refs['dashboard'].requestFullscreen();
    },
  },
};
</script>

<style lang="scss">
.dashboard-grid-stack > .grid-stack-item {
  $gridstack-columns: 480;

  min-width: 100% / $gridstack-columns;

  @for $i from 0 through $gridstack-columns {
    &[gs-w='#{$i}'] {
      width: (100% / $gridstack-columns) * $i;
    }
    &[gs-x='#{$i}'] {
      left: (100% / $gridstack-columns) * $i;
    }
    &[gs-min-w='#{$i}'] {
      min-width: (100% / $gridstack-columns) * $i;
    }
    &[gs-max-w='#{$i}'] {
      max-width: (100% / $gridstack-columns) * $i;
    }
  }
}
</style>
