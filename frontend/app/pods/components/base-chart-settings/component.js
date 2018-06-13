import Ember from 'ember';
import UtilsFunctions from 'frontend/mixins/utils-functions';

export default Ember.Component.extend(UtilsFunctions, {
    chartTypes: Ember.computed(function () {
        return ['Line', 'Bars', 'Area', 'Bubble'];
    }),
    barOrientations: [{
        title: 'Horizontal',
        value: 'h'
    }, {
        title: 'Vertical',
        value: 'v'
    }],
    resultsColumnsHash: Ember.computed('results.columns', function () {
        return this.get('results.columns') && this.get('results.columns').map(function (item) {
            return Ember.Object.create({
                columnName: item
            });
        });
    }),
    x1Hash: Ember.computed('resultsViewSettings.x1', function () {
        return this.get('resultsViewSettings.x1') && Ember.Object.create({
            columnName: this.get('resultsViewSettings.x1')
        });
    }),
    x2Hash: Ember.computed('resultsViewSettings.x2', function () {
        return this.get('resultsViewSettings.x2') && Ember.Object.create({
            columnName: this.get('resultsViewSettings.x2')
        });
    }),
    lineShapeTypes: [{
        name: 'smooth',
        value: 'spline'
    },
    {
        name: 'straight',
        value: 'linear'
    }
    ],
    isStacked: {
        name: 'Group',
        value: false
    },
    stackModes: [{
        title: 'Stacked',
        value: true
    },
    {
        title: 'Group',
        value: false
    }
    ],
    x1Name: 'x1',
    x2Name: 'x2',
    yName: 'y',
    actions: {
        clearx2() {
            this.set('x2', null);
        },
        addYColumn() {
            let multipleYs = this.get('multipleYs');
            if (multipleYs) {
                multipleYs.pushObject(null);
            } else {
                this.set('multipleYs', [{}]);
            }
        },
        removeColumn(data) {
            this.get('multipleYs').removeObject(data);
        },
        updateSelection(el, selection) {
            if (selection) {
                this.set(el, selection.get('columnName'));
            } else {
                this.set(el, null);
            }
        },
        selectLineShapeType(y, shape) {
            y.set('lineShape', shape);
        },
        updateY(index, selection) {
            if (selection) {
                this.get('multipleYs').replace(index, 1, [Ember.Object.create({
                    columnName: selection.get('columnName')
                })]);
            } else {
                this.get('multipleYs').replace(index, 1, [null]);
            }
        }
    }
});
