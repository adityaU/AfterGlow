import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    resultsViewType: 'Table',
    resultsWidgets: {
        "Table" : 'results-table',
        "Line" : 'line-chart',
        "Pie" : 'pie-chart',
        "Bars" : 'bar-chart',
        "Area" : 'area-chart',
        "Bubble": 'bubble-chart'
    },
    question: Ember.computed(function(){
        return this.store.createRecord('question', {
            title: "New Question",
            human_sql:  Ember.Object.create({
                queryType: 'query_builder',
                database: null,
                table: null,
                views: [],
                filters: [Ember.Object.create({column: null, operator: null, value: null})],
                groupBys: [],
                orderBys: [],
                offset: null,
                limit: 2000
            }),
            results_view_settings: {},
        })
    }),

    questionName: Ember.computed.alias('question.title'),
    resultsViewSettings: Ember.computed.alias('question.results_view_settings'),
    queryBuilderType: Ember.computed('queryObject.queryType', function(){
        let queryType = this.get('queryObject.queryType')
        if (queryType == 'query_builder'){
            return true;
        }else{
            return false;
        }
    }),
    aceTheme: "ace/theme/tomorrow_night",
    aceMode: "ace/mode/sql",

    queryObject: Ember.computed.alias('question.human_sql'),
    
    apiNamespace: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').namespace;
    }),

    apiHost: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').host;
    }),
    resultsWidgetComponent:  Ember.computed('resultsViewType', function() {
        return this.get('resultsWidgets')[this.get('resultsViewType')]
    }),
    showGetResults: Ember.computed('queryObject.database', 'queryObject.table', 'queryObject.queryType','queryObject.rawQuery', function(){
        return (this.get('queryObject.database') && (this.get('queryObject.table') || ((this.get('queryObject.queryType') == 'raw') && this.get('queryObject.rawQuery')) ))
    }),
    resultsWidgetSettingsComponent: Ember.computed('resultsViewType', function(){
        this.set('results', this.get('results'));
        return this.get('resultsWidgets')[this.get('resultsViewType')] + '-settings'
    }),
    availableResultsTypes: Ember.computed('resultsWidgets', function(){
        return Object.keys(this.get('resultsWidgets'));
    }),
    actions: {

        toggleSql(){
            let queryType = this.get('queryObject.queryType');
            if (queryType == 'query_builder'){
                this.set('queryObject.queryType', 'raw');
            }else{
                this.set('queryObject.queryType', 'query_builder');
            }
        },
        getResults(queryObject){
            queryObject = queryObject || this.get('queryObject');
            this.set('loading', true);
            this.set('results', null)
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/query_results',
                type: 'POST',
                data: queryObject
            },(response, status)=>{
                this.set('loading', false);
                this.set('errors', null)
                this.set('results', response.data)
                this.set('validQuestion', true)
                this.set("queryObject.rawQuery", response.query)
            },(error, status)=>{
                this.set('loading', false);
                this.set('errors', error.error)
                this.set('results', null)
                this.set('validQuestion', false)
                this.set("queryObject.rawQuery", error.query)
            });
        },
        saveQuestion(){
            let question = this.store.createRecord('question', {
                title: this.get('question.title'),
                human_sql: this.get('question.human_sql'),
                sql: this.get('question.sql') || this.get('question.human_sql.rawQuery'),
                query_type: this.get('question.human_sql.queryType') == 'raw' ? 'sql': 'human_sql',
                results_view_settings: this.get('question.results_view_settings')
            })
            question.save();
            
        }
    }
});
