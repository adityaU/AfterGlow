import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        goToDashboard(dashboard){
            this.transitionTo('dashboards.show', dashboard)
        }
    }
});
