<template>
  <div class="tw-divide-y-2">
    <div>
      <div class="tw-w-full tw-py-2 tw-px-2">
        <AGInput class="tw-w-full tw-mb-2"
          @inputed="(val) => ((settingsLocal.title = val) || true) && (settingsLocal.manualUpdate = true)" label="Title"
          :value="settingsLocal.title" placeholder="Set Chart Title" />
      </div>
      <div class="tw-w-full tw-py-2 tw-px-2">
        <AGSelect
          @select="(val) => ((settingsLocal.labels = val) || true) && (settingsLocal.manualUpdate = true) && (menuSettings.xaxis = false)"
          :selected="settingsLocal.labels" :options="columns" label="Labels Column" :menuShow="menuSettings.xaxis"
          description="Select a column" />
      </div>
    </div>
    <div class="tw-w-full tw-py-2 tw-px-2" v-if="showConcentricRenderingOption && !additionalProps.hideFunnelOptions">
      <AGBool
        @updated="(val) => ((settingsLocal.concentricRendering = val) || true) && (settingsLocal.manualUpdate = true)"
        :val="settingsLocal.concentricRendering" label="Concentric Rendering" />
    </div>

    <div class="" v-for="s, index in settingsLocal.series" :key="s">

      <div class="">
        <div class=" tw-py-2 tw-px-2 tw-font-semibold tw-text-primary tw-text-sm" @click="s.show = !s.show">
          <a href="#">
            Data Series {{ index + 1 }}
            <ChevronDownIcon v-if="s.show" class="tw-float-right tw-h-5 tw-w-5" />
            <ChevronRightIcon v-if="!s.show" class="tw-float-right tw-h-5 tw-w-5" />
          </a>
        </div>


        <div class="" v-if="s.show">
          <div class="tw-w-full tw-py-2 tw-px-2">
            <AGSelect @select="(val) => ((s.dataColumn = val) || true) && (settingsLocal.manualUpdate = true)"
              :options="dataColumnOptions" :selected="s.dataColumn" label="Data Column" description="Select a column" />
          </div>

          <div class="tw-w-full tw-py-2 tw-px-2" v-if="!additionalProps.hideFunnelOptions">
            <AGSelect @select="(val) => ((s.chartType = val) || true) && (settingsLocal.manualUpdate = true)"
              :selected="s.chartType" :options="chartTypes" label="ChartType" description="Select a ChartType" />
          </div>
          <div class="tw-w-full tw-py-2 tw-px-2">
            <AGBool @updated="(val) => updateIndividualSettings(val, settingsLocal, index, 'series', 'showLabel')"
              :val="s.showLabel" label="Show Labels" />
          </div>

          <div class="tw-w-full tw-py-2 tw-px-2" v-if="!additionalProps.hideFunnelOptions">
            <AGSelect @select="(val) => ((s.dimension.dataColumn = val) || true) && (settingsLocal.manualUpdate = true)"
              :selected="s.dimension.dataColumn" :options="columns" label="Dimension" description="Select a column" />
          </div>
          <div v-if="!additionalProps.hideFunnelOptions && s.dimension.dataColumn" class="tw-w-full">
            <div class="tw-border-b tw-w-full" v-for="dimOption in s.dimension.options" :key="dimOption">
              <div class=" tw-divide-y">
                <div class=" tw-py-2 tw-px-4 tw-font-semibold tw-text-primary tw-text-sm"
                  @click="dimOption.show = !dimOption.show">
                  <a href="#">
                    {{ dimOption.name }}
                    <ChevronDownIcon v-if="dimOption.show" class="tw-float-right tw-h-5 tw-w-5" />
                    <ChevronRightIcon v-if="!dimOption.show" class="tw-float-right tw-h-5 tw-w-5" />
                  </a>
                </div>



                <div class="tw-divide-y" v-if="dimOption.show">
                  <div class="tw-w-full tw-py-2  tw-px-6">
                    <AGInput class="tw-w-full tw-mb-2"
                      @inputed="(val) => ((dimOption.legendName = val) || true) && (settingsLocal.manualUpdate = true)"
                      label="Legend Text" :value="dimOption.legendName" placeholder="Set Legend Name" />

                  </div>
                  <div class="tw-w-full tw-py-2  tw-px-6">
                    <AGBool
                      @updated="(val) => ((dimOption.showLabel = val) || true) && (settingsLocal.manualUpdate = true)"
                      :val="dimOption.showLabel" label="Show Labels" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="tw-p-2" v-if="!additionalProps.hideFunnelOptions">
      <AGButton label="Add Another" class="tw-px-2 tw-text-primary tw-border-0 tw-font-semibold" @clicked="addNewSeries">
        <PlusIcon size=14 class="tw-inline" /> Add Another Series
      </AGButton>
    </div>
  </div>
