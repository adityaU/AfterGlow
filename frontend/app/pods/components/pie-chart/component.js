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
    defaultChartType: 'Pie',

    total: Ember.computed('jsonData', function () {
        let data = this.get('jsonData');
        return data && data.length >= 0 && data[0] && data[0].length > 0 &&
            data[0][0].get('contents').map((el) => {
                return el.get('x1');
            }).reduce((a, b) => a + b, 0);
    }),

    getData(_this) {}
});
