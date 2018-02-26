import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
export default Ember.Component.extend(KeyboardShortcuts, {
    actions: {
        getResults(){
            this.sendAction('getResults', this.get('queryObject'));
        },
        toggleSql(){
            this.sendAction('toggleSql');
        },
        changeDatabase(){
          $('.ks-database').click()
          $('.ks-database-input').focus()
        },
        changeTable(){
          $('.ks-table').click()
          $('.ks-table-input').click()
          $('.ks-table-search').focus()
        },
        changeGroupBys(){
          $('.ks-group_bys').click()
        },
        changeOrderBys(){
          $('.ks-order_bys').click()
        },
        changeView(){
          $('.ks-view').click()
        },
        changeFilters(){
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
