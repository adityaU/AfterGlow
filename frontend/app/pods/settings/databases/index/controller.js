import Ember from 'ember';

export default Ember.Controller.extend({
    databases: Ember.computed.sort('model', function (a, b) {
        if (a.get('name').toLowerCase() <= b.get('name').toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    }),

    actions: {
        showDeleteDialogue(databaseToBeDeleted) {
            this.set('databaseToBeDeleted', databaseToBeDeleted);
            this.set('toggleDeleteDialogue', true);
        },
        deleteDatabase(database) {
            database.destroyRecord().then((database) => {});
        },
    }
});
