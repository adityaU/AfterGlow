import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'
import { CanMixin } from 'ember-can';


export default Ember.Route.extend(AuthenticationMixin, CanMixin, {
    toast: Ember.inject.service(),
    beforeModel() {
        this._super(...arguments)
        this.set('modelHookRun', false)
    },
    model(params){
        this.set('modelHookRun', true)
        return this.store.findRecord('dashboard', params.dashboard_id)
    },
    afterModel(model){
        if (!this.can('show dashboard')) {
            this.get('toast').error(
                "You are not authorized to perform this action",
                'Sorry Mate!',
                {closeButton: true, timeout: 1500, progressBar:false}
            );

            return this.transitionTo('index');
        }
        if ( ! this.get('modelHookRun')) {
            return model.reload();
        }
        this.set('modelHookRun', false)
    }
});
