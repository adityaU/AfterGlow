import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model() {
        return this.store.findAll('team')
    },

    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Teams');
        this.controllerFor('settings').set('showAddTeam', true);
    },

    actions: {
        willTransition() {
            this.controllerFor('settings').set('showAddTeam', false);
        }
    }
});
