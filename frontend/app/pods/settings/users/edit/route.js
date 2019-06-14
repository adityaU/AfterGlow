import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
    model(params) {

        return Ember.RSVP.hash({
            user: this.store.find('user', params.user_id),
            user_settings: this.store.query('user_setting', { user_id: params.user_id })
        })
    },
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Edit User');
    }

});
