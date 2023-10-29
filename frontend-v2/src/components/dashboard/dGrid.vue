<template>
  <div
    class="dashboard-grid-stack grid-stack tw-w-full tw-flex tw-h-full"
    :class="gridClass"
    ref="grid"
  >
    <template v-for="(widget, index) in widgets" :key="widget.widID">
      <GridWidget
        v-bind="widget"
        :widSize="widget.size"
        v-model:widID="widget.widID"
        :queryKey="queryKey"
        :id="widgetKey(widget, index)"
        :editMode="editMode"
        class="js-grid-widget"
        :isEditing="editingWidget === widget"
        @widgetDeleted="deleteWidget"
        :gridSize="settingsPanesize"
        :isNested="isNested"
        :widget="widget"
        @update:widget="(v) => updateWidget(v, index)"
      >
        <SettingsIcon
          class="tw-cursor-pointer"
          size="16"
          v-if="editMode"
          @click="showContainerSettings(widget)"
        />
        <ArrowsMoveIcon
          size="14"
          class="grid-drag tw-cursor-move"
          v-if="editMode"
        />
      </GridWidget>
    </template>
  </div>
</template>
<script>
import GridWidget from 'components/dashboard/gridWidget.vue';
import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';
import { queryStore } from 'src/stores/query';

import { convertWidgets } from 'src/helpers/dashboard';

import { dashboardsStore } from 'stores/dashboard';
import { saveDashboard } from 'src/apis/dashboards';
import { _ } from 'lodash';
import { isEqual } from 'lodash';

import 'splitpanes/dist/splitpanes.css';

import { SettingsIcon, ArrowsMoveIcon } from 'vue-tabler-icons';
import { randomID } from 'src/helpers/random';
import { sessionStore } from 'src/stores/session';
const dashboard = dashboardsStore();

const query = queryStore();
const defaultLoaderText = 'Fetching dashboard';

