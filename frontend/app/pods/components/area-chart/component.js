import Ember from 'ember';
import UtilsFunctions from 'frontend/mixins/utils-functions';

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend(UtilsFunctions, {

    didInsertElement() {
        this.get('getData')(this);
    },
    data: Ember.observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function () {
        Ember.run.next(this, function () {
            this.get('getData')(this);
        });
    }),
    stackedArea(traces) {
        for (var i = 1; i < traces.length; i++) {
            for (var j = 0; j < (Math.min(traces[i]['y'].length, traces[i - 1]['y'].length)); j++) {
                traces[i]['y'][j] += traces[i - 1]['y'][j];

            }

        }
        return traces;

    },

    defaultChartType: 'Area',

    getData(_this) {}
});
