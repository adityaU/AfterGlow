import Ember from 'ember';

export default Ember.Helper.extend({
    compute(params){
      if (params && params.length > 0 && params[0]) {
          params = params[0].replace(/_/g, ' ');
          return params.capitalize();
      }
    }
})

