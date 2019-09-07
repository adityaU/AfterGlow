
export default Ember.Helper.extend({

  compute([array, index]) {
    return array && (index || index == 0) && array[index];
  }
});
