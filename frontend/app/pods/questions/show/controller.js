import Ember from 'ember';
import QuestionNewController from '../new/controller'
import ResultViewMixin from 'frontend/mixins/result-view-mixin'

export default QuestionNewController.extend( ResultViewMixin, {
    question: Ember.computed.alias('model'),
    enableAddToDashBoard: true ,
    results: Ember.computed.alias('question.results'),
    loading: Ember.computed.alias('question.loading'),
    validQuestion: true,
    questionNameIsSet: true, 
    setResultsCanBeLoaded: Ember.observer('question', 'question.isLoaded', function(){
    }),

    humanSqlPropertiesObserver: Ember.observer('question.human_sql.@each',
                                               'question.human_sql.filters.@each.label',
                                               'question.human_sql.groupBys.@each.label',
                                               'question.human_sql.views.@each.label',
                                               'question.human_sql.orderBys.@each.label', function(){
                                                   let question = this.get('question')
                                                   if (this.get('humanSqlSetByServer')){
                                                       this.set('humanSqlChanged')
                                                   }
                                               } ),

    humanSqlObserver: Ember.observer('question.isLoaded', function(){
        let question = this.get('question')
        if (question.get('isLoaded')){
            this.set('humanSqlSetByServer', true);
        }
    }),
    actions: {
        showAddToDashboard(){
            $('.ui.modal.add-to-dashboard').modal('show')
        },

        refreshNow(){
            let question = this.get('question')
            question.set('resultsCanBeLoaded', true) 
            question.set('updated_at', new Date())
        },
        addToDashboard(dashboard){
            dashboard.get('questions').addObject(this.get('question'))
            let settings = dashboard.get('settings')
            !settings && dashboard.set('settings', {})
            settings = dashboard.get('settings')
            let dimensions = this.get('resultViewDashboardDefaultDimensions')[this.get('question.results_view_settings.resultsViewType')] ||
                    {width: 6 , height: 6}
            settings[this.get('question.id')] = dimensions
            dashboard.save().then((response)=> {
                this.transitionToRoute('dashboards.show', response.id)
                $('.ui.modal.add-to-dashboard').modal('hide')
            })
        }
       
    }
});
