<template>
  <div class="tw-h-full tw-w-full tw-flex" v-if="shouldShowChartInformation">
    <div class="tw-m-auto">
      {{ chartInformationMessage }}
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
  LegendComponent,
} from 'echarts/components';
import { PieChart, FunnelChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  FunnelChart,
  CanvasRenderer,
  UniversalTransition,
]);

import { rgbToHex } from 'src/helpers/colorGenerator';
import { currentUserStore } from 'src/stores/currentUser';

import { shallowRef } from 'vue';
import {
  defaultColors,
  generateColors,
} from '../../../helpers/colorGenerator.ts';
import { findDataType } from 'src/helpers/dataTypes';

let currentUser = currentUserStore();
export default {
  name: 'AGPie',
  components: {},
  props: [
    'results',
    'resultsKey',
    'showSettings',
    'defaultChartType',
    'hideFunnelOptions',
    'settings',
    'size',
  ],
  data() {
    return {
      legendDetails: [],
      chartWidth: 0,
      chartHeight: 0,
      timer: 0,
      xTypesMapping: {
        NaiveDateTime: 'time',
        'Inferred.DateTime': 'time',
        Integer: 'value',
        Float: 'value',
        Decimal: 'value',
      },
      chartBox: null,
      settingsLocal: {},
      options: {},
      data: [],
      xIndex: null,
      yIndices: [],
    };
  },

  watch: {
    size() {
      setTimeout(() => {
        this.dimChanged();
      }, 250);
    },
    options() {
      this.chartBox && this.chartBox.setOption(this.options, true);
      this.debounce(this.resizeChart, 300)();
    },
    settings: {
      handler() {
        this.updateChartConf(this.settings || {});
      },
      deep: true,
    },
    chartHeight() {
      this.debounce(this.resizeChart, 300)();
    },
    chartWidth() {
      this.debounce(this.resizeChart, 300)();
    },

    shouldShowChartInformation() {
      setTimeout(() => {
        this.createChartDom();
        this.chartBox && this.chartBox.setOption(this.options, true);
        this.setChartDimensions();
      }, 100);
    },
  },

  mounted() {
    window.addEventListener('resize', this.dimChanged);
    this.debounce(this.setChartDimensions, 300)();
    this.createChartDom();
    this.updateChartConf(this.settings || {});
  },

  unmounted() {
    window.removeEventListener('resize', this.dimChanged);
  },

  computed: {
    shouldShowChartInformation() {
      if (!this.settings) {
        return true;
      }
      if (!this.settings.labels) {
        return true;
      }

      if (
        !this.settings.series ||
        (this.settings.series && this.settings.series.length === 0)
      ) {
        return true;
      }

      if (!this.settings.series[0].dataColumn) {
        return true;
      }
      if (this.xIndex < 0) {
        return true;
      }

      if (this.yIndices && this.yIndices.filter((y) => y >= 0).length === 0) {
        return true;
      }

      return false;
    },
    chartInformationMessage() {
      const defaultMessage =
        'Please select labels and data columns from settings.';
      const xAxisMissing =
        'Looks like Label column that you have specified in settings, was not returned in results.';
      const yAxisMissing =
        'Looks like data column that you have specified in settings, was not returned in results.';
      if (!this.settings) {
        return defaultMessage;
      }
      if (!this.settings.labels) {
        return defaultMessage;
      }

      if (
        !this.settings.series ||
        (this.settings.series && this.settings.series.length === 0)
      ) {
        return defaultMessage;
      }

      if (!this.settings.series[0].dataColumn) {
        return defaultMessage;
      }
      if (this.xIndex < 0) {
        return xAxisMissing;
      }

      if (this.yIndices && this.yIndices.filter((y) => y >= 0).length === 0) {
        return yAxisMissing;
      }

      return false;
    },
  },

  methods: {
    debounce(func, timeOut) {
      return () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(func(), timeOut);
      };
    },
    createChartDom() {
      const chartDom = this.$refs['chart-block'];
      if (chartDom) {
        this.chartBox = shallowRef(echarts.init(chartDom));
        this.chartBox.setOption(this.options, true);
      }
    },
    dimChanged() {
      this.setChartDimensions();
      const options = this.setChartPosition(this.options);
      this.chartBox && this.chartBox.setOption(options, true);
      this.resizeChart();
    },

    legendDetailsUpdated(legendDetails) {
      this.legendDetails = legendDetails;
      this.updateChartConf(this.settings);
    },

    setChartDimensions() {
      const chartDom = this.$refs['chart-block'];
      if (chartDom) {
        this.chartHeight = chartDom.clientHeight;
        this.chartWidth = chartDom.clientWidth;
      }
    },

    resizeChart() {
      this.chartBox && this.chartBox.resize({ animation: { duration: 500 } });
    },
    getColumnIndex(columnName) {
      return this.results.columns.indexOf(columnName);
    },

    renderChartCondition(settings) {
      return settings.labels && settings.series[0].dataColumn;
    },

    getXType(labels) {
      return (
        this.xTypesMapping[this.results.column_details[labels]['data_type']] ||
        'category'
      );
    },

    labelFormatter(params) {
      return params.seriesName;
    },

    prepareData(settings) {
      this.yIndices = [];

      let options = {
        title: {
          text: settings.title,
          left: 'center',
          textStyle: {
            color: rgbToHex(currentUser.getTheme.default_color),
            fontSize: 25,
          },
        },
        legend: {
          bottom: '20',
          type: 'scroll',
          pageIconColor: rgbToHex(currentUser.getTheme.default_color),
          pageTextStyle: {
            color: rgbToHex(currentUser.getTheme.default_color),
          },
          padding: [10, 20],
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: rgbToHex(currentUser.getTheme.white_color),
          borderColor: rgbToHex(currentUser.getTheme.tertiary_color),
          textStyle: {
            color: rgbToHex(currentUser.getTheme.default_color),
          }
          // order: 'valueDesc',
          // formatter: this.tooltipFormatter                                        // formatter: function (params) {
          //         let tar;
          //         if (params[1].value !== '-') {
          //                 tar = params[1];
          //         } else {
          //                 tar = params[0];
          //         }
          //         return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          // }
        },
      };

      let max = 1;
      const xIndex = this.getColumnIndex(settings.labels);
      this.xIndex = xIndex;
      if (xIndex >= 0 && this.renderChartCondition(settings)) {
        let labelsData = [
          ...new Set(
            this.results.rows.map((row) => {
              return row[xIndex];
            })
          ),
        ].sort((a, b) => {
          return a > b ? -1 : 1;
        });

        // options.labels = {
        //         type: this.getXType(settings.labels),
        //         name: settings.xTitle,
        //         nameLocation: 'middle',
        //         nameGap: 25,
        //         nameTextStyle: {
        //                 fontWeight: 'bold'
        //         },
        //         axisLine: {
        //                 lineStyle: {
        //                         color: "#6e7687"
        //                 }
        //         }
        // }
        // options.yAxis = {
        //         name: settings.yTitle,
        //         nameLocation: 'middle',
        //         nameTextStyle: {
        //                 fontWeight: 'bold'
        //         },
        //         axisLine: {
        //                 lineStyle: {
        //                         color: "#6e7687"
        //                 }
        //         }
        // }
        settings.series.forEach((s, index) => {
          // options.yAxis.type = this.getXType(s.dataColumn)

          let data = {};
          let uniqueDimensions = {};

          let yIndex = this.getColumnIndex(s.dataColumn);
          this.yIndices.push(yIndex);
          let dimIndex = this.getColumnIndex(s.dimension.dataColumn);
          this.results.rows.forEach((row) => {
            let labels = row[xIndex];
            let dimension = row[dimIndex];
            let yaxis = row[yIndex];
            data[labels] = data[labels] ? data[labels] : {};
            data[labels][dimension] = yaxis;
            uniqueDimensions[dimension] = true;
          });

          let dimensionsData = {};
          labelsData.forEach((xItem) => {
            Object.entries(uniqueDimensions).forEach((det, _) => {
              if (!dimensionsData[det[0]]) {
                dimensionsData[det[0]] = [];
              }
              const d = data[xItem][det[0]];
              dimensionsData[det[0]].push([xItem, d ? d : null]);
            });
          });

          // const hiddenLegends = [
          //         ...this.legendDetails.filter((item) => { return item.show == false })
          // ].map((item) => {return  item.name })

          Object.entries(dimensionsData).forEach((det, i) => {
            let opt =
              s.dimension.options &&
              s.dimension.options.filter((option) => {
                return option.name == det[0];
              });

            if (opt && opt.length >= 0) {
              opt = opt[0];
            }
            const legendName = opt ? opt.legendName || opt.name : s.dataColumn;
            const color = opt ? opt.color : s.color;
            const name = opt ? opt.name : s.dataColumn;
            const showLabel = opt ? opt.showLabel : s.showLabel;

            options.series = options.series ? options.series : [];
            options.legend = options.legend ? options.legend : {};
            // options.legend.data = options.legend.data ? options.legend.data : []
            //
            // options.legend.data.push(legendName || name)

            let seriesDatum1 = {
              name: legendName || name,
              avoidLabelOverlap: true,
              type: this.defaultChartType || 'pie',
              itemStyle: {
                borderRadius: 8,
              },
              data: det[1]
                .map((item) => {
                  return {
                    value: item[1],
                    name: item[0],
                  };
                })
                .filter((datum) => {
                  return !isNaN(datum.value) && datum.value;
                }),
              color: generateColors(det[1].length, true),
              label: {
                show: showLabel,
                position: 'outside',
                formatter: '{b}',
                fontWeight: 'bold',
              },
              labelLine: {
                show: true,
              },
            };

            seriesDatum1.chartType = s.chartType;
            seriesDatum1.type = s.chartType == 'funnel' ? 'funnel' : 'pie';
            if (s.chartType === 'doughnut') {
              seriesDatum1.radius = ['40%', '80%'];
              seriesDatum1.label.show = true;
              seriesDatum1.label.position = 'center';
              seriesDatum1.label.formatter = this.labelFormatter;
              seriesDatum1.label.fontWeight = 'bold';
            }
            if (s.chartType === 'polar area') {
              seriesDatum1.radius = ['20%', '80%'];
              seriesDatum1.roseType = 'area';
              seriesDatum1.label.show = true;
              seriesDatum1.label.position = 'center';
              seriesDatum1.label.formatter = this.labelFormatter;
              seriesDatum1.label.fontWeight = 'bold';
            }

            let seriesDatum2 = JSON.parse(JSON.stringify(seriesDatum1));
            seriesDatum2.label.show = showLabel;
            seriesDatum2.label.position = 'inside';
            seriesDatum2.label.formatter = '{c}({d}%)';
            seriesDatum2.label.name += '1';

            options.series.push(seriesDatum1);
            options.series.push(seriesDatum2);

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
          });
          // options.yAxis.nameGap = Math.ceil(15 * 0.35 * longestY + 50)
        });

        if (options.series && options.series.length / 2 > 1) {
          if (settings.concentricRendering) {
            const div = 85 / options.series.length;
            options.series = options.series.filter((_, i) => i % 2 != 0);

            options.series.forEach((s, i) => {
              s.radius = [div * i + 4 + '%', div * (i + 1) + '%'];
            });
          } else {
            options = this.setChartPosition(options);
          }
        }

        return { options: options, max: max };
      }
      return { options: options, max: 1 };
    },

    setChartPosition(options) {
      if (options.series && options.series.length / 2 > 1) {
        let guessedDiv = Math.floor(this.chartWidth / 250) + 1;
        let div =
          options.series.length / 2 > guessedDiv
            ? guessedDiv
            : options.series.length / 2;

        options.series.forEach((s, i) => {
          let j = Math.floor(i / 2);
          let xBase = 0;
          const yBase =
            (100 / (Math.ceil(options.series.length / (2 * div)) + 1)) *
            Math.ceil((i + 1) / (2 * div));

          if (
            options.series.length % (2 * div) != 0 &&
            Math.ceil(options.series.length / (2 * div)) ===
            Math.ceil((i + 1) / (2 * div))
          ) {
            const newDiv = (options.series.length % (2 * div)) / 2;
            xBase = (100 / (newDiv + 1)) * ((j % newDiv) + 1);
          } else {
            xBase = (100 / (div + 1)) * ((j % div) + 1);
          }
          const maxHeight =
            (this.chartHeight - 200) *
            (2 / (Math.ceil(options.series.length / div) + 2));
          const maxWidth = this.chartWidth * (1 / (2 * div + 2));
          let baseRadius = Math.min(maxWidth, maxHeight) - 10;

          if (['doughnut', 'polar area'].indexOf(s.chartType) >= 0) {
            s.radius = [baseRadius * 0.4, baseRadius];
            s.center = [xBase + '%', yBase + '%'];
          } else if (s.chartType === 'pie') {
            s.radius = baseRadius;
            s.center = [xBase + '%', yBase + '%'];
          }

          // if (s.type === 'funnel') {
          //   // maxHeight = (this.chartHeight - 380) * (2 / (Math.ceil(options.series.length / div) + 2))
          //   // maxWidth = this.chartWidth * (1 / ((2 * div) + 2))
          //   s.width = 2*maxWidth
          //   s.height = 2*maxHeight
          //   s.left = ((j + 1) % div)*(xBase/2) + '%'
          //   s.top = (j + 1)*(yBase/2) + '%'
          //
          // }
        });
      }

      return options;
    },

    updateChartConf(settings) {
      const data = this.prepareData(settings);
      this.maxDataValue = data.max;
      this.options = data.options;
    },
  },
};
</script>
