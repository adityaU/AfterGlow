import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model(params){
        return this.store.find('table', params.table_id)
    }

});
