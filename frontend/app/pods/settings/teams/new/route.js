import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'New Team');

    },
    actions: {
        willTransition(transition) {
            let team = this.controller.get('team')
            if (!team.id) {
                team.destroyRecord()
            }
        }
    }

});
