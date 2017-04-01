import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    readable_table_name: DS.attr('string'),
    database: DS.belongsTo('database'),
    human_name: DS.attr('string'),
    columns: DS.hasMany('column', {async: true}),

  toJSON: function() {
    return this._super({ includeId: true });
  }
});
