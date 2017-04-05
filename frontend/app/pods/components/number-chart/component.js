import Ember from 'ember';

export default Ember.Component.extend({
    number: Ember.computed("results", function(){
        return this.get('results.rows')[0]
    }),

    displayName: Ember.computed("questionName", "resultsViewSettings.title", "results",  function(){
        return this.get('resultsViewSettings.title') || this.get('results.columns')[0];
    })


});
