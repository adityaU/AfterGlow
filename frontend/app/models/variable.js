import Ember from 'ember';
import DS from 'ember-data';
import ResultViewMixin from 'frontend/mixins/result-view-mixin'
export default DS.Model.extend( ResultViewMixin, {
    name: DS.attr('string'),
    default: DS.attr('string'),
    var_type: DS.attr('string'),
    column: DS.belongsTo('column'),
    default_operator: DS.attr('string'),
    question: DS.belongsTo('question'),
    dashboard: DS.belongsTo('dashboard'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    default_options: DS.attr('array'),
    value_options: DS.attr('array'),
    question_filter: DS.belongsTo('question',  { inverse: 'variables_from_this_question' }),
    value: Ember.computed.alias("default"),
    setDate: Ember.observer("default_date", function(){
        this.set('default', moment(this.get('default_date')).toISOString())
    }),
    setDateValue: Ember.observer("date_value", function(){
        this.set('value', moment(this.get('date_value')).toISOString())
    }),

    questionFilterOptions: Ember.computed('question_filter.cached_results', "default_options", function(){
        let question_filter = this.get('question_filter')
        return question_filter && question_filter.get('cached_results') && question_filter.get('cached_results.rows').map((item)=> {
            return {name: item[0], value: item[1]}
        })
    }),

    questionFilterObserver: Ember.observer('question_filter', function(){
        let question_filter = this.get('question_filter')
        if (question_filter && question_filter.get('id') && !(question_filter.get('cahced_results'))){
            this.set('question_filter.resultsCanBeLoaded', true)
            this.set('question_filter.updated_at', new Date())
        }
    }),



    setQuestionVariables: Ember.observer('dashboard', 'value', 'default_options.[]', function(){
        let dashboard = this.get('dashboard')
        if (dashboard.get('content')){
            dashboard.get('questions').forEach((item)=>{
               let variable = item.get('variables').findBy('name', this.get('name'))
               variable && variable.set('value', this.get('value'))
                variable && variable.set('default_options', this.get('default_options'))
            })
        }
    })
})
