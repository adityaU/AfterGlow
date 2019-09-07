import Ember from 'ember';
import HelperMixin from 'frontend/mixins/helper-mixin';
export default Ember.Component.extend(HelperMixin, {
  valueObserver: Ember.observer('filter.value', function () {
    this.setAllOtherFalse(this);
    let cv = this.get('sortedColumnValues').findBy('value', this.get('filter.value'));
    cv && cv.set('selected', true);
    this.set('filter.valueDateObj', { date: false });
  }),
  valueDateObjObserver: Ember.observer('filter.valueDateObj.value', 'filter.valueDateObj.duration', 'filter.valueDateObj.dtt', function () {
    if (this.get('filter.valueDateObj.value') || this.get('filter.valueDateObj.duration') || this.get('filter.valueDateObj.dtt')) {
      this.set('filter.value', null);
      this.set('filter.valueDateObj.date', true);
    }
  }),
  sortedColumnValues: Ember.computed('filter.column', 'filter.column.column_values.content.isLoaded', function () {
    let columnValues = this.get('filter.column.column_values');
    return columnValues && columnValues.sortBy('displayName') || [];
  }),

  durations: [
    { name: 'Seconds', value: 'seconds' },
    { name: 'Minutes', value: 'minutes' },
    { name: 'Hours', value: 'hours' },
    { name: 'Days', value: 'days' },
    { name: 'Weeks', value: 'weeks' },
    { name: 'Months', value: 'months' },
    { name: 'Quarters', value: 'quarters' },
    { name: 'Years', value: 'years' },
  ],
  dateTimeTypes: [
    { name: 'Ago', value: 'ago' },
    { name: 'After', value: 'after' }

  ],
  setAllOtherFalse(_this) {
    _this.get('sortedColumnValues') && _this.get('sortedColumnValues').forEach((item) => {
      item.set('selected', false);
    }) || [];
  },

  shouldGetColumnSuggestions(column) {
    let columnDataType = column && ((column.get && column.get('data_type')) || column.data_type);
    return columnDataType && (columnDataType.match('char') || columnDataType.match('string'));
  },

  suggestionsObserver: Ember.on('init', Ember.observer('filter.column', 'filter.value', function () {
    if (this.get('filter.column.id')) {
      if (this.get('filter.value') && this.get('filter.value') != '' && this.shouldGetColumnSuggestions(this.get('filter.column'))) {
        this.get('ajax').apiCall({
          url: this.get('ajax.apiPath') + '/column_suggestions_autocomplete' +
            '&query=' + this.get('filter.value') + '&column_id=' + this.get('filter.column.id'),
          type: 'GET',
        }, (response, status) => {
          this.set('suggestions', response);
        }, (error, status) => {
        });
      } else {
        this.set('suggestions', this.get('sortedColumnValues'));
      }
    } else {
      this.set('suggestions', this.findLocalSuggestionsForColumn(this.get('filter.column.name'), this.get('filter.value')));
    }
  })),

  findLocalSuggestionsForColumn(columnName, query) {
    let columns = this.get('results.columns');
    let rows = this.get('results.rows');
    if (columns && rows) {
      let index = columns.indexOf(columnName);
      let suggestions = rows.filter((item) => {
        if (query) {
          return item.toString().match(query);
        } else {
          return true;
        }
      }).map((item) => {
        return Ember.Object.create({
          displayName: item[index]
        });
      });
      return this.uniqueByProperty(suggestions, 'displayName').sort((a, b) => {
        if (a.get('displayName') < b.get('displayName')) {
          return -1;
        } else {
          return 1;
        }
      }).slice(0, 10);
    }
    return [];
  },

  actions: {
    mutFilterValue(value) {
      this.set('filter.value', value);
    }
  }
});
