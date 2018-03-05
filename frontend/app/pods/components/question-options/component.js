import Ember from 'ember';

export default Ember.Component.extend({
    editing: false,
    actions:{
        saveQuestion(){
            this.sendAction('saveQuestion')
            this.set('editing', false)
        },
        showAddToDashboard(){
            this.sendAction('showAddToDashboard')
        },
        showAddTags(){
            this.sendAction('showAddTags')
        },
        editQuestion(){
            this.set('editing', true)
        },
        cancelEditingQuestion(){
            this.set('editing', false)
        },
        showDeleteDialogue(){
            $('.ui.modal.delete-dialogue').modal('show')
        },
        showShareDialogue(){
            $('.ui.modal.share-entity').modal('show')
        },
        showSnapshotMaker(){
            $('.ui.modal.snapshot-maker').modal('show')
        },
        deleteQuestion(question){
            question.destroyRecord().then((response)=>{
                this.sendAction('transitionToIndex')
            })
        },
        toggleVariableWindow(){
            this.toggleProperty('showVariables')
        },
        viewSnapshots(question){
            this.sendAction('transitionToSnapshots', question.id)
        },
    }

});
