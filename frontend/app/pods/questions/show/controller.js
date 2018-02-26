import Ember from 'ember';
import QuestionNewController from '../new/controller'
import ResultViewMixin from 'frontend/mixins/result-view-mixin'

import { CanMixin } from 'ember-can';
export default QuestionNewController.extend( ResultViewMixin, CanMixin, {
    question: Ember.computed.alias('model'),
    enableAddToDashBoard: true ,
    results: Ember.computed.alias('question.results'),
    isQueryLimited: Ember.computed.alias('results.limited'),
    canCreateSnapshot: true,
    limitedQuery: Ember.computed.alias('results.limited_query'),
    queryLimit: Ember.computed.alias('results.limit'),
    variablesReplacedQuery: Ember.computed.alias('results.variables_replaced_query'),
    loading: Ember.computed.alias('question.loading'),
    validQuestion: true,
    questionNameIsSet: true,

    canEdit: Ember.computed(function(){
        return this.can('edit question')
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
