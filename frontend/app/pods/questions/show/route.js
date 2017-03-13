import Ember from 'ember';

export default Ember.Route.extend({
    model(params){
        return this.store.peekRecord('question', params.question_id) || this.store.findRecord('question', params.question_id)
    },
    templateName: 'questions/new'
});
