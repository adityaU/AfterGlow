import Ember from 'ember';

import { CanMixin } from 'ember-can';
export default Ember.Route.extend(CanMixin, {

    model(params){
        return this.store.findRecord('snapshot', params.snapshot_id)
    },
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

    renderTemplate(controller, model) {

        this.render('questions.show.snapshots.show', {
            into: 'application',
            controller: controller
        });
    },
});
