import Ember from 'ember';
import UtilsFunctions from 'frontend/mixins/utils-functions';

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend(UtilsFunctions, {
    didInsertElement() {
        this.get('getData')(this);
    },
    data: Ember.observer('jsonData', 'layout', function () {
        Ember.run.next(this, function () {
            this.get('getData')(this);
        });
    }),
    defaultChartType: 'Line',
    opts: Ember.computed('jsonData', function () {
        return this.get('dimensions');
    }),
    source: Ember.computed('jsonData', function () {
        let jsonData = this.get('jsonData');
        if (jsonData) {
            return jsonData;

        } else {
            return [];
        }
    }),
    options: Ember.computed('jsonData', function () {
        return {
            legend: {
                data: this.get('chartDimensions') && this.get('chartDimensions').slice(1, this.get('chartDimensions').length)
            },
            tooltip: {},
            dataset: {
                // Provide data.
                dimensions: this.get('chartDimensions'),
                source: this.get('source')
            },
            color: this.get('colors'),
            // Declare X axis, which is a category axis, mapping
            // to the first column by default.
            xAxis: {
                type: this.get('xType'),
                name: this.get('xName'),
                nameLocation: 'center',
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
                    color: '#495057',
                    fontSize: 10
                },
                splitLine: {
                    show: false
                }
            },
            // Declare Y axis, which is a value axis.
            yAxis: {
                type: this.get('yType'),
                name: this.get('yName'),
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
                    color: '#495057',
                    fontSize: 10,
                },
                splitLine: {
                    show: false
                }
            },
            // Declare several series, each of them mapped to a
            // column of the dataset by default.
            series: this.get('series')
        };
    }),

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

    xName: Ember.computed('x1', function () {
        return this.get('x1');
    }),
    yName: Ember.computed('multipleYs', function () {
        return this.get('multipleYs') &&
            (this.get('multipleYs').length == 1) &&
            this.get('multipleYs')[0] &&
            this.get('multipleYs')[0].columnName;
    }),

    getData(_this) {

        // let gd = _this.get('getNode')(_this);
        // let gridParent = _this.get('gridParent');
        // var data = _this.get('jsonData'),
        //     layout;
        // data = data && data.length > 0 && [].concat.apply([], data.map((series, i) => {
        //     return series.map((item, j) => {
        //         return _this.chartData(item, i, j, _this.getChartType(i), _this);
        //     });
        // }));
        // layout = data && _this.get('layout');
        // data && Plotly.newPlot(gd, data, layout, {
        //     modeBarButtonsToRemove: ['sendDataToCloud'],
        //     displaylogo: false,
        //     showLine: false
        // })
        //     .then(_this.get('downloadAsPNG'));
        // data && gridParent[0] && gridParent[0].addEventListener('plotlyResize', function () {
        //     let dimensions = _this.get('dimensions')(gridParent);
        //     Plotly.relayout(_this.get('randomId'), dimensions);
        // });
        // data && gd && gd.addEventListener('plotlyResize', function () {
        //     Plotly.Plots.resize(document.getElementById(_this.get('randomId')));
        // });
    }
});
