import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.findAll('setting')
    },
    setupController: function (controller, model) {
        this._super(...arguments);
        this.controllerFor('settings').set('pageTitle', 'Frontend Configuration');
        this.controllerFor('settings').set('showAddDatabase', false);

    }
});
