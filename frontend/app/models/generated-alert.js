import DS from 'ember-data';

export default DS.Model.extend({
    alert: DS.belongsTo('alert'),
    status: DS.attr('string'),
    failing_conditions: DS.attr('object'), 

    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

});
