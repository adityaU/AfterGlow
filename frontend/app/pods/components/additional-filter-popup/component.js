import Ember from 'ember';

export default Ember.Component.extend({
  columns: Ember.computed("results", function(){
    if (this.get('results.columns')){
      return this.get('results.columns').map(function(item){
        return {
          name: item,
          value: item
        }
      })
    }
  }),
  groupBySelection: [],
  filterSelection: [],
  filterOptions: Ember.computed('el', 'index', 'results', function(){
    let columnName = this.get('results.columns')[this.get('index')]
    let el = this.get('el')
    return [
      {
        name: `${columnName} is greater than ${el}`,
        value: {
          column_name: columnName,
          operator: ">",
          value: el
        }
      },
      {
        name: `${columnName} is greater than or equal to ${el}`,
        value: {
          column_name: columnName,
          operator: ">=",
          value: el
        }
      },
      {
        name: `${columnName} is less than ${el}`,
        value: {
          column_name: columnName,
          operator: "<",
          value: el
        }
      },

      {
        name: `${columnName} is less than or equal to ${el}`,
        value: {
          column_name: columnName,
          operator: "<=",
          value: el
        }
      },
      {
        name: `${columnName} is equal to ${el}`,
        value: {
          column_name: columnName,
          operator: "=",
          value: el
        }
      },

      {
        name: `${columnName} is not equal to ${el}`,
        value: {
          column_name: columnName,
          operator: "!=",
          value: el
        }
      }
    ]
  }),
  keyboardShortcuts: {
    "esc": 'hideThisPopup',
  }
});
