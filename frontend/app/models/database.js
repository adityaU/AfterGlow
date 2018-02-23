import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';

export default DS.Model.extend({
    name: DS.attr('string'),
    db_type: DS.attr('string'),
    config: DS.attr(),
    last_accessed_at: DS.attr('date'),
    unique_identifier: DS.attr('string'),
    tables: DS.hasMany('table'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    sync: memberAction({ path: 'sync' }),
    toJSON: function() {
        return this._super({ includeId: true });
    }

});
