import Ember from 'ember';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {
  classNameBindings: ['componentClass'],
  didInsertElement() {
    this._super(...arguments);
    this.$('.custom-select-search-box').focus();
  },
  selectedIndex: 0,

  filteredOptions: Ember.computed('query', 'options', function () {
    let query = this.get('query');
    let options = this.get('options');
    if (query && query != '') {
      let filteredOptions = options.filter((item) => {
        if (item.get) {
          return item.get(this.get('displayKey')) && item.get(this.get('displayKey')).toLowerCase().match(query.toLowerCase());
        }
        return item[this.get('displayKey')] && item[this.get('displayKey')].toLowerCase().match(query.toLowerCase());
      });
      return filteredOptions.slice(0, 100)
    } else {
      return options.slice(0, 100);
    }
  }),

  selectOptionFunc(option) {
    if (this.get('selectKey')) {
      this.set('value', option.get(this.get('selectKey')));
    } else {
      this.set('value', option);
    }
    if (this.get('selectCallbackAction')) {
      this.sendAction('selectCallbackAction', option);
    } else {
      this.get && this.get('dd.closeDropDown') && this.get('dd.closeDropdown')();
    }
  },
  actions: {
    incrementIndex() {
      if (this.get('selectedIndex') >= this.get('filteredOptions.length') - 1) {
        this.set('selectedIndex', 0);
      } else {
        this.incrementProperty('selectedIndex');
      }
    },

    decrementIndex() {
      if (this.get('selectedIndex') <= 0) {
        this.set('selectedIndex', this.get('filteredOptions.length') - 1);
      } else {
        this.decrementProperty('selectedIndex');
      }
    },
    selectOption(option) {
      this.selectOptionFunc(option);
    },
    selectByCurrentIndex() {
      let option = this.get('filteredOptions').objectAt(this.get('selectedIndex'));
      this.selectOptionFunc(option);
    }
  },

  keyboardShortcuts: {
    'up': { action: 'decrementIndex', global: false, preventDefault: true },
    'down': { action: 'incrementIndex', global: false, preventDefault: true },
    'enter': { action: 'selectByCurrentIndex', global: false, preventDefault: true }
  }
});
