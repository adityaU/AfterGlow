import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        return this.store.findAll('permission_set')
    },
    setupController: function(controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Permissions');
        this.controllerFor('settings').set('showAddDatabase', false);
    }
});
