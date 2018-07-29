import Ember from 'ember';
import ColorMixin from 'frontend/mixins/colors-mixin';
import ResultViewMixin from 'frontend/mixins/result-view-mixin';
import HelperMixin from 'frontend/mixins/helper-mixin';

export default Ember.Mixin.create(ColorMixin, ResultViewMixin, HelperMixin, {
    display(params) {
        var formattedString = params;
        var objType = (Object.prototype.toString.call(params).replace(/\[object|\]/g, '').trim());
        if (objType == 'Object') {
            formattedString = JSON.stringify(params);
        } else if (params == true || params == false) {
            formattedString = params.toString();
        } else if (objType == 'Array') {
            formattedString = params.map((item) => {
                if (typeof (item) == 'object') {
                    return JSON.stringify(params);
                } else {
                    return params;
                }
            });
        }
        if (!isNaN(+params)) {
            formattedString = +params;
        }
        let date = Date.parse(params);
        let dateMatch = (params && params.toString().match('-') != null);
        if (date.toString() != 'NaN' && dateMatch) {
            formattedString = moment(date).format('YYYY-MM-DD HH:mm:ss.SSS');
        }


        return formattedString;

    },
    margin: {
        // l: 80,
        r: 5,
        t: 40,
        b: 30,
        pad: 0

    },
    downloadAsPNG(gd) {
        Plotly.toImage(gd, {
                height: 1600,
                width: 1600
            })
            .then(
                function (url) {
                    return Plotly.toImage(gd, {
                        format: 'png',
                        height: 1600,
                        width: 1600
                    });
                }
            );
    },
    gridParent: Ember.computed(function () {
        return this.$('#' + this.get('randomId')).parents('.grid-stack-item');
    }),

    opts: Ember.computed('jsonData', 'resizeTime', function () {
        Ember.$(this);
        let isGrid = this.$().parents('.grid-stack-item-content').length;
        let parent = this.$().parents('.card-body');
        let height = 500;
        if (isGrid) {
            height = Math.round(parent.innerHeight() || 500) - 10;
        }
        return {
            left: '0%',
            right: '0%',
            width: Math.round(parent.innerWidth()) - 10,
            height: height
        };
    }),
    // dimensions(gridParent) {
    //     let dimensions = {};
    //     if (gridParent && gridParent[0]) {
    //         dimensions = {
    //             height: gridParent.innerHeight() - 90,
    //             width: gridParent.innerWidth() - 30
    //         };
    //     }
    //     return dimensions;
    // },
    // getNode(_this) {
    //     var d3 = Plotly.d3;
    //     let gridParent = _this.get('gridParent');
    //     if (!_this.get('chosenColor')) {
    //         _this.set('chosenColor', _this.randomColor());
    //     }
    //     let dimensions = _this.get('dimensions')(gridParent);
    //     dimensions.height && (dimensions.height += 'px');
    //     dimensions.width && (dimensions.width += 'px');
    //     var gd3 = d3.select('#' + _this.get('randomId'))
    //         .style(dimensions);

    //     return gd3.node();

    // },
    // groupBy(data, type) {
    //     var result = [];

    //     data.forEach(function (item) {
    //         var hasType = result.findBy('type', item.get(type));

    //         if (!hasType) {
    //             result.pushObject(Ember.Object.create({
    //                 type: item.get(type),
    //                 contents: []

    //             }));

    //         }

    //         result.findBy('type', item.get(type)).get('contents').pushObject(item);
    //     });
    //     return result;
    // },
    // hiddenJsonData: Ember.computed('jsonData', function () {
    //     return 'hidden';
    // }),

    convertToTimeDisplay(x) {
        let date = Date.parse(x);
        let dateMatch = (x && x.toString().match('-') != null);
        if (date.toString() != 'NaN' && dateMatch) {
            return moment(x).format();
        }
        return x;

    },

    eChartMapping: {
        'Line': 'line',
        'Bars': 'bar',
        'Area': 'line',
        'Bubble': 'scatter',
        'Pie': 'pie',
        'Funnel': 'funnel'
    },
    chartDimensionsObserver: Ember.on('init', Ember.observer('jsonData',
        function () {
            var data = this.get('results');
            var x1 = this.get('x1');
            var x2Values = this.get('x2Values');
            var ogMultipleYs = this.get('multipleYs');
            if (data && x1 && ogMultipleYs && ogMultipleYs.length >= 0) {
                var multipleYs = ogMultipleYs.map((y) => {
                    return y ? data.columns.indexOf(y.columnName) : -1;
                }).filter((i) => {
                    return i >= 0;
                }).map((y) => {
                    return data.columns[y];
                });
                var dimensions = [x1];
                var series = [];
                multipleYs.forEach((y) => {
                    let selectedChartType = ogMultipleYs.filter((yObj) => {
                        return yObj && yObj.columnName === y;
                    })[0].chartType || this.get('defaultChartType') || '';
                    let itemStyle = null;
                    if (selectedChartType.toLowerCase() == 'area') {
                        itemStyle = {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                }
                            }
                        };
                    }
                    if (x2Values) {
                        x2Values.forEach((x2Value) => {
                            let seriesName = null;
                            if (multipleYs.length === 1) {
                                seriesName = this.display(x2Value);
                                dimensions.push(seriesName);
                            } else {
                                seriesName = `${this.display(x2Value)}-${this.display(y)}`;
                                dimensions.push(seriesName);
                            }
                            series.push({
                                type: this.eChartMapping[selectedChartType],
                                name: seriesName,
                                itemStyle: itemStyle,
                                stack: this.get('isStacked'),
                                barGap: '5%'
                            });
                        });
                    } else {

                        series.push({
                            type: this.eChartMapping[selectedChartType],
                            name: y,
                            itemStyle: itemStyle,
                            stack: this.get('isStacked'),
                            barGap: '5%'
                        });
                        dimensions.push(y);
                    }

                });
                this.set('chartDimensions', dimensions);
                this.set('series', series);

            }
        })),
    x2Values: Ember.computed('x2', 'results', function () {
        var data = this.get('results');
        var x2 = this.get('x2');
        x2 = data.columns.indexOf(x2);
        return (x2 >= 0) && this.unique(data.rows.map((item) => {
            return item[x2];
        }));
    }),
    compareOnType(a, b) {
        let type = 'category';
        if (!isNaN(+a) || !isNaN(+b)) {
            type = 'number';
        }
        let date1 = Date.parse(a);
        let date2 = Date.parse(b);
        let dateMatch1 = (a && a.toString().match('-') != null);
        let dateMatch2 = (b && b.toString().match('-') != null);
        if ((date1.toString() != 'NaN') || (date2.toString() != 'NaN') && (dateMatch1 || dateMatch2)) {
            type = 'date';
        }

        if (type === 'category') {
            if (a < b) {
                return 1;
            } else {
                return -1;
            }

        } else if (type === 'number') {
            return a - b;
        } else {
            return moment(a) - moment(b);
        }

    },
    seriesWithData: Ember.computed('jsonData', 'series', function () {
        let jsonData = this.get('jsonData');
        let series = this.get('series');
        let seriesWithData = jsonData && series && series.map((item, index) => {
            let data = [];
            if (this.get('defaultChartType') != 'Pie' && this.get('defaultChartType') != 'Funnel') {

                data = jsonData.map((d) => {
                    return [d[0], d[index + 1]];
                }).filter((item) => {
                    return item[1];
                }).sort((a, b) => {
                    return this.compareOnType(a[0], b[0]);
                });
            } else {
                data = jsonData.map((d) => {
                    return {
                        name: d[0],
                        value: d[index + 1]
                    };
                }).filter((item) => {
                    return item['value'];
                }).sort((a, b) => {
                    return this.compareOnType(a['name'], b['name']);
                });
            }
            item['data'] = data;
            if (item['type'] == 'scatter') {
                let max = Math.max.apply(null, data.map((d) => {
                    return d[1];
                }));
                item['symbolSize'] = function (value) {
                    return Math.round((value[1] / max) * 100 + 5);
                };
            } else if (this.get('defaultChartType') == 'Pie' || this.get('defaultChartType') === 'Funnel') {
                item['radius'] = ['50%', '80%'];
                item['center'] = ['60%', '50%'];
                item['type'] = this.eChartMapping[this.get('defaultChartType')];
                item['labelLine'] = {
                    normal: {
                        show: true
                    }
                };
                item['label'] = {
                    show: true,
                    formatter: (params) => {
                        return this.formatter(params.name) +
                            ': ' + params.percent + '%';
                    }
                };
                item['itemStyle'] = {
                    borderColor: '#fff',
                    borderWidth: 1,
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                };
                if (this.get('defaultChartType') === 'Funnel') {
                    item['left'] = '20%';
                    item['width'] = '60%';
                }
            }
            return item;
        });
        return seriesWithData;
    }),
    jsonData: Ember.computed('x1', 'x2',
        'multipleYs.@each.separateYaxis',
        'multipleYs.@each.columnName',
        'multipleYs.@each.chartType',
        'multipleYs.@each.lineShape',
        'isStacked',
        'results',
        function () {
            var data = this.get('results');
            var multipleYs = this.get('multipleYs');
            var x1 = this.get('x1');
            var x2 = this.get('x2');
            if (data && x1 && multipleYs && multipleYs.length >= 0) {
                var x2 = data.columns.indexOf(x2);
                var x1 = data.columns.indexOf(x1);
                var multipleYs = multipleYs.map((y) => {
                    return y ? data.columns.indexOf(y.columnName) : -1;
                }).filter((i) => {
                    return i >= 0;
                });

                let x2Values = this.get('x2Values');



                var tableData = [];
                data.rows.forEach((item) => {
                    var row = [this.display(item[x1])];
                    multipleYs.forEach((y) => {
                        if (x2Values) {
                            x2Values.forEach((x2Value) => {
                                if (item[x2] == x2Value) {
                                    row.push(this.display(item[y]));
                                } else {
                                    row.push(null);
                                }
                            });
                        } else {
                            row.push(this.display(item[y]));

                        }


                    });
                    tableData.push(row);
                });
                return tableData;
                // let xhash = {};
                // data.rows.forEach((item) => {
                //     xhash[this.get('display')(item[x1])] = {};
                //     multipleYs.forEach((y) => {
                //         xhash[this.get('display')(item[x1])][data.columns[y]] = this.get('display')(item[y]);
                //     });
                // });
                // let jsonData = [];
                // let x1Dimension = data.columns[x1];
                // Object.keys(xhash).forEach((key) => {
                //     xhash[key][x1Dimension] = key;
                //     jsonData.push(xhash[key]);
                // });
                // return jsonData;
                // data = multipleYs.map((y) => {
                //     let d = data.rows.map((item) => {
                //         return Ember.Object.create({
                //             x1: item[x1],
                //             displayX1: this.get('display')(item[x1]),
                //             x2: item[x2],
                //             displayX2: this.get('display')(item[x2]),
                //             y: item[y],
                //             displayY: this.get('display')(item[y]),
                //         });
                //     });
                //     return this.get('groupBy')(d, 'x2');
                // });
                // return data;
            }
        }),
    x1: Ember.computed.alias('resultsViewSettings.x1'),
    resultsObserverThatSetsX1: Ember.on('init', Ember.observer('results', 'x1', function () {
        if (!this.get('resultsViewSettings.x1')) {
            let results = this.get('results');
            let rows = results && results.rows.length && results.rows[0];
            let found = null;

            // if (this.get('resultsViewType') == 'Pie' || this.get('resultsViewType') == 'Funnel') {
            //     if (rows) {

            //         for (var i = 0; i < rows.length; i++) {
            //             if (this.findIfNumber(rows[i])) {
            //                 (found = i);
            //                 break;
            //             }
            //         }
            //         if (found == 0 || found) {
            //             this.set('x1', results.columns[i]);
            //         }
            //     }
            // } else {
            if (rows) {
                for (var i = 0; i < rows.length; i++) {
                    if (this.findIfDate(rows[i])) {
                        (found = i);
                        break;
                    }
                }
                if (found == 0 || found) {
                    return this.set('x1', results.columns[i]);
                }
                for (var i = 0; i < rows.length; i++) {
                    if (this.findIfNumber(rows[i])) {
                        (found = i);
                        break;
                    }
                }
                if (found == 0 || found) {
                    return this.set('x1', results.columns[i]);
                }
            }
            // }
        }
    })),
    // resultsObserverThatChecksCords: Ember.on('init', Ember.observer('results', 'x2', "multipleYs", "x1", function(){
    //     let x1 = this.get('x1')
    //     let x2 = this.get('x2')
    //     let multipleYs = this.get('multipleYs')
    //     this.set("multipleYs", multipleYs && multipleYs.filter(function(item){
    //         return (item.columnName != x1) || (item.columnName != x2)
    //     }))
    // })),
    // resultsObserverThatSetsX2: Ember.on('init', Ember.observer('results', 'x2', function () {
    //     if (!this.get('resultsViewSettings.x1')) {
    //         let results = this.get('results');
    //         let rows = results && results.rows.length && results.rows[0];
    //         let row = rows && rows.length && rows[0];
    //         let found = null;
    //         if (!(this.get('resultsViewType') == 'Pie')) {
    //             if (row) {
    //                 for (var i = 0; i < row.length; i++) {
    //                     if (!(this.findIfDate(row[i]) || this.findIfNumber(row[i]))) {
    //                         let items = rows.map(function (item) {
    //                             return item && item[i];
    //                         });
    //                         let canBeSet = (this.unique(items)).length <= 10;
    //                         if (canBeSet) {
    //                             (found = i);
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 if (found == 0 || found) {
    //                     this.set('x2', results.columns[i]);
    //                 }
    //             }
    //         }
    //     }
    // })),


    resultsObserverThatSetsMultipleYs: Ember.on('init', Ember.observer('results', 'multipleYs', function () {
        let results = this.get('results');
        let rows = results && results.rows.length && results.rows[0];
        let multipleYs = this.get('resultsViewSettings.multipleYs');
        let found = null;
        let lengthMultipleYs = multipleYs && multipleYs.filter((item) => {
            return item.columnName;
        }).length;
        if (!multipleYs || lengthMultipleYs == 0) {
            if (rows) {
                // if (this.get('resultsViewType') == 'Pie' || this.get('resultsViewType') == 'Funnel') {
                //     for (var i = 0; i < rows.length; i++) {
                //         if (!(this.findIfDate(rows[i]) || this.findIfNumber(rows[i]))) {
                //             (found = i);
                //             break;
                //         }
                //     }
                //     if (found == 0 || found) {
                //         this.set('multipleYs', [{
                //             columnName: results.columns[i]
                //         }]);
                //     }
                // } else {
                let count = 0;
                let multipleYs = rows.filter((item, i) => {
                    let canBeSet = count < 4 &&
                        !this.findIfDate(item) &&
                        this.findIfNumber(item);
                    canBeSet && (count += 1);
                    return canBeSet;
                }).map((item) => {
                    return {
                        columnName: results.columns[rows.indexOf(item)]
                    };
                });
                if (multipleYs.length == 0) {
                    this.set('multipleYs', [{}]);
                } else {
                    this.set('multipleYs', multipleYs);
                }
                // }
            }
        }

    })),
    x2: Ember.computed.alias('resultsViewSettings.x2'),
    multipleYs: Ember.computed.alias('resultsViewSettings.multipleYs'),
    ys: Ember.on('init', Ember.observer('resultsViewSettings.y', function () {
        let multipleYs = this.get('multipleYs');
        let y = this.get('resultsViewSettings.y') || this.get('y');
        if (y && !multipleYs) {
            this.set('multipleYs', [{
                columnName: y
            }]);
        } else if (y && multipleYs) {
            if (!multipleYs.findBy('columnName', y))
                multipleYs.pushObject({
                    columnName: y
                });
        } else if (!y && multipleYs) {} else {
            this.set('multipleYs', [{
                columnName: y
            }]);
        }
    })),
    y: Ember.computed.alias('resultsViewSettings.y'),
    yLabel: Ember.computed.alias('resultsViewSettings.yLabel'),
    xLabel: Ember.computed.alias('resultsViewSettings.xLabel'),
    title: Ember.computed.alias('resultsViewSettings.title'),
    barOrientation: Ember.computed('resultsViewSettings.barOrientation', function () {
        let orientation = this.get('resultsViewSettings.barOrientation');
        if (orientation) {
            return orientation.value;
        }
        return 'v';
    }),
    isStacked: Ember.computed('resultsViewSettings.isStacked', function () {
        let mode = this.get('resultsViewSettings.isStacked');
        // if (mode) {
        //     return mode.value ? 'stacked' : false;
        // }
        return false;
    }),
    // randomId: Ember.computed(function () {

    //     return 'chart-' + Math.floor((Math.random() * 100000000000000) + 1);
    // }),

    // layout: Ember.computed('title', 'margin', 'xLabel', 'yLabel', 'jsonData', function () {
    //     let l = {
    //         legend: {
    //             orientation: 'h',
    //             y: 100
    //         },
    //         title: this.get('title'),
    //         margin: this.get('margin'),
    //         xaxis: {
    //             showgrid: false,
    //             zeroline: false,
    //             linecolor: '#e0e5ec',
    //             title: Ember.String.capitalize(this.get('xLabel') || this.get('x1')),
    //             autorange: true,
    //             ticks: 'outside',
    //             ticoklen: 6,
    //             tickcolor: '#e0e5ec',
    //             tickfont: {
    //                 size: '10'
    //             },
    //             rangemode: 'tozero',
    //             showLine: true
    //         },
    //         yaxis: {
    //             showgrid: false,
    //             zeroline: false,
    //             linecolor: '#e0e5ec',
    //             gridcolor: '#f1f1f1',
    //             title: Ember.String.capitalize(this.get('yLabel') || this.get('multipleYs')[0].columnName),
    //             autorange: true,
    //             ticks: 'outside',
    //             ticklen: 6,
    //             tickfont: {
    //                 size: '10'
    //             },
    //             tickcolor: '#e0e5ec',
    //             rangemode: 'tozero',
    //             showLine: true
    //         },
    //         hoverlabel: {
    //             bgcolor: 'black',
    //             font: {
    //                 color: 'white'
    //             }
    //         },
    //         font: {
    //             family: 'Lato',
    //             size: '1em',
    //             color: '#495057'
    //         }

    //     };

    //     this.get('multipleYs').forEach((item, i) => {
    //         if (item && item.separateYaxis && i != 0) {
    //             let yaxisName = 'yaxis' + (i + 1).toString();
    //             l[yaxisName] = {
    //                 title: item && item.columnName,
    //                 titlefont: {
    //                     color: this.get('colors')[i]
    //                 },
    //                 tickfont: {
    //                     color: this.get('colors')[i]
    //                 },
    //                 overlaying: 'y',
    //                 side: 'right'
    //             };
    //             l['margin'] = null;
    //         }
    //     });
    //     return l;

    // }),

    // legendName(item, i) {
    //     return item.get('type') || this.get('multipleYs')[i].columnName;
    // },

    getChartType(i) {
        let chartType = this.get('multipleYs')[i].chartType;
        let defaultChartType = this.get('defaultChartType');
        return Ember.String.capitalize(chartType || defaultChartType);
    },

    // mode(item) {
    //     if (item.length >= 31) {
    //         return 'lines';
    //     } else {
    //         return 'lines+markers';
    //     }
    // },
    // getMarker(x, i, j, _this) {
    //     let size = 4;
    //     let width = 2;
    //     let xLength = x.length;
    //     if (xLength > 40) {
    //         width = 1.3;
    //     }
    //     if (xLength > 200) {
    //         size = 0.1;
    //         width = 0.1;
    //     }

    //     return {
    //         symbol: 'circle',
    //         opacity: 1,
    //         size: size,
    //         color: 'white',
    //         line: {
    //             color: _this.get('colors')[i + j],
    //             width: width
    //         }

    //     };

    // },

    // // lineWidth(x) {
    //     let xLength = x.length;
    //     let lineWidth = 2;
    //     if (x.length > 40 && xLength <= 100) {
    //         lineWidth = 2;
    //     } else if (xLength > 60) {
    //         1.3;
    //     }
    //     return lineWidth;
    // },

    // chartData(item, i, j, type, _this) {
    //     let x = item.get('contents').sortBy('x1').map((el) => {
    //         return el.get('displayX1');
    //     });
    //     let y = item.get('contents').sortBy('x1').map((el) => {
    //         return el.get('displayY');
    //     });
    //     let d = null;
    //     if (type == 'Line') {
    //         d = {
    //             x: x,
    //             y: y,
    //             type: 'scatter',
    //             mode: _this.mode(item),
    //             marker: _this.get('getMarker')(x, i, j, _this),

    //             line: {
    //                 shape: _this.get('multipleYs')[i].lineShape,
    //                 width: _this.get('lineWidth')(x),
    //                 color: _this.get('colors')[i + j]
    //             },
    //             name: _this.legendName(item, i)
    //         };
    //     } else if (type == 'Bars') {
    //         d = {
    //             x: x,
    //             y: y,
    //             type: 'bar',
    //             marker: {
    //                 color: _this.get('colors')[i + j]
    //             },
    //             name: _this.legendName(item, i)
    //         };
    //     } else if (type == 'Area') {
    //         d = {
    //             x: x,
    //             y: y,
    //             // type: 'scatter',
    //             fill: 'tonexty',
    //             line: {
    //                 width: 1,
    //                 color: _this.get('colors')[i + j]
    //             },
    //             name: _this.legendName(item, i)
    //         };

    //     } else if (type == 'Bubble') {
    //         let total = item.get('contents').sortBy('x1').map((el) => {
    //             return el.get('y');
    //         }).reduce((a, b) => {
    //             return a + b;
    //         }, 0);
    //         d = {
    //             x: x,
    //             y: y,
    //             type: 'scatter',
    //             mode: 'markers',
    //             marker: {
    //                 size: item.get('contents').sortBy('x1').map((el) => {
    //                     return (+el.get('y') / total) * 600;
    //                 }),
    //                 color: _this.get('colors')[i + j],
    //             },
    //             name: _this.legendName(item, i)
    //         };
    //     }

    //     _this.get('multipleYs').forEach((item, j) => {
    //         if (item && item.separateYaxis && j != 0 && i == j) {
    //             d['yaxis'] = 'y' + (i + 1).toString();
    //         }
    //     });
    //     return d;

    // },
    // chartLine(){},

    // legendName(item, i){
    //     return item.get('type') || this.get('multipleYs')[i].columnName
    // },
    // chartMarker(i, j){
    //     return {
    //         color: this.get('colors')[i + j]
    //     }
    // },
    // dataModified(data){
    //     return data
    // },
    // chartFill: null,
    // getData(){
    //     let gridParent = this.get('gridParent')
    //         let gd = this.get('getNode')(this)
    //         var data =  this.get('jsonData'), layout;
    //         data = data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
    //             return series.map((item, j)=>{
    //                 return  {
    //                     x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
    //                     y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
    //                     type: this.get("chartType"),
    //                     mode: this.get('chartMode'),
    //                     line: this.chartLine(i, j),
    //                     fill: this.get('chartFill'),
    //                     marker: this.chartMarker(i, j, item),
    //                     name: this.legendName(item, i)
    //                 }
    //             })
    //         }));
    //         layout = data && this.get('layout')
    //         layout["barmode"]= "group"
    //         data = this.dataModified(data)
    //         data && Plotly.newPlot(gd, data, layout, {showLink: false})
    //             .then(this.get('downloadAsPNG'));
    //         data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
    //             let dimensions = _this.get('dimensions')(gridParent)
    //             Plotly.relayout(_this.get("randomId"), dimensions)
    //         });
    // }
    source: Ember.computed('jsonData', function () {
        let jsonData = this.get('jsonData');
        if (jsonData) {
            return jsonData.sort(function (a, b) {
                return a[0] - b[0];
            });

        } else {
            return [];
        }
    }),
    optionsObserver: Ember.on('init', Ember.observer('seriesWithData', 'xName', 'yName', 'opts', function () {
        Ember.run.debounce(this, function () {
            if (this.get('seriesWithData')) {
                let legendOrient = 'horizontal';
                let legendX = 'center';
                let toolTipTrigger = 'axis';
                let showXline = true;
                let showYLine = true;
                let toolTipFormatter = (params) => {
                    return '<b>' + this.titleize(this.get('xName')) + '</b>' +
                        ' : ' + this.formatter(params[0].name) + '<br/>' +
                        params.map((p) => {
                            return '<b>' + this.titleize(p.seriesName) + '</b>' + ' : ' + this.formatter(p.value[1], 0);

                        }).join('<br/>');
                };
                if (this.get('defaultChartType') == 'Pie' || this.get('defaultChartType') == 'Funnel') {
                    legendOrient = 'vertical';
                    legendX = 'left';
                    toolTipTrigger = 'item';
                    showXline = false;
                    showYLine = false;
                    toolTipFormatter = (params) => {
                        return '<b>' + this.titleize(this.get('xName')) + '</b>' +
                            ' : ' + this.formatter(params.name) + '<br/>' + '<b>' +
                            this.titleize(params.seriesName) +
                            '</b>' + ' : ' + params.value + '(' + params.percent + '%)';
                    };


                }
                let options = {
                    backgroundColor: '#fff',
                    grid: {
                        left: 80,
                        right: 15,
                    },
                    legend: {
                        type: 'scroll',
                        formatter: this.formatter,
                        pageIconColor: '#495057',
                        orient: legendOrient,
                        x: legendX,
                        left: '2%',
                        top: '2%',
                        right: 50
                    },
                    textStyle: {
                        fontFamily: 'Lato'
                    },
                    tooltip: {
                        show: true,
                        trigger: toolTipTrigger,
                        formatter: toolTipFormatter,
                        backgroundColor: this.opacity('#000000', 0.7),
                        borderColor: '#e0e5ec',
                        borderWidth: 1,
                        textStyle: {
                            color: this.opacity('#ffffff', 0.9),
                            fontSize: 12
                        },
                        enterable: true,
                        axisPointer: {
                            lineStyle: {
                                color: '#e0e5ec'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                show: true,
                                title: {
                                    zoom: 'Zoom',
                                    back: 'Restore Zoom'
                                }
                            }
                        }
                    },
                    color: this.get('colors'),
                    // Declare X axis, which is a category axis, mapping
                    // to the first column by default.
                    xAxis: {
                        show: showXline,
                        type: this.get('xType'),
                        name: this.get('xName'),
                        nameLocation: 'center',
                        nameGap: 20,
                        nameTextStyle: {
                            padding: 8,
                            color: '#495057',
                            fontSize: 12,
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#e0e5ec'
                            }
                        },
                        axisLabel: {
                            //formatter: this.formatter,
                            color: '#495057',
                            fontSize: 10
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    // Declare Y axis, which is a value axis.
                    yAxis: {
                        show: showYLine,
                        type: this.get('yType'),
                        name: this.get('yName'),
                        nameGap: 50,
                        nameLocation: 'center',
                        nameTextStyle: {
                            padding: 8,
                            color: '#495057',
                            fontSize: 12
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#e0e5ec'
                            }
                        },
                        axisLabel: {
                            formatter: this.formatter,
                            color: '#495057',
                            fontSize: 10,
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    // Declare several series, each of them mapped to a
                    // column of the dataset by default.
                    series: this.get('seriesWithData')
                };
                console.log(options);
                this.set('options', options);
                this.set('randomId', false);
                Ember.run.next(this, function () {
                    if (!this.get || !this.get('isDestroyed')) {
                        this.set('randomId', 100000 * Math.random());
                    }
                });
            }
        }, 300);
    })),
    formatter(x, index) {
        let date = Date.parse(x);
        let dateMatch = (x && x.toString().match('-') != null);
        if (date.toString() != 'NaN' && dateMatch) {
            date = moment(x);
            date = moment.tz(date, moment.tz.guess());
            if (date.hours() || date.minutes() || date.seconds()) {
                return date.format('lll');

            } else {
                return date.format('ll');
            }
        }
        return x;
    },


    determineType(data) {
        let type = null;
        data && data.every((x) => {
            if (x || x == 0 || x == false) {
                let date = Date.parse(x);
                let dateMatch = (x && x.toString().match('-') != null);
                if (date.toString() != 'NaN' && dateMatch) {
                    type = 'time';
                    return false;
                }
                if (typeof (x) == 'number') {
                    type = 'value';
                    return false;
                }
                type = 'category';
                return false;

            }
            return true;
        });
        return type;
    },
    yType: Ember.computed('jsonData', function () {
        let data = this.get('jsonData') && this.get('jsonData').map((row) => {
            return row[1];
        });
        return this.determineType(data);
    }),

    xType: Ember.computed('jsonData', function () {
        let data = this.get('jsonData') && this.get('jsonData').map((row) => {
            return row[0];
        });
        return this.determineType(data);
    }),
    xLabelObserver: Ember.on('init', Ember.observer('xLabel', function () {
        Ember.run.debounce(this, function () {
            this.set('debouncedXLabel', this.get('xLabel'));
        }, 2000);
    })),

    xName: Ember.computed('x1', 'debouncedXLabel', function () {
        return this.get('debouncedXLabel') || this.get('x1') && this.titleize(this.get('x1'));

    }),
    yLabelObserver: Ember.on('init', Ember.observer('yLabel', function () {
        Ember.run.debounce(this, function () {
            this.set('debouncedYLabel', this.get('yLabel'));
        }, 2000);
    })),
    yName: Ember.computed('multipleYs.@each', 'debouncedYLabel', function () {
        return this.get('debouncedYLabel') || this.get('multipleYs') &&
            (this.get('multipleYs').length == 1) &&
            this.get('multipleYs')[0] &&
            this.titleize(this.get('multipleYs')[0].columnName);
    }),

});
