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
            this.get('toast').error(
                "You are not authorized to perform this action",
                'Sorry Mate!',
                {closeButton: true, timeout: 1500, progressBar:false}
            );

            this.transitionTo('dashboard', 0);
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
