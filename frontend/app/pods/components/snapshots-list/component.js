import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['full'],
    actions: {
        editSnapshot(snapshot) {
            this.set('selectedSnapshot', snapshot);
            this.sendAction('editSnapshot');
        },
        deleteSnapshot(snapshot) {
            snapshot.destroyRecord();
        }
    }
});
