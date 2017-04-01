import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        return this.store.findAll('user')
    },
    setupController: function(controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Users');

        this.controllerFor('settings').set('showAddDatabase', false);
        
    }
});
