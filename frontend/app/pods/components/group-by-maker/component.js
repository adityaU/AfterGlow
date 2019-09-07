import Ember from 'ember';

export default Ember.Component.extend({
  state: 1,
  selectedGroupBy: Ember.computed('groupBy.selected', 'columns', function () {
    let selected = this.get('groupBy.selected');
    let columns = this.get('columns');
    if (selected && columns) {
      return this.get('columns').findBy(
        'human_name',
        Ember.Object.create(selected).get('human_name')
      );
    }
  }),

  filteredColumns: Ember.computed('columns', 'columnQuery', function () {
    let columns = this.get('columns');
    let columnQuery = this.get('columnQuery');
    if (columns && columnQuery) {
      return columns.filter(function (item) {
        return item.get('human_name') && item.get('human_name').toLowerCase().match(columnQuery.toLowerCase());
      });
    } else {
      return columns;
    }
  }),
  isGroupByDateType: Ember.computed('groupBy.selected', function () {
    let dataType = this.get('groupBy.selected.data_type');
    if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone') || dataType == 'timestamp') {
      return true;
    } else {
      return false;
    }

  }),

  groupByDateTypes: [{
    name: 'As It is',
    value: null
  },
  {
    name: 'by Seconds',
    value: 'seconds'
  },
  {
    name: 'by Minute',
    value: 'minutes'
  },
  {
    name: 'by Day',
    value: 'day'
  },
  {
    name: 'by Hour',
    value: 'hour'
  },
  {
    name: 'by Week',
    value: 'week'
  },
  {
    name: 'by Month',
    value: 'month'
  },
  {
    name: 'by Quarter',
    value: 'quarter'
  },
  {
    name: 'by year',
    value: 'year'
  },
  {
    name: 'by Hour of the day',
    value: 'hour_day'
  },
  {
    name: 'by Day of the week',
    value: 'day_week'
  },
  {
    name: 'by week of year',
    value: 'week_year'
  },
  {
    name: 'by month of year',
    value: 'month_year'
  },
  {
    name: 'by quarter of year',
    value: 'quarter_year'
  }
  ],
  actions: {
    switchToBuilder(type, el, handleSelected) {
      this.sendAction('switchToBuilder', type, el, handleSelected);
    },
    switchToRaw(type, el, handleSelected) {
      this.sendAction('switchToRaw', type, el, handleSelected);
    },
    selectedColumn() {
      if (this.get('isGroupByDateType')) {
        this.set('state', 2);
      } else {
        this.send('addNewGroupBy');
      }
    },
    addNewGroupBy() {
      this.set('state', 1);
      this.sendAction('addNewGroupBy');
      this.send('close');
    },
    mutState(state) {
      this.set('state', state);
    },
    close() {
      $('body').trigger('click');
    }
  }
});
