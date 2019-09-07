import Ember from 'ember';

export default Ember.Helper.extend({

  compute([arr]) {
    if (arr) {

      return arr.length == 0;
    }
  }
});
