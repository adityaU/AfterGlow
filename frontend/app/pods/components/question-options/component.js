import Ember from 'ember';
import CustomEvents from 'frontend/mixins/custom-events';

export default Ember.Component.extend(CustomEvents,{
    editing: false,
    actions:{
        saveQuestion(){
            this.sendAction('saveQuestion');
            this.set('editing', false);
        },
        showAddToDashboard(){
            this.set('toggleAddToDashboardModal', true);
        },
        showAddTags(){
            this.set('toggleTagsModal', true);
        },
        editQuestion(){
            this.set('editing', true);
        },
        addToDashboard(dashboard) {
            this.sendAction('addToDashboard', dashboard);
        },
        cancelEditingQuestion(){
            this.set('editing', false);
        },
        showDeleteDialogue(){
            Ember.$('.ui.modal.delete-dialogue').modal('show');
        },
        showShareDialogue(){
            this.set('toggleShareModal', 'true');
        },
        showSnapshotMaker(){
            Ember.$('.ui.modal.snapshot-maker').modal('show');
        },
        deleteQuestion(question){
            question.destroyRecord().then((response)=>{
                this.sendAction('transitionToIndex');
            });
        },
        toggleVariableWindow(){
            this.toggleProperty('showVariables');
            let plotlyComponent = Ember.$('.js-plotly-plot')[0];
            plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
        },
        viewSnapshots(question){
            this.sendAction('transitionToSnapshots', question.id);
        },
    }

});
