
export default Ember.Helper.extend({

  compute([array, index]) {
    return array && index && array[index];
  }
});
