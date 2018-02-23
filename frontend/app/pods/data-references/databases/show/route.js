import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin,{

    model(params){
        return this.store.peekRecord('database', params.database_id) || this.store.findRecord('database', params.database_id)
    }
});
