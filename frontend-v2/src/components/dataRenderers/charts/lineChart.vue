
        <!-- v-if="options.chart && options.xaxis && (series && series.length >= 1) && series[0].type && series[0].name && series[0].data"> -->
<template v-if=results>
  <splitpanes class="default-theme tw-border">
    <pane size=30>
      <settings @settings="updateChartConf" :columns="results.data.columns" :settings="settings"></settings>
    </pane>
    <pane size=70>
      <echart :option="options"></echart>
    </pane>
  </splitpanes>
</template>

<script>

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, defineComponent } from 'vue';

use([
  CanvasRenderer,

  LineChart,
  GridComponent,

  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);


import MixedChartSettings from './settings/mixedChartSettings.vue';
import 'splitpanes/dist/splitpanes.css'
import { defaultColors, generateColors } from "../../../helpers/colorGenerator.ts"
import { Splitpanes, Pane } from 'splitpanes'
export default {
  name: "AGLine",
  components: { echart: VChart, settings: MixedChartSettings, splitpanes: Splitpanes, pane: Pane },
  props: ['results', 'resultsKey',],
  data() {
    return {
      xTypesMapping: {
        "NaiveDateTime": "time",
        "Inferred.DateTime": "time",
        "Integer": "value",
        "Float": "value",
        "Decimal": "value"
      },
      settings: {},
      options: {
        chart: {
          id: '-chart-' + this.resultsKey.slice(0, 10)
        }
      }
    }
  },

  methods: {
    getColumnIndex(columnName) {
      return this.results.data.columns.indexOf(columnName)
    },

    renderChartCondition(settings) {
      return settings.xaxis &&
        settings.series[0].dataColumn
    },

    getXType(xaxis){
      return this.xTypesMapping[this.results.data.column_details[xaxis]["data_type"]] || "category"
    },

    prepareData(settings) {
      let seriesData = []
      const xIndex = this.getColumnIndex(settings.xaxis)
      if (xIndex >= 0 && this.renderChartCondition(settings)) {
        let xaxisData = [...new Set(this.results.data.rows.map((row) => {
          return row[xIndex]
        }))]

        xaxisData = xaxisData.sort((a, b) => {return a > b ? 1 : -1})
        settings.series.forEach((s, index) => {
          let data = {}; let uniqueDimensions = {};

          let yIndex = this.getColumnIndex(s.dataColumn)
          let dimIndex = this.getColumnIndex(s.dimension.dataColumn)
          this.results.data.rows.forEach((row) => {

            let xaxis = row[xIndex]
            let dimension = row[dimIndex]
            let yaxis = row[yIndex]
            data[xaxis] = data[xaxis] ?  data[xaxis] : {}
            data[xaxis][dimension] = yaxis
            uniqueDimensions[dimension] = true
          })

          let dimensionsData = {}
          xaxisData.forEach((xItem) => {
            Object.entries(uniqueDimensions).forEach((det, _) => {
              if (!dimensionsData[det[0]]) { dimensionsData[det[0]] = [] }
              const d = data[xItem][det[0]]
              dimensionsData[det[0]].push(d ? d : null)
            })
          })

          Object.entries(dimensionsData).forEach((det, _) => {
            let opt = s.dimension.options && s.dimension.options.filter((option) => {
              return option.name == det[0]
            })


            if (opt && opt.length >= 0) { opt = opt[0] }
            const legendName = opt ? opt.name : s.dataColumn
            const color = opt ? opt.color : s.color
            seriesData.push({
              data: det[1],
              type: s.chartType,
              name: legendName,
              color: color
            })
          })
        })
        return { x: xaxisData, seriesData: seriesData }
      }
      return {x: null, seriesData: null}
    },

    updateOptions(settings,data, series) {
      this.options = {
        chart: {
          id: '-chart-' + this.resultsKey.slice(0, 10)
        },
        xAxis: {
          data: data,
          type: this.getXType(settings.xaxis)
        },
        yAxis: {
          type: "value"
        },
        series: series
      }
    },


    updateSettings(settings) {
      let usedColors = []
      return settings.series.map((s) => {
        if (s.dimension.dataColumn) {
          const dimIndex = this.getColumnIndex(s.dimension.dataColumn)
          const dimensionOptions = [...new Set(this.results.data.rows.map((row) => { return row[dimIndex] }))]
          dimensionOptions.forEach((item) => {
            const names = s.dimension.options && s.dimension.options.map((dimOpt) => { return dimOpt.name })
            const nameIndex = !names || names.indexOf(item)
            if (!names || nameIndex < 0) {
              if (!s.dimension.options) { s.dimension.options = [] }
              const color = this.getColor(settings, usedColors)
              usedColors.push(color)
              s.dimension.options.push({
                name: item,
                color: color,
                legendName: item
              })
            } else {
              usedColors.push(s.dimension.options[nameIndex].color)
            }
          })

        } else {
          if (!s.color) {
            s.color = this.getColor(settings, usedColors)
            usedColors.push(s.color)
          }
        }
        return s
      })

    },

    getColor(settings, usedColors) {
      let colors = generateColors(50)
      usedColors = [...usedColors]
      settings.series.forEach((settings, index) => {

        let options = settings.dimension.options
        if (options && options.length > 0) {
          options.forEach((item) => { usedColors.push(item.color) })
        } else {
          usedColors.push(settings.color)
        }

      })

      for (let index = 0; index < colors.length; index++) {
        if (usedColors.indexOf(colors[index]) < 0) {
          return colors[index]
        }

      }
      return defaultColors[0]
    },

    updateChartConf(settings) {
      this.settings.series = this.updateSettings(settings)
      const data = this.prepareData(settings)
      this.updateOptions(settings, data.x, data.seriesData)
    }


  },
}
</script>

