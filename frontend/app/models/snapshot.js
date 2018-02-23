import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    columns: DS.attr(),
    question: DS.belongsTo('question'),
    snapshotData: DS.hasMany('snapshot_datum'),

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
});
