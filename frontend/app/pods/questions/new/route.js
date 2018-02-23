import Ember from 'ember';
import { CanMixin } from 'ember-can';


export default Ember.Route.extend(CanMixin, {
    toast: Ember.inject.service(),
    setupController(controller, model){
        this._super(...arguments);
        this.set('curruntController', controller)
    },
    afterModel(){
        if (!this.can('create question')) {
            this.transitionTo('questions.all');
        }
    },
    actions:{
        willTransition(transition){
            this._super(...arguments);
            this.controller.set('recalculate', new Date())
            this.controller.set('showSettings', false)
            this.controller.set('results', null)
            this.controller.set('errors', null)

        }
    }
});
