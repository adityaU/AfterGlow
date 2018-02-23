import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';

export default DS.Model.extend({
    name: DS.attr('string'),
    readable_table_name: DS.attr('string'),
    description: DS.attr('string'),
    database: DS.belongsTo('database'),
    human_name: DS.attr('string'),
    columns: DS.hasMany('column', {async: true}),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

  toJSON: function() {
    return this._super({ includeId: true });
  }
});
