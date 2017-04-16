import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';


export default DS.Model.extend({
    title: DS.attr('string'),
    results_view_settings: DS.attr(),
    human_sql: DS.attr('query-object'),
    query_type: DS.attr('string'),
    sql: DS.attr('string'),
    shareable_link: DS.attr('string'),
    is_shareable_link_public: DS.attr('boolean'),
    columns: DS.attr(),
    cached_results: DS.attr(),
    dashboards: DS.hasMany('dashboards'),
    tags: DS.hasMany('tags'),
    variables: DS.hasMany('variables'),

    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    cachedResults: Ember.on('didLoad', Ember.observer("updated_at", "resultsCanBeLoaded" , "cached_results", function(){
        if (this.get('resultsCanBeLoaded')){
            this.set("loading", true)
            this.set('results', null)
            this.get('resultsCall').call(this).then((response)=>{
                this.set('results', response.data)
                this.set("loading", false)
                // }).then((error)=>{
                //     this.set('resultError', error.error)
                //     this.set("loading", false)
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

    resultsCall: memberAction({ path: 'results', type: 'get' }),
    resultsCanBeLoaded: false

});
