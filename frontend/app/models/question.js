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
    dashboards: DS.hasMany('dashboards'),
    tags: DS.hasMany('tags'),

    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    cachedResults: Ember.on('didLoad', Ember.observer("updated_at", "resultsCanBeLoaded" ,function(){
        if (this.get('resultsCanBeLoaded')){
            this.set("loading", true)
            this.get('resultsCall').call(this).then((response)=>{
                this.set('results', response.data)
                this.set("loading", false)
                // }).then((error)=>{
                //     this.set('resultError', error.error)
                //     this.set("loading", false)
            });
        }
    })),



    resultsCall: memberAction({ path: 'results', type: 'get' }),
    resultsCanBeLoaded: false

});
