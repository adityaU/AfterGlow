import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model() {
        return this.store.findAll('organization')
    },

    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Organizations');
        this.controllerFor('settings').set('showAddOrganization', true);
    },

    actions: {
        willTransition() {
            this.controllerFor('settings').set('showAddOrganization', false);
        }
    }
});
