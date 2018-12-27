import Ember from 'ember';
import {
    CanMixin
} from 'ember-can';


export default Ember.Route.extend(CanMixin, {
    toast: Ember.inject.service(),
    afterModel(model, transition) {
        this._super(...arguments);
        if (!this.can('show question')) {
            this.get('toast').error(
                'You are not authorized to perform this action',
                'Sorry Mate!', {
                    closeButton: true,
                    timeout: 1500,
                    progressBar: false
                }
            );

            this.transitionTo('index');
        } else {
            this.set('title', 'Afterglow All Questions');
        }
    },
    model() {
        return this.store.findAll('question');
    }
});
