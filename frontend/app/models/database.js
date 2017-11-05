import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    db_url: DS.attr('string'),
    last_accessed_at: DS.attr('date'),
    tables: DS.hasMany('table'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    toJSON: function() {
        return this._super({ includeId: true });
    }

});
