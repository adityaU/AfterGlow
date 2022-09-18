<template>
    <div class="tw-divide-y">
        <div class=" tw-py-4 tw-px-2 tw-font-semibold tw-text-default tw-text-sm">
            Settings
        </div>

        <div class=" tw-py-4 tw-px-2">
            <AGInput @inputed="(val) => ((settingsLocal.title = val) || true) && (settingsLocal.manualUpdate = true)"
                label="Title" :value="settingsLocal.title" placeholder="Set Chart Title" />
        </div>
        <div class=" tw-py-4 tw-px-2">
            <AGSelect @select="(val) => ((settingsLocal.xaxis = val) || true) && (settingsLocal.manualUpdate = true)"
                :selected="settingsLocal.xaxis" :options="columns" label="X-Axis Column"
                description="Select a column" />
        </div>

        <div class="tw-grid tw-grid-cols-1 tw-divide-y" v-for="s, index in settingsLocal.series" :key="s">
            <div class=" tw-py-4 tw-px-2 tw-font-semibold tw-text-default tw-text-sm" @click="s.show = !s.show">
                <a href="#">
                    Data Series {{ index + 1 }}
                    <ChevronDownIcon v-if="s.show" class="tw-float-right tw-h-5 tw-w-5" />
                    <ChevronRightIcon v-if="!s.show" class="tw-float-right tw-h-5 tw-w-5" />
                </a>
            </div>

            <div class="tw-divide-y" v-if="s.show">
                <div class=" tw-py-4  tw-px-2">
                    <AGSelect @select="(val) => ((s.dataColumn = val) || true) && (settingsLocal.manualUpdate = true)"
                        :options="columns" :selected="s.dataColumn" label="Y-Axis Column"
                        description="Select a column" />
                </div>
                <div class=" tw-py-4  tw-px-2">
                    <AGSelect
                        @select="(val) => updateIndividualSettings(val, settingsLocal, index, 'series', 'chartType')"
                        :selected="s.chartType" :options="chartTypes" label="ChartType"
                        description="Select a ChartType" />
                </div>
                <div class=" tw-py-4  tw-px-2">
                    <AGBool
                        @updated="(val) => updateIndividualSettings(val, settingsLocal, index, 'series', 'showLabel')"
                        :val="s.showLabel" label="Show Labels" />
                </div>
                <div class=" tw-py-4  tw-px-2" v-if="s.dimension.options && s.dimension.options.length > 0">
                    <AGBool @updated="(val) => ((s.isStacked = val) || true) && (settingsLocal.manualUpdate = true)"
                        :val="s.isStacked" label="Show Stacked graphs" />
                </div>
                <div class=" tw-py-4  tw-px-2">
                    <ColorSelector
                        @selectColor="(val) => ((s.color = val) || true) && (settingsLocal.manualUpdate = true)"
                        :selectedColor="s.color"></ColorSelector>
                </div>

                <div class=" tw-py-4  tw-px-2">
                    <AGSelect
                        @select="(val) => ((s.dimension.dataColumn = val) || true) && (settingsLocal.manualUpdate = true)"
                        :selected="s.dimension.dataColumn" :options="columns" label="Dimension"
                        description="Select a column" />

                </div>

                <div v-if="s.dimension.dataColumn" class=" tw-grid tw-grid-cols-1 tw-divide-y">
                    <div class="tw-border-l" v-for="dimOption in s.dimension.options" :key="dimOption">
                        <div class="tw-grid tw-grid-cols-1 tw-divide-y">
                            <div class=" tw-py-4 tw-px-4 tw-font-semibold tw-text-default tw-text-sm"
                                @click="dimOption.show = !dimOption.show">
                                <a href="#">
                                {{ dimOption.name }}
                                <ChevronDownIcon v-if="dimOption.show" class="tw-float-right tw-h-5 tw-w-5" />
                                <ChevronRightIcon v-if="!dimOption.show" class="tw-float-right tw-h-5 tw-w-5" />
                                </a>
                            </div>
                            <div class= "tw-divide-y" v-if="dimOption.show">
                                <div class=" tw-py-4  tw-px-4">
                                    <AGSelect
                                        @select="(val) => ((dimOption.chartType = val) || true) && (settingsLocal.manualUpdate = true)"
                                        :selected="dimOption.chartType" :options="chartTypes" label="ChartType"
                                        description="Select a ChartType" />
                                </div>
                                <div class=" tw-py-4  tw-px-4">
                                    <AGInput
                                        @inputed="(val) => ((dimOption.legendName = val) || true) && (settingsLocal.manualUpdate = true)"
                                        label="Legend Text" :value="dimOption.legendName"
                                        placeholder="Set Legend Name" />

                                </div>
                                <div class=" tw-py-4  tw-px-4">
                                    <AGBool
                                        @updated="(val) => ((dimOption.showLabel = val) || true) && (settingsLocal.manualUpdate = true)"
                                        :val="dimOption.showLabel" label="Show Labels" />
                                </div>
                                <div class=" tw-py-4  tw-px-4">
                                    <ColorSelector
                                        @selectColor="(val) => ((dimOption.color = val) || true) && (settingsLocal.manualUpdate = true)"
                                        label="color" :selectedColor="dimOption.color"></ColorSelector>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tw-p-2">
            <AGButton label="Add Another" class="tw-px-2" @clicked="addNewSeries" />
        </div>
    </div>
</template>

<script>
import ColorSelector from 'components/base/colorSelector.vue';
import AGSelect from 'components/base/select.vue';
import AGInput from 'components/base/agInput.vue';
import AGBool from 'components/base/bool.vue';
import AGButton from 'components/base/button.vue';

import { ChevronDownIcon, ChevronRightIcon } from 'vue-tabler-icons';
import { defaultColors, generateColors } from "../../../../helpers/colorGenerator.ts"

export default {
    components: { ColorSelector, AGSelect, AGButton, AGInput, AGBool, ChevronDownIcon, ChevronRightIcon },
    props: ["columns", "settings", "additionalProps", "rows"],

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
                    this.$emit("settings", settings)
                }
            },
            deep: true
        }
    },

    data() {
        return {
            chartTypes: ['line', 'area', 'bar', 'scatter'],
            titlePositions: ['top', 'bottom'],
            settingsLocal: this.settings || this.newSettings()
        }
    },

    methods: {

        newSeries() {
            return {
                dataColumn: null,
                dimension: { name: null, options: null },
                color: null,
                chartType: this.additionalProps.defaultChartType,
                showLabel: false,
                show: true
            }
        },
        newSettings() {

            return {
                xaxis: null,
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
            let colors = generateColors(50)
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
