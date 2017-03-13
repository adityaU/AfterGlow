import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';


export default DS.Model.extend({
    title: DS.attr('string'),
    results_view_settings: DS.attr(),
    human_sql: DS.attr(),
    query_type: DS.attr('string'),
    sql: DS.attr('string'),
    created_at: DS.attr('date'),
    shareable_link: DS.attr('string'),
    updated_at: DS.attr('date'),
    is_shareable_link_public: DS.attr('boolean'),
    dashboards: DS.hasMany('dashboards'),

    cachedResults: Ember.observer("updated_at", function(){
        this.set("loading", true)
        this.get('resultsCall').call(this).then((response)=>{
            this.set('results', response.data)
            this.set("loading", false)
        // }).then((error)=>{
        //     this.set('resultError', error.error)
        //     this.set("loading", false)
        });
    }),



    resultsCall: memberAction({ path: 'results', type: 'get' }) 

});
