<template>
  <div class="tw-flex tw-h-full tw-min-h-[400px]">
    <AGLoader :text="loaderText" v-if="loading" />
    <div class="grid-stack tw-h-full tw-w-full" v-if="!loading">
      <GridWidget v-for="widget, index in widgets" v-bind="widget" :widSize="widgetSizes[index]" v-model:widID="widget.widID"
        :queryKey="queryKey" :id="widgetKey(widget, index)" :key="widgetKey(widget)" :editMode="editMode"
        class="js-grid-widget" @widgetDeleted="deleteWidget" />
    </div>
  </div>
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import GridWidget from 'components/dashboard/gridWidget.vue'
import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';
import { queryStore } from 'src/stores/query';

import {convertWidgets} from 'src/helpers/dashboard';

import { dashboardsStore } from 'stores/dashboard';
import { saveDashboard } from 'src/apis/dashboards'
import { _ } from 'lodash';
const dashboard = dashboardsStore()


const query = queryStore()
const defaultLoaderText = "Fetching dashboard"


const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
export default {
  name: 'AGDashboardGrid',
  props: ['dashboardKey', 'queryKey'],
  components: { AGLoader, GridWidget },

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
      loaderText: defaultLoaderText
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
      this.widgets = this.widgets.filter((w, i) => this.widgetKey(w, i) != widgetID)
      this.saveDashboard()
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
      if (this.grid) {
        this.grid.destroy(false)
      }
      this.grid = GridStack.init({
        cellHeight: '10px', draggable: {
          handle: '.grid-drag',
        }
      })
      this.grid && this.grid.compact()
      this.grid && this.grid.setStatic(!this.editMode)
      this.grid && this.grid.on('resize', this.setWidgetSize)
    },
    setWidgetSize(event, el) {
      debounce(() => {
        this.widgets.forEach((w, i) => {
          if (this.widgetKey(w, i) === el.id) {
            this.widgetSizes[i] = Math.random()
          }
        })

      }, 300)()
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
      const widget = { w: 6, h: 55, x: 0, y: 0, widID: null, type: 'notes' }
      this.widgets.push(widget)
      const widgetID = '#' + this.widgetKey(widget, this.widgets.length - 1)
    },



    setupDashboard() {
      this.dashboard = dashboard.get(this.dashboardKey)
      this.widgets = convertWidgets(this.dashboard)
    }
  }
}
</script>


