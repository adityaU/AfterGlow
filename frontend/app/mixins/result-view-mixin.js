import Ember from 'ember';

export default Ember.Mixin.create({
    resultViewIcons: {
        'calendar': 'fe fe-calendar',
        'number': 'fe fe-hash',
        'table': 'fe fe-list',
        'line': 'fe fe-trending-up',
        'pie': 'fe fe-pie-chart',
        'funnel': 'fe fe-align-center',
        'bars': 'fe fe-bar-chart',
        'area': 'fe fe-activity',
        'bubble': 'fe fe-circle',
        'pivot table': 'fe fe-eye'
    },

    resultViewDashboardDefaultDimensions: {
        'Calendar': {
            width: 24,
            height: 44
        },
        'Number': {
            width: 12,
            height: 6
        },
        'Table': {
            width: 24,
            height: 24
        },
        'Line': {
            width: 24,
            height: 12
        },
        'Pie': {
            width: 24,
            height: 16
        },
        'Funnel': {
            width: 24,
            height: 16
        },
        'Bars': {
            width: 24,
            height: 12
        },
        'Area': {
            width: 24,
            height: 12
        },
        'Bubble': {
            width: 24,
            height: 12
        },
        'PivotTable': {
            width: 24,
            height: 12
        }
    },

    findIfDate(el) {
        let date = Date.parse(el);
        let dateMatch = el && (el.toString().match('-') != null);
        return (date.toString() != 'NaN' && dateMatch);
    },
    findIfNumber(el) {
        return (parseFloat(el).toString() != NaN.toString());
    },
    any(arr, method) {
        return arr.map((item) => {
            return method.call(this, item);
        }).reduce((a, b) => {
            return a || b;
        }, true);
    },
    all(arr, method) {
        return arr.map((item) => {
            return method.call(this, item);
        }).reduce((a, b) => {
            return a && b;
        }, true);
    },
    categoryColumnsCount(row) {
        return row.filter((item) => {
            return !(this.findIfNumber(item) || this.findIfDate(item) || null);
        }).length;
    },
    autoDetect(rows) {
        if (rows.length == 0) {
            return 'Table';
        }
        if (rows.length == 1 && rows[0].length < 10 && this.all(rows[rows.length - 1], this.findIfNumber)) {
            return 'Number';
        }
        if (rows[rows.length - 1].length == 2 && this.categoryColumnsCount(rows[rows.length - 1]) == 1 && this.any(rows[0], this.findIfNumber)) {
            return 'Pie';
        }
        if ((this.any(rows[rows.length - 1], this.findIfDate) || this.any(rows[rows.length - 1], this.findIfNumber)) &&
            this.categoryColumnsCount(rows[rows.length - 1]) <= 2 &&
            (rows[rows.length - 1].length - this.categoryColumnsCount(rows[rows.length - 1]) >= 2)) {
            return 'Line';
        }
        return 'Table';
    }
});
