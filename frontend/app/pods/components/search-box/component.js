import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {

  didRender() {
    this.$('.item-selector-input').focus();
  },
  items: Ember.computed(function () {
    return this.get('store').findAll('search_item')
  }),
  selectedIndex: 0,

  searcheditemsObserver: Ember.on('init', Ember.observer('query', "items.isFulfilled", function () {
    Ember.run.debounce(this, this.setFilteredItems, 300)
  })),
  setFilteredItems() {
    this.set('selectedIndex', 0)
    let items = this.get('items')
    let query = this.get('query')
    if (query && query != "" && items) {
      this.set('filteredItems', this.get('store').query('search_item', { q: query, tag: null }))
    } else {
      return this.set('filteredItems', items.filterBy('id'))
    }
  },
  actions: {
    incrementIndex() {
      if (this.get('selectedIndex') >= this.get('filteredItems.length') - 1) {
        this.set('selectedIndex', 0)
      } else {
        this.incrementProperty('selectedIndex')
      }
    },

    decrementIndex() {
      if (this.get('selectedIndex') <= 0) {
        this.set('selectedIndex', this.get('filteredItems.length') - 1)
      } else {
        this.decrementProperty('selectedIndex')
      }
    },
    goToQuestionClick(item) {
      this.sendAction('goToQuestion', item)
    },
    goToDashboardClick(item) {
      this.sendAction('goToDashboard', item)
    },
    goToTagClick(item) {
      this.sendAction('goToTag', item)
    },
    goToItem() {
      let item = this.get('filteredItems').objectAt(this.get('selectedIndex'))
      if (item.get('item_type') == "question") {
        this.sendAction('goToQuestion', item)
      } else if (item.get('item_type') == "dashboard") {
        this.sendAction('goToDashboard', item)
      } else if (item.get('item_type') == "tag") {
        this.sendAction('goToTag', item)
      }

    }
  },

  keyboardShortcuts: {
    "up": 'decrementIndex',
    "down": 'incrementIndex',
    "enter": 'goToItem'
  }
});
