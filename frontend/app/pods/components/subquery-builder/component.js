import Ember from 'ember';

export default Ember.Component.extend({

  selectedTable: null,
  unsortedTables: Ember.computed('queryObject.database', 'databases.content.isLoaded', 'queryObject.database.id', 'database.tables.content.isLoaded', function () {
    if (this.get('queryObject.database') && this.get('databases.length') && this.get('queryObject.database.id')) {
      let store = this.get('store');
      let database = store.peekRecord('database', this.get('queryObject.database.id')) || store.findRecord('database', this.get('queryObject.database.id'));
      return database && database.get('tables');
    }
  }),

  canShowTableWidget: Ember.computed('queryObject.database.name', function () {
    return !!this.get('queryObject.database.name');
  }),
  canShowFilters: Ember.computed('queryObject.database.name', 'queryObject.table.human_name', 'queryObject.table.title', function () {
    return !!(this.get('queryObject.database.name') && (this.get('queryObject.table.human_name') || this.get('queryObject.table.title')));
  }),

  questions: Ember.computed('questionQuery', function () {
    if (!this.get('queryObject.database.id')) {
      return [];
    }
    return this.store.query('question', {
      database_id: this.get('queryObject.database.id'),
      query: (this.get('questionQuery') || '')
    });
  }),
  tables: Ember.computed('unsortedTables', 'tableQuery', 'unsortedTables.content.isLoaded', function () {
    let tables = this.get('unsortedTables') && this.get('unsortedTables').sortBy('human_name');
    let tableQuery = this.get('tableQuery');
    if (tables && tableQuery) {
      return tables.filter(function (item) {
        return item.get('human_name') && item.get('human_name').toLowerCase().match(tableQuery.toLowerCase());
      });
    } else {
      return tables;
    }
  }),
  tablesObserver: Ember.observer('tables', function () {
    if (this.get('tables') && !this.get('tables').isAny('id', this.get('queryObject.table.id'))) {
      this.set('queryObject.table', null);
      this.set('queryObject.filters', []);
      this.set('queryObject.groupBys', []);
      this.set('queryObject.orderBys', []);
      this.set('queryObject.rawQuery', null);
    }

  }),

  // columnsObserver:  Ember.observer('columns', function(){
  //     if (!this.get('columns').isAny('id', this.get('queryObject.filters.0.column.id'))){
  //         this.set('queryObject.filters', []);
  //     }
  //     if (!this.get('columns').isAny('id', this.get('queryObject.groupBys.0.column.id'))){
  //         this.set('queryObject.groupBys', []);
  //     }
  //     if (!this.get('columns').isAny('id', this.get('queryObject.orderBys.0.column.id'))){
  //         this.set('queryObject.orderBys', []);
  //     }
  // }),
  filters: [{
    column: 'c1',
    operator: 'Not In',
    value: 5
  }],
  selectViews: [{
    selected: {
      name: 'Count',
      value: 'count'
    }
  }],
  questionResultsObserver: Ember.on('init', Ember.observer('queryObject.table', function () {
    let question = this.get('queryObject.table');
    if (this.get('queryObject.fromQuestion') && question) {
      let question = this.get('queryObject.table');
      this.get('store').query('question', {
        filter: {
          id: question.id
        }
      });
    }
  })),
  unsortedColumns: Ember.computed('queryObject.table', 'tables.content.isLoaded', function () {
    if (this.get('queryObject.table') && this.get('tables.length') && this.get('queryObject.table.id')) {
      let store = this.get('store');
      let table = this.get('tables').findBy('id', this.get('queryObject.table.id'));
      return table && table.get('columns');
    }
  }),

  columns: Ember.computed('unsortedColumns', 'unsortedColumns.content.isLoaded', 'queryObject.table.cached_results', function () {
    let fromQuestion = this.get('queryObject.fromQuestion');
    if (!fromQuestion) {
      return this.get('unsortedColumns') && this.get('unsortedColumns').sortBy('name');
    } else {
      return this.get('queryObject.table') && this.get('queryObject.table.cached_results.columns') && this.get('queryObject.table.cached_results.columns').map((item, index) => {
        return {
          name: item,
          human_name: item,
          data_type: this.figureOutDataType(index)
        };
      });

    }
  }),
  figureOutDataType(index) {
    let dataType = 'Not Relevent';
    this.get('queryObject.table.cached_results.rows') &&
            this.get('queryObject.table.cached_results.rows').every((row) => {
              if (moment(row[index], moment.ISO_8601, true).isValid()) {
                dataType = 'datetime';
                return false;
              }
              return true;
            });
    return dataType;
  },

  rawObject: Ember.computed(function () {
    return Ember.Object.extend({
      selected: null,
    });
  }),
  rawObjectWithSelected(_this) {
    let selected = _this.get('rawObject').create();
    selected.set('selected', Ember.Object.create({
      raw: false,
      value: null
    }));
    selected.set('castType', Ember.Object.create({}));
    return selected;
  },
  filtersTagsShow: Ember.computed('queryObject.filters.@each.label', function () {
    let show = false;
    let filters = this.get('queryObject.filters');
    filters.forEach((item) => {
      if (item.label) {
        show = true;
      }
    });
    return show;
  }),
  rawObject: Ember.Object.extend({
    selected: null,
    castType: null,
    order: null,
    column: null,
  }),
  rawObjectWithSelected(_this) {
    let selected = _this.get('rawObject').create();
    selected.set('selected', Ember.Object.create({
      raw: false,
      value: null
    }));
    return selected;
  },
  newViewOserver: Ember.observer('newView.selected', function () {
    console.log(this.get('newView'));
  }),

  newFilter: Ember.computed('queryObject.filters.[]', function () {
    return Ember.Object.create({
      column: null,
      operator: null,
      value: null,
      valueDateObj: {}
    });
  }),
  newView: Ember.computed('queryObject.views.[]', function () {
    return this.get('rawObject').create();
  }),
  newGroupBy: Ember.computed('queryObject.groupBys.[]', function () {
    return this.get('rawObjectWithSelected')(this);
  }),
  newOrderBy: Ember.computed('queryObject.orderBys.[]', function () {
    return this.get('rawObjectWithSelected')(this);
  }),
  actions: {
    addNewFilter() {
      this.get('queryObject.filters').pushObject(this.get('newFilter'));
    },
    addNewView() {
      this.get('queryObject.views').pushObject(this.get('newView'));
    },

    addNewGroupBy() {
      this.get('queryObject.groupBys').pushObject(this.get('newGroupBy'));
    },
    addNewOrderBy() {
      this.get('queryObject.orderBys').pushObject(this.get('newOrderBy'));
    },

    switchToBuilder(type, el, handleSelected) {
      var items = this.get('queryObject').get(type);
      if (handleSelected) {
        el.set('selected', null);
        el.set('castType', null);
      } else {
        el.set('raw', false);
      }
    },
    switchToRaw(type, el, handleSelected) {
      var items = this.get('queryObject').get(type);
      if (handleSelected) {
        el.set('selected', Ember.Object.create({
          raw: true
        }));
        el.set('castType', null);
      } else {
        el.set('selected', null);
      }
    },
    remove(type, el) {
      let arr = Ember.Object.create(this.get('queryObject')).get(type);
      arr.removeObject(el);
    },

    updateQuestionSearch(text) {
      this.set('questionQuery', text);
    },
    switchToBuilder(type, el, handleSelected) {
      var items = this.get('queryObject').get(type);
      if (handleSelected) {
        el.set('selected', null);
        el.set('castType', null);
      } else {
        el.set('raw', false);
      }
    },
    switchToRaw(type, el, handleSelected) {
      var items = this.get('queryObject').get(type);
      if (handleSelected) {
        el.set('selected', Ember.Object.create({
          raw: true
        }));
        el.set('castType', null);
      } else {
        el.set('raw', true);
      }
    },
    remove(type, el) {
      let arr = this.get('queryObject').get(type);
      arr.removeObject(el);
    },
    toggleFromTable() {
      this.set('queryObject.table', null);
      this.toggleProperty('queryObject.fromQuestion');
    }
  }
});
