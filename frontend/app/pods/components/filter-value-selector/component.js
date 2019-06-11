import Ember from 'ember';

export default Ember.Component.extend({
    valueObserver: Ember.observer('filter.value', function () {
        this.setAllOtherFalse(this)
        let cv = this.get('sortedColumnValues').findBy("value", this.get('filter.value'))
        cv && cv.set('selected', true);
        this.set('filter.valueDateObj', { date: false });
    }),
    columnObserver: Ember.observer('filter.column', function () {
        this.set('filter.value', null);
        if (this.get('showDatePicker')) {
            this.set('filter.valueDateObj', { date: true });
        } else {
            this.set('filter.valueDateObj', { date: false });
        }
    }),
    valueDateObjObserver: Ember.observer('filter.valueDateObj.value', 'filter.valueDateObj.duration', 'filter.valueDateObj.dtt', function () {
        if (this.get('filter.valueDateObj.date')) {
            this.set('filter.value', null);
        }
    }),
    sortedColumnValues: Ember.computed("filter.column", "filter.column.column_values.content.isLoaded", function () {
        let columnValues = this.get('filter.column.column_values')
        return columnValues && columnValues.sortBy('displayName') || [];
    }),

    showDatePicker: Ember.computed('filter.column', function () {
        let dataType = this.get('filter.column.data_type')
        if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone') || dataType == 'timestamp') {
            return true
        } else {
            return false
        }

    }),
    durations: [
        { name: "Seconds", value: "seconds" },
        { name: "Minutes", value: "minutes" },
        { name: "Hours", value: "hours" },
        { name: "Days", value: "days" },
        { name: "Weeks", value: "weeks" },
        { name: "Months", value: "months" },
        { name: "Quarters", value: "quarters" },
        { name: "Years", value: "years" },
    ],
    dateTimeTypes: [
        { name: "Ago", value: "ago" },
        { name: "After", value: "after" }

    ],
    setAllOtherFalse(_this) {
        _this.get('sortedColumnValues') && _this.get('sortedColumnValues').forEach((item) => {
            item.set('selected', false);
        }) || []
    },

    actions: {
        selectOption(cv) {
            this.setAllOtherFalse(this)
            this.set("filter.value", cv.get("value"))
            cv.set('selected', true);
        }
    }
})
