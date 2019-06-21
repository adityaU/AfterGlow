import Ember from 'ember';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend( KeyboardShortcuts, {
  init(){
    this._super(...arguments)
    let showKeyboardShortcutsButton = localStorage.getItem('AG_showKeyboardShortcutsButton') == null ? true : (localStorage.getItem('AG_showKeyboardShortcutsButton') == 'true')
    this.set('showKeyboardShortcutsButton', showKeyboardShortcutsButton )
  },
  showKeyboardShortcutsButton: true,
  showKeyboardShortcuts: false,

  actions: {
    toggleKeyboardShortcuts(){
      this.toggleProperty('showKeyboardShortcuts')
    },

    toggleKeyboardShortcutsButton(){
      this.toggleProperty('showKeyboardShortcutsButton')
      localStorage.setItem('AG_showKeyboardShortcutsButton', this.get('showKeyboardShortcutsButton'))
    }
  },

  keyboardShortcuts: {
    "ctrl+k": 'toggleKeyboardShortcuts',
    "ctrl+l": 'toggleKeyboardShortcutsButton'
  }
});
