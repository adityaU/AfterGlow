import Ember from 'ember';

export default Ember.Controller.extend({
    databases: Ember.computed.alias('model'),

    actions: {
        showDeleteDialogue(databaseToBeDeleted) {
            this.set('databaseToBeDeleted', databaseToBeDeleted);
            this.set('toggleDeleteDialogue', true);
        },
        deleteDatabase(database) {
            database.destroyRecord().then((database) => {})
        },
    }
});
