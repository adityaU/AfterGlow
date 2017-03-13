import Ember from 'ember';
import ChartSettings from 'frontend/mixins/chart-settings'

export default Ember.Controller.extend(ChartSettings,{
    ajax: Ember.inject.service(),
    
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
            results_view_settings: {resultsViewType: 'Table'},
        })
    }),
    resultsViewType: Ember.computed.alias('question.results_view_settings.resultsViewType'),
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

    dashboards: Ember.computed(function(){
        return this.store.findAll('dashboard')
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
        toggleSettings(){
            this.toggleProperty('showSettings')
        },
        saveQuestion(){
            let question = this.store.createRecord('question', {
                title: this.get('question.title'),
                human_sql: this.get('question.human_sql'),
                sql: this.get('question.sql') || this.get('question.human_sql.rawQuery'),
                query_type: this.get('question.human_sql.queryType') == 'raw' ? 'sql': 'human_sql',
                results_view_settings: this.get('question.results_view_settings')
            })
            question.save().then((response)=> {
                this.transitionToRoute('questions.show', response.id)
            });
            
        },
        transitionToDashBoard(dashboard_id){
            this.transitionToRoute('dashboards.show', {dashboard_id: dashboard_id})
        },
        transitionToIndex(){
            this.transitionToRoute('index')
        }
    }
});
