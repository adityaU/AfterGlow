import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';
import ResultViewMixin from "frontend/mixins/result-view-mixin"


export default DS.Model.extend(ResultViewMixin, {
    title: DS.attr('string'),
    results_view_settings: DS.attr(),
    human_sql: DS.attr('query-object'),
    query_type: DS.attr('string'),
    sql: DS.attr('string'),
    shareable_link: DS.attr('string'),
    is_shareable_link_public: DS.attr('boolean'),
    has_permission: DS.attr('boolean'),
    columns: DS.attr(),
    cached_results: DS.attr(),
    dashboards: DS.hasMany('dashboards'),
    tags: DS.hasMany('tags'),
    shared_to: DS.attr(),
    variables: DS.hasMany('variables'),

    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    cachedResults: Ember.on('didLoad', Ember.observer("updated_at", "resultsCanBeLoaded" , "cached_results", function(){
        if (this.get('resultsCanBeLoaded')){
            this.set("loading", true)
            this.set('results', null)
            let variables = this.get('query_variables')
            variables = variables && variables.map((item)=>{
                return {name: item.get('name'), value: item.get('value'), var_type: item.get('var_type')}
            })
            this.resultsCall( {variables: variables}).then((response)=>{
                this.set('results', response.data)
                this.set("loading", false)
                this.set("resultsCanBeLoaded", false)
                // }).then((error)=>{
                //     this.set('resultError', error.error)
                //     this.set("loading", false)
            }).catch((error)=>{
                this.set('errorMessage', error.message)
                this.set("loading", false)
                this.set("resultsCanBeLoaded", false)
            });
        }else{
            this.set('results', this.get('cached_results'))
        }
    })),

    updatedAgoColor: Ember.computed("updated_at", function(){
        let updated_at = this.get('updated_at');
        if (updated_at){
            if (moment(updated_at).add(30, 'minutes') > moment()){
                return "green"
            }else{
                return "red"
            }
        }
    }),
    query_variables: Ember.computed.alias('variables'),

    icon: Ember.computed('results_view_settings', "results_view_settings.resultsViewType", function(){
       return this.get('resultViewIcons')[this.get('results_view_settings.resultsViewType')] || "table"
    }),

    resultsCall: memberAction({ path: 'results', type: 'post', urlType: 'findRecord' }),
    resultsCanBeLoaded: false

});
