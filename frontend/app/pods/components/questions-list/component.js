import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["full"],
    actions: {
        showDeleteDialogue(questionToBeDeleted){
            this.set('questionToBeDeleted', questionToBeDeleted);
            $('.ui.modal.delete-dialogue').modal('show')
        },
        deleteQuestion(question){
            question.destroyRecord().then((response)=>{
                this.sendAction('transitionToIndex')
            })
        },
    }
});
