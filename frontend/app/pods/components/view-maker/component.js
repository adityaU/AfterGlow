import Ember from 'ember';

export default Ember.Component.extend({
  viewOptions: [{
    name: 'Raw Data',
    value: 'raw_data'
  },
  {
    name: 'Count',
    value: 'count'
  }
  ],

  actions: {
    setSelected(value) {
      this.set('selectView.selected', value);
    },
    switchToBuilder(type, el, handleSelected) {
      this.sendAction('switchToBuilder', type, el, handleSelected);
    },
    switchToRaw(type, el, handleSelected) {
      this.sendAction('switchToRaw', type, el, handleSelected);
    },
    close() {
      $('body').trigger('click');
    },
    addNewView() {
      this.sendAction('addNewView');
      this.send('close');
    }
  }
});