export default {
  name: 'AGDGrid',
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
    'editingWidget',
    'variablePanes',
    'isNested',
    'gridClass',
  ],
  components: {
    GridWidget,
    SettingsIcon,
    ArrowsMoveIcon,
  },

  watch: {
    variablePanes: {
      deep: true,
      handler() {
        this.addVariablePane(this.variablePanes);
      },
    },
    addNoteCount() {
      this.addNote();
    },
    addTabsCount() {
      this.addTabs();
    },
    saveCount() {
      this.saveDashboard();
    },
    fullScreenCount() {
      this.toggleFullScreen();
    },
    toggleVariablePaneCount() {
      this.showVariablePane = !this.showVariablePane;
    },
    dashboardModel: {
      deep: true,
      handler() {
        if (!isEqual(this.dashboard, this.dashboardModel)) {
          this.dashboard = this.dashboardModel;
        }
      },
    },
    dashboard: {
      deep: true,
      handler() {
        if (!isEqual(this.dashboard, this.dashboardModel)) {
          this.$emit('update:dashboardModel', this.dashboard);
        }
      },
    },
    editModeModel() {
      this.editMode = this.editModeModel;
    },
    showScheduleReport() {
      this.showScheduleDashboard = this.showScheduleReport;
    },
    editMode() {
      // if (!this.editMode){ this.settingsPanesize = 0}
      this.initGridStack();
    },
    widgets: {
      deep: true,
      handler() {
        !this.loading && this.$nextTick(this.initGridStack);
        if (this.dashboard && this.dashboard.settings) {
          this.dashboard.settings.version = 2;
          this.dashboard.settings.widgets = this.widgets;
        }
      },
    },
    dashboardKey() {
      this.$nextTick(this.setupDashboard);
    },
    loading() {
      this.$nextTick(this.initGridStack);
    },
  },

  data() {
    return {
      grid: null,
      widgets: [],
      query: null,
      draggable: true,
      resizable: true,
      editMode: false,
      dashboard: null,
      loading: false,
      loaderText: defaultLoaderText,
      resizeTimer: 0,
      resizeArgs: [],
      counter: 0,
      showScheduleDashboard: false,
      showVariablePane: false,
      fullScreen: false,
    };
  },

  mounted() {
    this.query = sessionStore();
    this.setupDashboard();
    window.addEventListener('message', this.receiveMessage);
    window.addEventListener('fullscreenchange', (event) => {
      this.fullScreen = !this.fullScreen;
    });
  },

  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage);
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
      if (
        this.showScheduleDashboard ||
        this.editingWidget ||
        this.showVariablePane
      ) {
        return 25;
      }
      return 0;
    },
  },

  methods: {
    addVariablePane(panes) {
      this.widgets = this.widgets.filter((w) => w.type != 'variablePane');
      panes &&
        panes.forEach((pane) => {
          if (!pane.w) {
            pane.w = 12 * 40;
            pane.h = 5;
            pane.x = 0;
            pane.y = 0;
            this.widgets = this.widgets.map((w) => {
              w.y += 5;
              return w;
            });
          }
          this.widgets.push(pane);
        });
    },
    deleteWidget(widgetID) {
      this.widgets = this.widgets.filter(
        (w, i) => this.widgetKey(w, i) != widgetID
      );
      this.$nextTick(this.saveDashboard());
    },
    receiveMessage(event) {
      if (event.data.message == 'ag_edit_dashboard') {
        this.editMode = event.data.value;
      }
      if (event.data.message == 'ag_add_new_note') {
        this.addNote();
      }
      if (event.data.message == 'ag_save_dashboard') {
        this.saveDashboard();
      }
      // if (event.data.message == 'AGScheduleDashboard') {
      //   if (this.showScheduleDashboard){
      //     this.settingsPanesize = 0
      //   }else{
      //     this.settingsPanesize = 25
      //   }
      //   this.showScheduleDashboard = !this.showScheduleDashboard
      // }
    },
    showContainerSettings(widget) {
      this.showScheduleDashboard = false;
      // this.settingsPanesize = 25
      this.$emit('update:editingWidget', widget);
    },
    hideContainerSettings() {
      // this.settingsPanesize = 0
      this.$emit('update:editingWidget', null);
    },
    widgetKey(widget, index) {
      return 'widget_' + widget.type + '_' + index;
    },

    initGridStack() {
      this.$nextTick(() => {
        const gridClass = this.gridClass ? '.' + this.gridClass : '.grid-stack';
        this.grid && this.grid.destroy(false);
        if (this.$refs['grid']) {
          this.grid = GridStack.init(
            {
              cellHeight: '10',
              draggable: {
                handle: '.grid-drag',
              },
              resizable: {
                handles: 'n,ne,e,se,s,sw,w,nw',
              },
              column: 480,
              staticGrid: this.isNested ? true : !this.editMode,
            },
            gridClass
          );
          // this.grid && this.grid.setStatic(!this.editMode)
          this.grid && this.grid.on('resizestop', this.setWidgetSize);
          this.grid && this.grid.on('dragstop', this.setWidgetSize);
        }
      });
    },
    setWidgetSize() {
      const nodeIDMapping = this.getNodeIDMapping();

      const widgets =
        this.widgets &&
        this.widgets.map((w, i) => {
          let gn = nodeIDMapping[this.widgetKey(w, i)];
          w.x = gn.x;
          w.y = gn.y;
          w.w = gn.w;
          w.h = gn.h;
          w.size = Math.random();
          return w;
        });
      this.widgets = widgets || [];
    },
    resetLoading(_dashboardID, loading) {
      if (!this.loading) {
        this.loaderText = defaultLoaderText;
      }
      this.loading = loading;
    },

    getNodeIDMapping() {
      if (!this.grid) {
        return {};
      }

      let nodeIDMapping = {};
      this.grid.engine.nodes.forEach((node) => {
        nodeIDMapping[node.id] = node;
      });
      return nodeIDMapping;
    },

    updateWidgetCoordinates() {
      if (this.grid) {
        const nodeIDMapping = this.getNodeIDMapping();
        this.widgets = this.widgets
          .map((widget, index) => {
            const node = nodeIDMapping[this.widgetKey(widget, index)];
            if (!node) {
              return null;
            }
            return {
              h: node.h,
              w: node.w,
              x: node.x,
              y: node.y,
              type: widget.type,
              widID: widget.widID,
              formattingSettings: widget.formattingSettings,
              additionalParams: widget.additionalParams,
              widgetConfiguration: widget.widgetConfiguration,
            };
          })
          .filter((w) => w);
        this.dashboard.settings.widgets = this.widgets;
      }
    },

    saveDashboard() {
      this.updateWidgetCoordinates();
      // this.settingsPanesize = 0
      // this.dashboard.settings.widgets = this.dashboard.settings.widgets.filter(w => w.type != 'variablePane')
      saveDashboard(
        this.dashboard.id,
        this.dashboard,
        this.query.token,
        this.resetLoading
      );
    },

    updateWidget(wid, index) {
      this.widgets[index] = wid;
    },

    addNote() {
      let maxY = 0;
      this.grid &&
        this.grid.engine.nodes.forEach((node) => {
          if (isNaN(node.y)) {
            node.y = 0;
          }
          if (isNaN(node.h)) {
            node.h = 0;
          }
          if (node.y + node.h > maxY) {
            maxY = node.y + node.h;
          }
        });
      const widget = {
        w: 6 * 40,
        h: 55,
        x: 0,
        y: maxY,
        widID: null,
        type: 'note',
      };
      this.widgets.push(widget);
    },

    addTabs() {
      let maxY = 0;
      this.grid &&
        this.grid.engine.nodes.forEach((node) => {
          if (isNaN(node.y)) {
            node.y = 0;
          }
          if (isNaN(node.h)) {
            node.h = 0;
          }
          if (node.y + node.h > maxY) {
            maxY = node.y + node.h;
          }
        });
      const widget = {
        w: 6 * 40,
        h: 55,
        x: 0,
        y: maxY,
        widID: randomID(),
        type: 'tabs',
      };
      this.widgets.push(widget);
    },

    debounce(func, timeout = 300) {
      return (...args) => {
        this.resizeArgs = args;
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          func.apply(this, this.resizeArgs);
        }, timeout);
      };
    },

    setupDashboard() {
      this.dashboard = dashboard.get(this.dashboardKey) || this.dashboardModel;
      this.widgets = convertWidgets(this.dashboard);
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
