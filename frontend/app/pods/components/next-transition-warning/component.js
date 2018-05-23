import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        clearTransition() {
            this.set('open', false);
        },
        goAheadWithNextTransition() {
            this.set('open', false);
            this.sendAction('goAheadWithNextTransition');
        }

    }
});
