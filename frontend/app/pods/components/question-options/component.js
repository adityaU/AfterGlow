import Ember from 'ember';
import CustomEvents from 'frontend/mixins/custom-events'

export default Ember.Component.extend(CustomEvents,{
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
            this.set('toggleShareModal', 'true')
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
            let plotlyComponent = Ember.$('.js-plotly-plot')[0]
            plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize')) 
        },
        viewSnapshots(question){
            this.sendAction('transitionToSnapshots', question.id)
        },
    }

});
