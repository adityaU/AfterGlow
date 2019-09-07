import Ember from 'ember';
import FilterOperatorMixin from 'frontend/mixins/filter-operator-mixin';

export default Ember.Component.extend(FilterOperatorMixin, {
  state: 1,
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

  availableOperators: Ember.computed('filter.column', function () {
    return this.findAvailableOperators(this.getDefaultValuesforColumn(this.get('filter.column.data_type')));
  }),

  showDatePicker: Ember.computed('filter.column', function () {
    let dataType = this.get('filter.column.data_type');
    if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone') || dataType == 'timestamp') {
      return true;
    } else {
      return false;
    }
  }),
  columnObserver: Ember.observer('filter.column', function () {
    if (this.get('filter.value')) {
      this.set('filter.value', null);
    }
    if (this.get('showDatePicker')) {
      this.set('filter.valueDateObj', { date: true });
    } else {
      this.set('filter.valueDateObj', { date: false });
    }
  }),
  operatorObserver: Ember.on('init', Ember.observer('filter.operator', function () {
    if (['is NULL', 'is NOT NULL'].indexOf(this.get('filter.operator.value')) >= 0) {
      //this.set('filter.value', null);
      // this.set('filter.valueDateObj', Ember.Object.create({ date: false }));
    }
  })),
  selectDefaultOperator: Ember.observer('filter.column', function () {
    let defaultValue = this.getDefaultValuesforColumn(this.get('filter.column.data_type'));
    let dataType = this.guessDataType(defaultValue);
    let defaultSelectedOperator = null;
    if (dataType == 'datetime') {
      defaultSelectedOperator = '>';
    } else if (dataType == 'number') {
      defaultSelectedOperator = '>';

    } else if (dataType == 'string') {

      defaultSelectedOperator = '=';
    }
    if (defaultSelectedOperator) {
      let defualtSelectedOperatorObject = this.operators.filter((item) => {
        return item.value == defaultSelectedOperator;
      });

      this.set('filter.operator', defualtSelectedOperatorObject[0]);
    }
  }),
  actions: {

    mutState(state) {
      this.set('state', state);
    },
    addNewFilter() {
      this.set('state', 1);
      this.sendAction('addNewFilter');
      this.send('close');
    },
    switchToBuilder() {
      this.sendAction('switchToBuilder', ...arguments);
    },

    switchToRaw() {
      this.sendAction('switchToRaw', ...arguments);
    },
    close() {
      $('body').trigger('click');
    }
  }

});
