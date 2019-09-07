import Ember from 'ember';


export default Ember.Component.extend({
  ascendingOrderObj: Ember.computed('additionalFilters.orderBys.@each.order.value', 'columnObj', function () {
    let column = this.get('column');
    let obj = null;
    this.get('additionalFilters.orderBys') && this.get('additionalFilters.orderBys').every((orderBy) => {
      if (orderBy.get('column.name') == column && orderBy.get('order.value') == 'ASC') {
        obj = orderBy;
        return false;
      }
      return true;
    });
    return obj;

  }),

  descendingOrderObj: Ember.computed('additionalFilters.orderBys.@each.order.value', 'columnObj', function () {
    let column = this.get('column');
    let obj = null;
    this.get('additionalFilters.orderBys') && this.get('additionalFilters.orderBys').every((orderBy) => {
      if (orderBy.get('column.name') == column && orderBy.get('order.value') == 'DESC') {
        obj = orderBy;
        return false;
      }
      return true;
    });
    return obj;

  }),

  showGroupBy: Ember.computed('additionalFilters.groupBys.[]', 'columnObj', function () {
    let column = this.get('column');
    let show = true;
    this.get('additionalFilters.groupBys') && this.get('additionalFilters.groupBys').every((groupBy) => {
      if (groupBy.get('selected.name') == column) {
        show = false;
        return false;
      }
      return true;
    });
    return show;
  }),

  columnObj: Ember.computed('column', function () {

    return {
      name: this.get('column'),
      human_name: this.get('column'),
      data_type: this.figureOutDataType()
    };
  }),


  figureOutDataType() {
    let rows = this.get('results.rows');
    let columns = this.get('results.columns');
    let index = columns.indexOf(this.get('column'));

    let dataType = 'Not Relevent';
    rows.every((row) => {
      if (moment(row[index], moment.ISO_8601, true).isValid()) {
        dataType = 'datetime';
        return false;
      }
      return true;
    });
    return dataType;
  },

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
  addCountView() {

  },
  actions: {
    addAscendingOrder() {
      if (this.get('descendingOrderObj')) {
        this.set('descendingOrderObj.order', Ember.Object.create({ name: 'Ascending', value: 'ASC' }));
      } else {

        this.get('additionalFilters.orderBys').pushObject(Ember.Object.create({
          column: this.get('columnObj'),
          order: Ember.Object.create({
            name: 'Ascending',
            value: 'ASC'
          })
        }));
      }
      this.sendAction('apply');
    },
    addDescendingOrder() {
      if (this.get('ascendingOrderObj')) {
        this.set('ascendingOrderObj.order', Ember.Object.create({ name: 'Descending', value: 'DESC' }));
      } else {

        this.get('additionalFilters.orderBys').pushObject(Ember.Object.create({
          column: this.get('columnObj'),
          order: Ember.Object.create({
            name: 'Descending',
            value: 'DESC'
          })
        }));
      }
      this.sendAction('apply');
    },
    addGroupBy(value) {
      if (value) {
        this.get('additionalFilters.groupBys').pushObject(Ember.Object.create({ selected: this.get('columnObj'), castType: value }));
      } else {

        this.get('additionalFilters.groupBys').pushObject(Ember.Object.create({ selected: this.get('columnObj') }));
      }
      this.get('additionalFilters.views').pushObject(Ember.Object.create({ selected: { name: 'Count', value: 'count' } }));
      this.set('resultsViewType', 'bar');
      this.sendAction('apply');
    },
  }
});
