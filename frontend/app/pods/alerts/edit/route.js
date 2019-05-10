import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model(params) {
        return this.store.find('alert_setting', params.alert_id)
    },
    templateName: 'alerts/new'

});
