import Ember from 'ember';

export default Ember.Controller.extend({
    sessionService: Ember.inject.service(),
    actions: {
        invalidateSession() {
            this.get('sessionService').invalidate();
            this.transitionToRoute('login')
        }
    }
});
