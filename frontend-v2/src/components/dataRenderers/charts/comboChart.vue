
<template v-if="results">

        <div class="tw-h-full tw-w-full tw-flex" v-if="shouldShowChartInformation">
                <div class="tw-m-auto">
                        {{chartInformationMessage}}
                </div>
        </div>
        <div ref="chart-block" class="tw-h-full tw-w-full" v-if="!shouldShowChartInformation"></div>
</template>

<script>

import * as echarts from 'echarts/core';
import {
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent
} from 'echarts/components';
import { LineChart, BarChart, ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        LineChart,
        BarChart,
        ScatterChart,
        CanvasRenderer,
        UniversalTransition
]);

const chartDTMapping = {
        'datetime': 'time',
        'text': 'category',
        'number': 'value'
}

import { findDataType } from '../../../helpers/dataTypes'

import { shallowRef } from 'vue';
export default {
        name: "AGCombo",
        components: {},
        props: ['results', 'resultsKey', 'showSettings', 'defaultChartType', 'settings', 'size'],
        data() {

                return {
                        legendDetails: [],
                        chartBox: null,
                        options: {
                        },
                        data: [],
                        xIndex: null,
                        yIndices: []
                }
        },

        watch: {
                size() {
                        setTimeout(() => {
                                this.setChartDimensions()
                        }, 250)
                },
                options() {
                        this.chartBox && this.chartBox.setOption(this.options, true)
                        this.setChartDimensions()
                },

                settings: {
                        handler() {
                                this.updateChartConf(this.settings || {})
                        }, deep: true
                },
                shouldShowChartInformation() {
                  setTimeout(() => {
                  this.createChartDom()
                        this.chartBox && this.chartBox.setOption(this.options, true)
                        this.setChartDimensions()

                  }, 100)
                }
        },

        mounted() {
                window.addEventListener('resize', this.setChartDimensions);
                this.setChartDimensions()
                this.createChartDom()
                this.updateChartConf(this.settings || {})
        },


        unmounted() {
                window.removeEventListener('resize', this.setChartDimensions);
        },

        computed: {
                shouldShowChartInformation() {
                        if (!this.settings) {
                                return true
                        }
                        if (!this.settings.xaxis) {
                                return true
                        }

                        if (!this.settings.series || (this.settings.series && this.settings.series.length === 0)) {
                                return true
                        }

                        if (!this.settings.series[0].dataColumn) {
                                return true
                        }
                        if (this.xIndex < 0){
                          return true
                        }

                        if (this.yIndices && this.yIndices.filter((y) => y >= 0).length === 0){
                          return true
                        }

                        return false

                },
                chartInformationMessage() {
                        const defaultMessage = "Please select xAxis and yAxis Columns from settings." 
                        const xAxisMissing = "Looks like xAxis that you have specified in settings, was not returned in results."
                        const yAxisMissing = "Looks like yAxis that you have specified in settings, was not returned in results."
                        if (!this.settings) {
                                return defaultMessage
                        }
                        if (!this.settings.xaxis) {
                                return defaultMessage
                        }

                        if (!this.settings.series || (this.settings.series && this.settings.series.length === 0)) {
                                return defaultMessage
                        }

                        if (!this.settings.series[0].dataColumn) {
                                return defaultMessage
                        }
                        if (this.xIndex < 0){
                          return xAxisMissing
                        }

                        if (this.yIndices && this.yIndices.filter((y) => y >= 0).length === 0){
                          return yAxisMissing
                        }

                        return false

                }
        },


        methods: {
                createChartDom(){
                        const chartDom = this.$refs["chart-block"]
                        if (chartDom) {
                                this.chartBox = shallowRef(echarts.init(chartDom))
                                this.chartBox.setOption(this.options, true)
                        }
                },

                getColumnIndex(columnName) {
                        return this.results.columns.indexOf(columnName)
                },

                setChartDimensions() {
                        this.chartBox && this.chartBox.resize({ animation: { duration: 500 } })
                },
                renderChartCondition(settings) {
                        return settings.xaxis &&
                                settings.series[0].dataColumn
                },

                getXType(xaxis) {
                        return chartDTMapping[findDataType(this.results.column_details, xaxis)] || "category"
                },

                tooltipFormatter(params) {
                        let tooltip = `<p style=""><strong>${params[0].data[0]}</strong></p>`;
                        let total = 0
                        params.forEach(({ seriesName, marker, value }) => {
                                value = value || [0, 0];
                                if (!value[1]) {
                                        value[1] = "-"
                                }
                                tooltip += `<p style="">${marker} ${seriesName}<span style="margin-left: 10px; float: right;"><strong>${value[1]}</strong></span></p>`;
                                if (!isNaN(value[1])) {
                                        total += +value[1]
                                }

                        });

                        if (params.length > 1) {
                                tooltip += `<p style="">Total<span style=" margin-left: 10px; float: right;"><strong>${total}</strong></span>`;
                        }


                        return tooltip;
                },


                prepareData(settings) {
                        this.yIndices = []
                        let options = {
                                title: {
                                        text: settings.title,
                                        left: 'center',
                                        textStyle: {
                                                color: "#6e7687",
                                                fontSize: 25
                                        }

                                },
                                legend: { bottom: '10', type: 'scroll', pageIconColor: '#6e7687', pageTextStyle: {color: '#6e7687'} , padding: [5, 10] },
                                tooltip: {
                                        trigger: 'axis',
                                        order: 'valueDesc',
                                        formatter: this.tooltipFormatter                                        // formatter: function (params) {
                                        //         let tar;
                                        //         if (params[1].value !== '-') {
                                        //                 tar = params[1];
                                        //         } else {
                                        //                 tar = params[0];
                                        //         }
                                        //         return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                                        // }
                                },
                        }

                        let max = 1
                        const xIndex = this.getColumnIndex(settings.xaxis)
                        this.xIndex = xIndex
                        if (xIndex >= 0 && this.renderChartCondition(settings)) {
                                let xaxisData = [...new Set(this.results.rows.map((row) => {
                                        return row[xIndex]
                                }))].sort((a, b) => { return a > b ? -1 : 1 })



                                options.xAxis = {
                                        type: this.getXType(settings.xaxis),
                                        name: settings.xTitle,
                                        nameLocation: 'middle',
                                        nameGap: 25,
                                        nameTextStyle: {
                                                fontWeight: 'bold'
                                        },
                                        axisLine: {
                                                lineStyle: {
                                                        color: "#6e7687"
                                                }
                                        }
                                }
                                options.yAxis = {
                                        name: settings.yTitle,
                                        nameLocation: 'middle',
                                        nameTextStyle: {
                                                fontWeight: 'bold'
                                        },
                                        axisLine: {
                                                lineStyle: {
                                                        color: "#6e7687"
                                                }
                                        }
                                }
                                settings.series.forEach((s, index) => {

                                        options.yAxis.type = this.getXType(s.dataColumn)


                                        let data = {}; let uniqueDimensions = {};

                                        let yIndex = this.getColumnIndex(s.dataColumn)
                                        this.yIndices.push(yIndex)
                                        let dimIndex = this.getColumnIndex(s.dimension.dataColumn)
                                        this.results.rows.forEach((row) => {

                                                let xaxis = row[xIndex]
                                                let dimension = row[dimIndex]
                                                let yaxis = row[yIndex]
                                                data[xaxis] = data[xaxis] ? data[xaxis] : {}
                                                data[xaxis][dimension] = yaxis
                                                uniqueDimensions[dimension] = true
                                        })

                                        let dimensionsData = {}
                                        xaxisData.forEach((xItem) => {
                                                Object.entries(uniqueDimensions).forEach((det, _) => {
                                                        if (!dimensionsData[det[0]]) { dimensionsData[det[0]] = [] }
                                                        const d = data[xItem][det[0]]
                                                        dimensionsData[det[0]].push([xItem, d ? d : null])
                                                })
                                        })


                                        // const hiddenLegends = [
                                        //         ...this.legendDetails.filter((item) => { return item.show == false })
                                        // ].map((item) => {return  item.name })
                                        let longestY = 100

                                        Object.entries(dimensionsData).forEach((det, i) => {
                                                let opt = s.dimension.options && s.dimension.options.filter((option) => {
                                                        return option.name == det[0]
                                                })


                                                if (opt && opt.length >= 0) { opt = opt[0] }
                                                const legendName = opt ? (opt.legendName || opt.name) : s.dataColumn
                                                const color = opt ? opt.color : s.color
                                                const chartType = opt ? opt.chartType : s.chartType
                                                const name = opt ? opt.name : s.dataColumn
                                                const showLabel = opt ? opt.showLabel : s.showLabel


                                                options.series = options.series ? options.series : []
                                                options.legend = options.legend ? options.legend : {}
                                                options.legend.data = options.legend.data ? options.legend.data : []

                                                options.legend.data.push(legendName || name)

                                                let seriesDatum = {
                                                        name: legendName || name,
                                                        type: chartType || this.defaultChartType,
                                                        data: det[1],
                                                        color: color,
                                                        label: { show: showLabel, position: 'top', backgroundColor: 'white', color: '#6e7687'  }
                                                }

                                                if (seriesDatum.type === 'area') {
                                                        seriesDatum.type = 'line'
                                                        seriesDatum.areaStyle = { opacity: 0.6 }
                                                }
                                                if (seriesDatum.type === 'scatter') {

                                                        if (options.yAxis.type === 'value') {
                                                                let maxLocal = Math.max(...det[1].map((tuple) => { return tuple[1] }))
                                                                max = maxLocal > max ? maxLocal : max
                                                        }
                                                        seriesDatum.symbolSize = this.bubbleSymbolSize
                                                }
                                                seriesDatum.label.position = 'inside'

                                                if (s.isStacked) {
                                                        seriesDatum.stack = s.dataColumn + "-" + index
                                                }

                                                options.series.push(seriesDatum)

                                                // options.series = options.series ? options.series : {}
                                                // options.series[i] = { type: chartType, 'color': color, 'labelInLegend': legendName, 'pointsVisible': true }
                                                //
                                                // if (hiddenLegends.indexOf(legendName) < 0) {
                                                //         legendDetails.push(
                                                //                 { color: color, legendName: legendName, name: name, show: true }
                                                //         )
                                                //         seriesData[0].push(legendName)
                                                //         det[1].forEach((entry, index) => {
                                                //                 seriesData[index + 1].push(entry)
                                                //         })
                                                // } else {
                                                //         legendDetails.push(
                                                //                 { color: color, legendName: legendName, name: name, show: false }
                                                //         )
                                                //
                                                // }
                                                //



                                        })
                                        options.yAxis.nameGap = Math.ceil(15 * 0.35 * longestY + 50)
                                })

                                return { options: options, max: max }
                        }
                        return { options: options, max: 1 }
                },

                updateChartConf(settings) {
                        const data = this.prepareData(settings)
                        this.maxDataValue = data.max
                        this.options = data.options
                },

                bubbleSymbolSize(data) {
                        if (isNaN(data[1])) {
                                return 0
                        }
                        return (data[1] / this.maxDataValue) * 150
                },


        },
}
</script>

