import Ember from 'ember';

export default Ember.Component.extend({
    sessionService: Ember.inject.service(),
    dashboards: Ember.computed('store', function(){
        return this.get('store').findAll('dashboard')
    }),
    actions: {
        goToDashboard(dashboard){
            this.sendAction('goToDashboard', dashboard)
        },
        invalidateSession(){
            this.sendAction('invalidateSession')
        }
    }
});
