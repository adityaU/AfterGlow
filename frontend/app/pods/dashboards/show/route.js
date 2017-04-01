import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'
import { CanMixin } from 'ember-can';


export default Ember.Route.extend(AuthenticationMixin, CanMixin, {
    toast: Ember.inject.service(),
    afterModel(){
        if (!this.can('show dashboard')) {
            this.get('toast').error(
                "You are not authorized to perform this action",
                'Sorry Mate!',
                {closeButton: true, timeout: 1500, progressBar:false}
            );

            this.transitionTo('index');
        }
    },
    model(params){
        return this.store.peekRecord('dashboard', +params.dashboard_id) || this.store.findRecord('dashboard', params.dashboard_id)
    }
});