</template>

<script>
import AGSelect from 'components/base/select.vue';
import AGInput from 'components/base/agInput.vue';
import AGBool from 'components/base/bool.vue';
import AGButton from 'components/base/button.vue';

import { ChevronRightIcon, ChevronDownIcon, PlusIcon } from 'vue-tabler-icons';
import { defaultColors, generateColors } from "../../../../helpers/colorGenerator.ts"

import { findDataType } from 'src/helpers/dataTypes';
export default {
  components: { AGSelect, AGButton, AGInput, AGBool, ChevronDownIcon, ChevronRightIcon, PlusIcon },
  props: ["columns", "hideFunnelOptions", 'settings', 'additionalProps', 'rows', 'colDetails'],
  name: 'PieChartSettings',


  computed: {
    dataColumnOptions() {
      return this.columns.filter((item) => findDataType(this.colDetails, item) === 'number')
    }
  },

  data() {
    return {
      chartTypes: ['pie', 'doughnut', 'polar area'],
      titlePositions: ['top', 'bottom'],
      showConcentricRenderingOption: false,
      settingsLocal: this.settings || this.newSettings(),
      menuSettings: {}
    }
  },

  watch: {
    settings: {
      handler() {
        this.settingsLocal = this.settings || this.newSettings()
      }
    },
    settingsLocal: {
      handler() {

        if (this.settingsLocal.manualUpdate) {
          const settings = this.updateSettings(this.settingsLocal)
          if (settings.series) {
            if (settings.series.length >= 2) {
              this.showConcentricRenderingOption = true
              return
            }

            settings.series.forEach((s) => {
              if (s.dimension.dataColumn) {
                this.showConcentricRenderingOption = true
                return

              }
            })
          }
          this.$emit('settings', settings)
        }

      },
      deep: true
    }
  },

  methods: {

    newSeries() {
      return {
        dataColumn: null,
        dimension: { name: null, options: null },
        chartType: this.additionalProps.defaultChartType || 'pie',
        showLabel: true,
        show: true
      }
    },
    newSettings() {
      return {
        labels: null,
        series: [
          this.newSeries()
        ]
      }
    },

    addNewSeries() {
      this.settingsLocal.series.push(this.newSeries())

    },


    getColumnIndex(columnName) {
      return this.columns.indexOf(columnName)
    },


    updateIndividualSettings(val, settings, index, path0, path1) {
      settings[path0][index][path1] = val
      const item = settings[path0][index]
      item.dimension.options && item.dimension.options.forEach((opt) => {
        opt[path1] = item[path1]
      })
      settings.manualUpdate = true
      this.settingsLocal = settings
    },

    updateSettings(settings) {
      let usedColors = []
      if (settings.xaxis) {
        settings.xTitle = settings.xaxis
      }
      if (settings.series && settings.series[0] && settings.series[0].dataColumn) {
        settings.yTitle = settings.series[0].dataColumn
      }
      let series = settings.series.map((s) => {
        if (s.dimension.dataColumn) {
          const dimIndex = this.getColumnIndex(s.dimension.dataColumn)
          const dimensionOptions = [...new Set(this.rows.map((row) => { return row[dimIndex] }))]

          if (s.dimension.options) {
            let cleanedUpDimensions = [...s.dimension.options]
            s.dimension.options.forEach((item, index) => {
              if (dimensionOptions.indexOf(item.name) < 0) {
                cleanedUpDimensions = cleanedUpDimensions.filter((el) => { return el.name != item.name })
              }
            })
            s.dimension.options = cleanedUpDimensions
          }

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
                legendName: item,
                showLabels: true,
                chartType: s.chartType || this.additionalProps.defaultChartType
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

      settings.series = series
      settings.manualUpdate = false
      return settings

    },


    getColor(settings, usedColors) {
      let colors = generateColors(50, true);
      usedColors = [...usedColors]
      settings.series.forEach((settings) => {

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

  }

}

</script>
