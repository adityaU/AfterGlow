import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    permission_set: DS.belongsTo('permission_set'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

});
