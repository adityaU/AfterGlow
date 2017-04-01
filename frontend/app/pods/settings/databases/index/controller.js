import Ember from 'ember';

export default Ember.Controller.extend({
    databases: Ember.computed.alias('model'),

    actions: {
        showDeleteDialogue(databaseToBeDeleted){
            this.set('databaseToBeDeleted', databaseToBeDeleted);
            $('.ui.modal.delete-dialogue').modal('show')
        },
        deleteDatabase(database){
            database.destroyRecord().then((database)=>{
            })
        },
    }
});
