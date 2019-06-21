
export default Ember.Helper.extend({

  compute([apiActions, column, prop3]) {
    return apiActions && column && apiActions.filter((item)=>{
      return item.get('column') == column;
    }).objectAt(0);

  }
});
