import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model(){
        return this.store.findAll('database')
    },
    setupController: function(controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Databases');
        this.controllerFor('settings').set('showAddDatabase', true);
        
          
    }
});
