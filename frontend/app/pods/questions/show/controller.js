import Ember from 'ember';
import QuestionNewController from '../new/controller'

export default QuestionNewController.extend({
    question: Ember.computed.alias('model'),
    enableAddToDashBoard: true ,
    results: Ember.computed.alias('question.results'),
    loading: Ember.computed.alias('question.loading'),
    validQuestion: true,
    actions: {
        showAddToDashboard(){
            $('.ui.modal.add-to-dashboard').modal('show')
        },

        saveQuestion(){
            let question = this.get('question');
            question.save().then((response)=> {
                this.transitionToRoute('questions.show', response.id)
            });
            
        },
        addToDashboard(dashboard){
            dashboard.get('questions').addObject(this.get('question'))
            let settings = dashboard.get('settings')
            !settings && dashboard.set('settings', {})
            settings = dashboard.get('settings')
            settings[this.get('question.id')] = {width:6, height: 6}
            dashboard.save().then((response)=> {
                this.transitionToRoute('dashboards.show', response.id)
                $('.ui.modal.add-to-dashboard').modal('hide')
            })
        }
       
    }
});
