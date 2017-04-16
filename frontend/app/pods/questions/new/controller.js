import Ember from 'ember';
import ChartSettings from 'frontend/mixins/chart-settings'
import LoadingMessages from "frontend/mixins/loading-messages"

export default Ember.Controller.extend(LoadingMessages, ChartSettings,{
    ajax: Ember.inject.service(),
    
    databases: Ember.computed(function(){
        return this.get('store').findAll('database')
    }),
    // variableObserver: Ember.observer('queryObject.queryType','queryObject.rawQuery' ,function(){
    //     let query = this.get('queryObject.rawQuery')
    //     let queryType = this.get('queryObject.queryType')
    //     let entity = this.get('question')
    //     let possibleVariables = query && query.match(/{{(.+?)}}/g)
    //     possibleVariables = possibleVariables && possibleVariables.map((item)=> {return item.replace("{{", "").replace("}}", "")})
    //     let savedVariables = entity && entity.get('variables').map((item)=> {return item.get('name')})
    //     let newVariables = possibleVariables && possibleVariables.filter((v)=>{
    //         return (savedVariables.indexOf(v) < 0)
    //     })
    //     let toBedeletedVariables = savedVariables && savedVariables.filter((item)=>{
    //         return (possibleVariables.indexOf(item) < 0)
    //     })
    //     newVariables =  newVariables.map((item)=>{
    //         this.store.createRecord('variable', {name: item, var_type: "Normal"})
    //     })
    //     if (entity.get('variables.isFulfilled')){
    //         entity.get('variables').removeObjects(toBedeletedVariables)
    //         entity.get('variables').pushObjects(newVariables)
    //     }
    // }),
    showVariables: Ember.computed('question', 'question.variables', function(){
        return this.get('question.variables.length') > 0
    }),
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
            results_view_settings: {resultsViewType: 'Table', numbers: [], dataColumns: [{}]},
        })
    }),
    
    questionNameObserver: Ember.observer("question.title",
                                         "queryObject.table.human_name",
                                         "queryObject.filters.@each.label",
                                         "queryObject.views.@each.label",
                                         "queryObject.groupBys.@each.label",
                                         function(){
                                             if (this.get('queryObject.table.human_name') && !this.get('questionNameIsSet')){
                                                 let title = ""
                                                 let filterlabels = "" 
                                                 let viewlabels = "" 
                                                 let groupBylabels = "" 
                                                 if (this.get('queryObject.views.length')){
                                                     viewlabels = this.get('queryObject.views').map((item)=> {return item.get('label')}).join(" , ")
                                                 }
                                                 if (viewlabels != ""){
                                                     title = `${viewlabels} of `
                                                 }
                                                 title = title + `${this.get('queryObject.table.human_name')}`
                                                 if (this.get('queryObject.filters.length')){
                                                     filterlabels = this.get('queryObject.filters').map((item)=> {return item.get('label')}).join(" , ")
                                                 }
                                                 if (filterlabels != ""){
                                                     title = `${title} where ${filterlabels}`
                                                 }
                                                 if (this.get('queryObject.groupBys.length')){
                                                     groupBylabels = this.get('queryObject.groupBys').map((item)=> {return item.get('label')}).join(" , ")
                                                 }
                                                 if (groupBylabels != ""){
                                                     title = `${title}, grouped by ${groupBylabels}`
                                                 }
                                                 this.set('question.title', title )
                                             }
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
    changeSQL: Ember.observer('queryObject.rawQuery', function(){
      this.set('question.sql', this.get('queryObject.rawQuery'))
    }),
    aceTheme: "ace/theme/chrome",
    aceMode: "ace/mode/sql",

    queryObject: Ember.computed.alias('question.human_sql'),
    
    apiNamespace: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').namespace;
    }),

    apiHost: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').host;
    }),
    showGetResults: Ember.computed('queryObject.database', 'queryObject.table', 'queryObject.queryType','queryObject.rawQuery', function(){
        return ((this.get('queryObject.database') && this.get('queryObject.table')) ||
                (this.get('queryObject.database') && (this.get('queryObject.queryType') == 'raw') && this.get('queryObject.rawQuery')) )
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
            let question = this.get('question')
            if (question.id && Object.keys(question.changedAttributes()) == 0){
                question.set("updated_at", new Date())
                question.set('resultsCanBeLoaded', true) 
            }else{
                question.set("updated_at", new Date())
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
            }
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

                question.set('resultsCanBeLoaded', true) 
                this.transitionToRoute('questions.show', response.id)
            });
            
        },
        transitionToDashBoard(dashboard_id){
            this.transitionToRoute('dashboards.show', dashboard_id)
        },
        transitionToIndex(){
            this.transitionToRoute('index')
        }
    }
});
