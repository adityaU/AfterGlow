import Ember from 'ember';

export default Ember.Component.extend({
    sessionService: Ember.inject.service(),
    dashboards: Ember.computed('store', function () {
        return this.get('store').query('dashboard', {
            limit: 5
        });
    }),
    actions: {
        goToDashboard(dashboard) {
            this.sendAction('goToDashboard', dashboard);
        },
        invalidateSession() {
            this.sendAction('invalidateSession');
        }
    }
});
