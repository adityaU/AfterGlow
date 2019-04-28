import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
    model(params) {
        return this.store.queryRecord('team', {
            id: params.team_id,
        });
    },
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'New Database');

    }

});
