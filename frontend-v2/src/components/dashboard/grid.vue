<template>
  <div class="tw-flex tw-h-full tw-min-h-[400px]">
    <AGLoader :text="loaderText" v-if="loading" />
    <div class="tw-h-full tw-w-full" v-if="!loading">

      <splitpanes class="pane-wrapper default-theme" ref="chart-parent"
        @resize="settingsPanesize = 100 - $event[0].size">
        <pane :size="100" class="pane" :class="showSettings ? 'pane-left' : ''">
          <div class="grid-stack tw-h-full tw-w-full tw-flex" :class="gridClass" >
            <GridWidget v-for="widget, index in widgets" v-bind="widget" :widSize="widgetSizes[index]"
              v-model:widID="widget.widID" :queryKey="queryKey" :id="widgetKey(widget, index)" :key="widgetKey(widget)"
              :editMode="editMode" class="js-grid-widget" @widgetDeleted="deleteWidget" />
          </div>
        </pane>
        <pane :size="settingsPanesize" ref="chart" class="pane pane-right tw-shadow-sm !tw-border" v-if="settingsPanesize">
          <div id="dashboard-settings"></div>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import GridWidget from 'components/dashboard/gridWidget.vue'
import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';
import { queryStore } from 'src/stores/query';

import { convertWidgets } from 'src/helpers/dashboard';

import { dashboardsStore } from 'stores/dashboard';
import { saveDashboard } from 'src/apis/dashboards'
import { _ } from 'lodash';

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
const dashboard = dashboardsStore()


const query = queryStore()
const defaultLoaderText = "Fetching dashboard"


export default {
  name: 'AGDashboardGrid',
  props: ['dashboardKey', 'queryKey'],
  components: { AGLoader, GridWidget, Splitpanes, Pane },

  watch: {
    editMode() {
      this.grid && this.grid.setStatic(!this.editMode)
    },
    widgets: {
      deep: true,
      handler() {
        !this.loading && this.$nextTick(this.initGridStack)
        if (this.dashboard && this.dashboard.settings) {
          this.dashboard.settings.version = 1
          this.dashboard.settings.widgets = this.widgets
        }
      }
    },
    dashboardKey() {
      this.$nextTick(this.setupDashboard)
    },
    loading() {
      this.$nextTick(this.initGridStack)
    }
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
      widgetSizes: [],
      loaderText: defaultLoaderText,
      resizeTimer: 0,
      resizeArgs: [],
      gridClass: null,
      counter: 0,
      settingsPanesize: 0,
    }
  },

  mounted() {
    this.setupDashboard()
    window.addEventListener('message', this.receiveMessage)
  },

  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage)
  },

  methods: {
    deleteWidget(widgetID) {
      console.log(widgetID)
      this.widgets = this.widgets.filter((w, i) => this.widgetKey(w, i) != widgetID)
      this.$nextTick(this.saveDashboard())
    },
    receiveMessage(event) {
      if (event.data.message == 'ag_edit_dashboard') {
        this.editMode = event.data.value
      }
      if (event.data.message == 'ag_add_new_note') {
        this.addNote()
      }
      if (event.data.message == 'ag_save_dashboard') {
        this.saveDashboard()
      }
    },
    widgetKey(widget, index) {
      return "widget_" + widget.type + "_" + index
    },

    initGridStack() {
      this.grid && this.grid.destroy(false)
      this.grid = GridStack.init({
        cellHeight: '10px', draggable: {
          handle: '.grid-drag',
        }
      })
      this.grid && this.grid.on('resize', this.setWidgetSize)
      this.grid && this.grid.setStatic(!this.editMode)
    },
    setWidgetSize(event, el) {
      this.debounce(() => {
        console.log(el)
        console.log(event)
        this.widgets.forEach((w, i) => {
          if (this.widgetKey(w, i) === el.id) {
            this.widgetSizes[i] = Math.random()
          }
        })
        this.updateWidgetCoordinates()

      }, 1000)()
    },
    resetLoading(dashboardID, loading) {
      if (!this.loading) {
        this.loaderText = defaultLoaderText
      }
      this.loading = loading
    },

    getNodeIDMapping() {

      if (this.grid) {
        let nodeIDMapping = {}
        this.grid.engine.nodes.forEach((node) => {
          nodeIDMapping[node.id] = node
        })
        return nodeIDMapping

      }
      return {}
    },

    updateWidgetCoordinates() {
      if (this.grid) {
        const nodeIDMapping = this.getNodeIDMapping()
        this.widgets = this.widgets.map((widget, index) => {
          const node = nodeIDMapping[this.widgetKey(widget, index)]
          return { h: node.h, w: node.w, x: node.x, y: node.y, type: widget.type, widID: widget.widID }
        })
        this.dashboard.settings.widgets = this.widgets
      }
    },

    saveDashboard() {
      this.updateWidgetCoordinates()
      this.query = query.get(this.queryKey)
      saveDashboard(this.dashboard.id, this.dashboard, this.query.token, this.resetLoading)
    },


    addNote() {
      console.log('adsd note called')
      let maxY = 0
      this.grid && this.grid.engine.nodes.forEach((node) => {
        if (isNaN(node.y)){ node.y = 0}
        if (isNaN(node.h)){ node.h = 0}
        if (node.y + node.h > maxY ){
          maxY = node.y + node.h
        }
      })
      const widget = { w: 6, h: 55, x: 0, y: maxY, widID: null, type: 'note' }
      this.widgets.push(widget)
    },


    debounce(func, timeout = 300) {
      return (...args) => {
        this.resizeArgs = args
        console.log(this.resizeTimer)
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => { func.apply(this, this.resizeArgs); }, timeout);
      };
    },

    setupDashboard() {
      this.dashboard = dashboard.get(this.dashboardKey)
      this.widgets = convertWidgets(this.dashboard)
    }
  }
}
</script>


