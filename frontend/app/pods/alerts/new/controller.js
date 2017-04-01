import Ember from 'ember';

export default Ember.Controller.extend({
  questions: Ember.computed(function(){
    return this.store.findAll('question')
    }),
  alert: {
    name: "New Alert",
    config: Ember.Object.create({
        question: null,
        warning: Ember.Object.create({
          within_type: null,
          operation: null,
          within_count: null,
          column: null,
          operator: null,
          value: null
          }),

        critical: Ember.Object.create({
          operation: null,
          within_type: null,
          within_count: null,
          column: null,
          operator: null,
          value: null
        })
      })
  }
});
