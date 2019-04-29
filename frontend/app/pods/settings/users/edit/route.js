import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
    model(params) {
        return this.store.find('user', params.user_id);
    },
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Edit User');
    }

});
