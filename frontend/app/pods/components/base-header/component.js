import Ember from 'ember';

export default Ember.Component.extend({
    dashboards: Ember.computed('store', function(){
        return this.get('store').findAll('dashboard')
    }),
    actions: {
        goToDashboard(dashboard){
            this.sendAction('goToDashboard', dashboard)
        }
    }
});
