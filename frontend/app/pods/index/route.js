import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    afterModel(){
        this.transitionTo('questions.new')
        
    }
});
