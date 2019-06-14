import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
    model(params) {
        return Ember.RSVP.hash({
            organization: this.store.find('organization', params.organization_id),
            organization_settings: this.store.query('organization_setting', { organization_id: params.organization_id })
        })
    },
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Edit Organization');

    }

});
