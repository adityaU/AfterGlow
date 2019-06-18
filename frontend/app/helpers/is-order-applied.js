import Ember from 'ember';

export default Ember.Helper.extend({

    compute([orderBys, column_name, order]) {

      let applied = false
      orderBys && orderBys.every((orderBy)=>{
          if (orderBy.get('column.name') == column_name && orderBy.get('order.value') == order){
              applied = true
              return false
          }
          return true
      })
      return applied

    }
});
