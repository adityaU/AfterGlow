import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    results_view_settings: DS.attr(),
    human_sql: DS.attr(),
    query_type: DS.attr('string'),
    sql: DS.attr('string'),
    created_at: DS.attr('date'),
    shareable_link: DS.attr('string'),
    updated_at: DS.attr('date')

});
