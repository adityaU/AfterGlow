import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
export default Ember.Component.extend(KeyboardShortcuts, {
  classNames: ['mr-2'],
  resultViewPossibleKeys: [],
  databasesLength: Ember.computed("databases.@each", function () {
    if (this.get('databases.length')) {
      return true
    }
  }),
  databaseObserver: Ember.on('init', Ember.observer('queryObject.database', function () {
    let database = this.get('queryObject.database')
    if (database && database.get('db_type') == 'api_client') {
      this.set('question.sql', "NA");
      this.set('question.query_type', 'api_client')
    } else {
      this.set('question.sql', null);
      this.set('question.query_type', null)
    }


  })),

  selectedDatabase: Ember.computed("queryObject.database", "databases.@each", function () {
    return this.get('store').peekRecord('database', this.get('queryObject.database.id'))
  }),
  showTags: true,
  actions: {

    getResults() {
      this.sendAction('getResults', this.get('queryObject'));
    },
    toggleSql() {
      let databaseType = this.get('queryObject.database.db_type')
      if (databaseType == 'api_client') {
        let existingApiAction = this.get('apiAction')
        if (!existingApiAction) {
          let apiAction = this.get('store').createRecord('apiAction', {
            color: 'indigo',
            method: 'GET',
            headers: [],
            response_settings: Ember.Object.create(),
            top_level_question: this.get('question')
          });
          this.set('apiAction', apiAction);
        }
        this.toggleProperty("toggleApiActionModal")
        return
      }
      this.sendAction('toggleSql');
    },
    transitionToQuestion(id) {
      this.sendAction('transitionToQuestion', id)
    },
    changeDatabase() {
      $('.ks-database').click()
      $('.ks-database-input').focus()
    },
    changeTable() {
      $('.ks-table').click()
      $('.ks-table-input').click()
      $('.ks-table-search').focus()
    },
    changeGroupBys() {
      $('.ks-group_bys').click()
    },
    changeOrderBys() {
      $('.ks-order_bys').click()
    },
    changeView() {
      $('.ks-view').click()
    },
    changeFilters() {
      $('.ks-filters').click()
    }
  },

  keyboardShortcuts: {
    "ctrl+shift+d": "changeDatabase",
    "ctrl+shift+t": "changeTable",
    "ctrl+shift+f": "changeFilters",
    "ctrl+shift+g": "changeGroupBys",
    "ctrl+shift+o": "changeOrderBys",
    "ctrl+shift+v": "changeView",
  }
});
