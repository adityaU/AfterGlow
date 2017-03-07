import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    db_type: DS.attr('string'),
    config: DS.attr(),
    last_accessed_at: DS.attr('date'),
    unique_identifier: DS.attr('string'),
    tables: DS.hasMany('table')


});
