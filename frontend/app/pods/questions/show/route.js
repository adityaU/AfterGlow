import Ember from 'ember';
import { CanMixin } from 'ember-can';


export default Ember.Route.extend(CanMixin, {
    toast: Ember.inject.service(),
    afterModel(){
        if (!this.can('show question')) {
            this.get('toast').error(
                "You are not authorized to perform this action",
                'Sorry Mate!',
                {closeButton: true, timeout: 1500, progressBar:false}
            );

            this.transitionTo('index');
        }
    },
    model(params){
        return this.store.peekRecord('question', params.question_id) || this.store.findRecord('question', params.question_id)
    },
    templateName: 'questions/new'
});
