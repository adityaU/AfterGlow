import Ember from 'ember';

export default Ember.Helper.extend({

  compute([arr, el ]) {
    if (arr && el){

      return arr && arr.indexOf(el) >= 0;
    }
  }
});
