import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  didRender() {
    this.$('.dashboard-selector-input').focus();
  },

  dashboards: Ember.computed(function () {
    return this.get('store').findAll('dashboard')
  }),
  selectedIndex: 0,
  filteredDashboards: Ember.computed('query', 'dashboards.isFulfilled', function () {
    this.set('selectedIndex', 0)
    let dashboards = this.get('dashboards')
    let query = this.get('query')
    if (query && query != "" && dashboards) {
      return dashboards.filter(function (item) {
        return item.get('title') && item.get('title').toLowerCase().match(query.toLowerCase())
      })
    } else {
      return dashboards
    }
  }),
  actions: {
    incrementIndex() {
      if (this.get('selectedIndex') >= this.get('filteredDashboards.length') - 1) {
        this.set('selectedIndex', 0)
      } else {
        this.incrementProperty('selectedIndex')
      }
    },

    decrementIndex() {
      if (this.get('selectedIndex') <= 0) {
        this.set('selectedIndex', this.get('filteredDashboards.length') - 1)
      } else {
        this.decrementProperty('selectedIndex')
      }
    },
    goToDashboardClick(dashboard) {
      this.sendAction('goToDashboard', dashboard)
    },
    goToDashboard() {
      this.sendAction('goToDashboard', this.get('filteredDashboards').objectAt(this.get('selectedIndex')))
    }
  },

  keyboardShortcuts: {
    "up": 'decrementIndex',
    "down": 'incrementIndex',
    "enter": 'goToDashboard'
  }
});
