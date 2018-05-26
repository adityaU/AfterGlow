import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        clearDelete() {
            this.set('open', false);
        },
        delete(entity) {
            this.set('open', false);
            this.sendAction('delete', entity);
        }
    }
});
