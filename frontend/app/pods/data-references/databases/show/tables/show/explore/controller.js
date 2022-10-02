import Ember from 'ember';
import QuestionNewController from '../../../../../../questions/new/controller'
import ShowController from '../controller'
import ResultViewMixin from 'frontend/mixins/result-view-mixin'

import { CanMixin } from 'ember-can';
export default QuestionNewController.extend(ResultViewMixin, CanMixin, {
    table: Ember.computed.alias('model'),
    question: Ember.computed( "recalculate", "database", "table", function(){
        return this.store.createRecord('question', {
            title: "Table: " + this.get('table.name'),
            human_sql:  Ember.Object.create({
                queryType: 'query_builder',
                database: this.get('database'),
                table: this.get('table'),
                views: [],
                filters: [],
                groupBys: [],
                orderBys: [],
                offset: null,
                limit: 2000
            }),
            results_view_settings: {resultsViewType: "table", numbers: [], dataColumns: [{}]},
        })
    }),
    questionObserver: Ember.observer("question.database", "vueResultPath", function(){
        if(this.get('question.human_sql.database') && this.get('question.human_sql.table') && this.get('vueResultPath')){
            setTimeout(()=> {
              this.getResultsFunction(null)
            }, 1000)
        }
    })
})
