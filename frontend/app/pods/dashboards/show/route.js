import Ember from 'ember';

export default Ember.Route.extend({
    model(params){
        return this.store.peekRecord('dashboard', +params.dashboard_id) || this.store.findRecord('dashboard', params.dashboard_id)
    }
});
