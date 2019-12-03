import Ember from 'ember';

export default Ember.Route.extend({
    setupController: function(controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Version');

        this.controllerFor('settings').set('showAddDatabase', false);
        
    }
});
