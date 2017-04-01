import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    db_type: DS.attr('string'),
    config: DS.attr(),
    last_accessed_at: DS.attr('date'),
    unique_identifier: DS.attr('string'),
    tables: DS.hasMany('table'),

    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    toJSON: function() {
        return this._super({ includeId: true });
    }

});
