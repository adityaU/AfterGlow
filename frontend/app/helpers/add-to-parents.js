import Ember from 'ember';

export default Ember.Helper.extend({

  compute([parents, tableId]) {
    if (parents){
      parents.push(tableId);
      return parents;
    }else{
      return [tableId];
    }

  }
});
