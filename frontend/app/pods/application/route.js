import Ember from 'ember';

export default Ember.Route.extend({
    moment: Ember.inject.service(),
    beforeModel() {
        this._super(...arguments);
        this.get('moment').setTimeZone(moment.tz.guess());
    },
    actions: {
        goToDashboard(dashboard){
            this.transitionTo('dashboards.show', dashboard)
        }
    }
});
