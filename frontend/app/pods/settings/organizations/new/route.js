import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'New Organization');

    },
    actions: {
        willTransition(transition) {
            let organization = this.controller.get('organization')
            if (!organization.id) {
                team.destroyRecord()
            }
        }
    }

});
