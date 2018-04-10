import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["full"],
    tags: Ember.computed(function(){
        return this.get('store').findAll('tag')
    }),
    timeZone: moment.tz.guess(),
    actions: {
        showDeleteDialogue(questionToBeDeleted){
            this.set('questionToBeDeleted', questionToBeDeleted);
            $('.ui.modal.delete-dialogue').modal('show')
        },
        addTag(question){
            this.set('addTagToQuestion', question)
            $('.ui.modal.add-to-tag').modal('show')
        },
        viewSnapshots(question){
            this.sendAction('transitionToSnapshots', question.id)
        },
        deleteQuestion(question){
            question.destroyRecord().then((response)=>{
                this.sendAction('transitionToIndex')
            })
        },
        getData(tag){
            this.get('tags').pushObject(tag)
        },
        loadQuestion(question){
          this.store.query('question', {filter: {id: question.id}})

        }
    }
});
